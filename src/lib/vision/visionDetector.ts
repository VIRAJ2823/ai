import { GazeDirection, HeadOrientation, MonitoringEventType } from '../types';

export interface VisionDetectionResult {
  faceCount: number;
  faceDetected: boolean;
  boundingBox?: { x: number; y: number; width: number; height: number };
  headOrientation: HeadOrientation;
  gazeDirection: GazeDirection;
  lightingCondition: 'optimal' | 'low' | 'overexposed';
  luminance: number;
  confidence: number;
}

export class ClientVisionEngine {
  private videoElement: HTMLVideoElement | null = null;
  private canvasElement: HTMLCanvasElement | null = null;
  private canvasCtx: CanvasRenderingContext2D | null = null;
  private isRunning: boolean = false;
  private animationFrameId: number | null = null;
  private lastProcessTime: number = 0;
  private fpsCounter: number = 30;

  // Smoothing variables
  private smoothedYaw: number = 0;
  private smoothedPitch: number = 0;
  private smoothedRoll: number = 0;

  // Pattern detection state
  private faceAbsentStartTime: number | null = null;
  private lookingAwayStartTime: number | null = null;
  private lastReportedAbsentDuration: number = 0;

  // Callbacks
  public onResult?: (result: VisionDetectionResult) => void;
  public onEventTriggered?: (
    eventType: MonitoringEventType,
    durationSeconds: number,
    metadata: Record<string, any>
  ) => void;

  constructor() {
    if (typeof window !== 'undefined') {
      this.canvasElement = document.createElement('canvas');
      this.canvasCtx = this.canvasElement.getContext('2d', { willReadFrequently: true });
    }
  }

  public setVideoElement(video: HTMLVideoElement) {
    this.videoElement = video;
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.loop();
  }

  public stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.faceAbsentStartTime = null;
    this.lookingAwayStartTime = null;
  }

  private loop = () => {
    if (!this.isRunning) return;

    const now = performance.now();
    // Process at ~15-20 fps to conserve CPU while remaining responsive
    if (now - this.lastProcessTime >= 55) {
      this.processFrame(now);
      this.lastProcessTime = now;
    }

    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  private processFrame(currentTime: number) {
    if (!this.videoElement || !this.canvasElement || !this.canvasCtx) return;
    if (this.videoElement.readyState < 2) return;

    const vw = this.videoElement.videoWidth || 640;
    const vh = this.videoElement.videoHeight || 480;

    if (this.canvasElement.width !== vw || this.canvasElement.height !== vh) {
      this.canvasElement.width = vw;
      this.canvasElement.height = vh;
    }

    // Draw the current video frame into the offscreen canvas
    this.canvasCtx.drawImage(this.videoElement, 0, 0, vw, vh);

    // Analyze illumination & skin pixels
    const frameData = this.canvasCtx.getImageData(0, 0, vw, vh);
    const result = this.analyzeFrame(frameData, vw, vh);

    // Apply temporal smoothing to angles
    const alpha = 0.25;
    this.smoothedYaw = this.smoothedYaw * (1 - alpha) + result.headOrientation.yaw * alpha;
    this.smoothedPitch = this.smoothedPitch * (1 - alpha) + result.headOrientation.pitch * alpha;
    this.smoothedRoll = this.smoothedRoll * (1 - alpha) + result.headOrientation.roll * alpha;

    const smoothedResult: VisionDetectionResult = {
      ...result,
      headOrientation: {
        yaw: Math.round(this.smoothedYaw * 10) / 10,
        pitch: Math.round(this.smoothedPitch * 10) / 10,
        roll: Math.round(this.smoothedRoll * 10) / 10,
      },
    };

    // Update gaze direction based on smoothed yaw and pitch
    if (Math.abs(smoothedResult.headOrientation.yaw) < 14 && Math.abs(smoothedResult.headOrientation.pitch) < 14) {
      smoothedResult.gazeDirection = 'center';
    } else if (smoothedResult.headOrientation.yaw < -16) {
      smoothedResult.gazeDirection = 'left';
    } else if (smoothedResult.headOrientation.yaw > 16) {
      smoothedResult.gazeDirection = 'right';
    } else if (smoothedResult.headOrientation.pitch < -16) {
      smoothedResult.gazeDirection = 'up';
    } else if (smoothedResult.headOrientation.pitch > 16) {
      smoothedResult.gazeDirection = 'down';
    } else {
      smoothedResult.gazeDirection = 'away';
    }

    if (this.onResult) {
      this.onResult(smoothedResult);
    }

    // Proctoring pattern checks:
    this.evaluatePatterns(smoothedResult, currentTime);
  }

  private evaluatePatterns(result: VisionDetectionResult, currentTime: number) {
    // 1. Check face absence
    if (!result.faceDetected) {
      if (!this.faceAbsentStartTime) {
        this.faceAbsentStartTime = currentTime;
      } else {
        const absentSeconds = (currentTime - this.faceAbsentStartTime) / 1000;
        // Trigger event if absent for >= 3.5 seconds and not triggered recently
        if (absentSeconds >= 3.5 && absentSeconds - this.lastReportedAbsentDuration >= 4.0) {
          this.lastReportedAbsentDuration = absentSeconds;
          this.onEventTriggered?.(
            'face_not_detected',
            Math.round(absentSeconds * 10) / 10,
            {
              description: 'Face not detected in camera frame for an extended period',
              detail: `Camera active, but no student face observed for ${Math.round(absentSeconds)}s`,
              faceCount: 0,
              lightingCondition: result.lightingCondition,
            }
          );
        }
      }
    } else {
      // If face reappeared after being absent for >= 3 seconds, emit normal observation
      if (this.faceAbsentStartTime && (currentTime - this.faceAbsentStartTime) / 1000 >= 3) {
        const absentTotal = (currentTime - this.faceAbsentStartTime) / 1000;
        this.onEventTriggered?.(
          'normal_observation',
          0.5,
          {
            description: 'Student face returned to camera frame',
            detail: `Face detected again after ${Math.round(absentTotal * 10) / 10}s absence`,
            faceCount: result.faceCount,
          }
        );
      }
      this.faceAbsentStartTime = null;
      this.lastReportedAbsentDuration = 0;
    }

    // 2. Check multiple faces
    if (result.faceCount > 1) {
      this.onEventTriggered?.(
        'multiple_face_detected',
        1.5,
        {
          description: 'Multiple faces observed in frame',
          detail: `${result.faceCount} faces temporarily visible in camera stream`,
          faceCount: result.faceCount,
        }
      );
    }

    // 3. Check looking away patterns (sustained turning away > 4.5 seconds)
    const isLookingAway = result.faceDetected && (
      Math.abs(result.headOrientation.yaw) > 28 ||
      result.headOrientation.pitch > 26 ||
      result.headOrientation.pitch < -24
    );

    if (isLookingAway) {
      if (!this.lookingAwayStartTime) {
        this.lookingAwayStartTime = currentTime;
      } else {
        const awaySeconds = (currentTime - this.lookingAwayStartTime) / 1000;
        if (awaySeconds >= 4.5) {
          this.onEventTriggered?.(
            'attention_required',
            Math.round(awaySeconds * 10) / 10,
            {
              description: 'Extended gaze deflection or head orientation away from screen',
              detail: `Head orientation maintained at Yaw: ${result.headOrientation.yaw}°, Pitch: ${result.headOrientation.pitch}° for ${Math.round(awaySeconds)}s`,
              headOrientation: result.headOrientation,
              gazeDirection: result.gazeDirection,
            }
          );
          // reset timer so we don't spam every frame
          this.lookingAwayStartTime = currentTime - 2000;
        }
      }
    } else {
      this.lookingAwayStartTime = null;
    }
  }

  private analyzeFrame(
    frameData: ImageData,
    width: number,
    height: number
  ): VisionDetectionResult {
    const data = frameData.data;
    let totalLuminance = 0;
    let skinPixelCount = 0;

    // Fast sampling (step by 4 pixels in x and y to stay under 5ms runtime)
    const step = 4;
    let sumX = 0;
    let sumY = 0;

    let minX = width;
    let maxX = 0;
    let minY = height;
    let maxY = 0;

    // Detect distinct skin clusters for multiple face detection
    let leftSideSkin = 0;
    let rightSideSkin = 0;

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const idx = (y * width + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

        // Luminance calculation
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        totalLuminance += lum;

        // General human skin color tone range in RGB & YCbCr space
        // r > 80, g > 40, b > 20, r > g, r > b, |r - g| > 12
        const isSkin =
          r > 70 &&
          g > 35 &&
          b > 20 &&
          r > g &&
          r > b &&
          Math.abs(r - g) >= 10 &&
          (Math.max(r, g, b) - Math.min(r, g, b)) > 15;

        if (isSkin) {
          skinPixelCount++;
          sumX += x;
          sumY += y;

          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;

          if (x < width * 0.45) leftSideSkin++;
          if (x > width * 0.55) rightSideSkin++;
        }
      }
    }

    const sampledPixels = (width / step) * (height / step);
    const avgLuminance = totalLuminance / sampledPixels;

    let lightingCondition: 'optimal' | 'low' | 'overexposed' = 'optimal';
    if (avgLuminance < 40) lightingCondition = 'low';
    if (avgLuminance > 220) lightingCondition = 'overexposed';

    // Face detected if reasonable skin mass is centered
    const minSkinThreshold = sampledPixels * 0.035; // At least ~3.5% skin pixels
    const faceDetected = skinPixelCount >= minSkinThreshold && avgLuminance >= 25;

    // Multiple faces estimation: two separate large clusters with a gap in the center
    const isMultiFace =
      faceDetected &&
      leftSideSkin > sampledPixels * 0.045 &&
      rightSideSkin > sampledPixels * 0.045 &&
      (maxX - minX) > width * 0.72;

    const faceCount = !faceDetected ? 0 : isMultiFace ? 2 : 1;

    // Centroid of face
    const centerX = skinPixelCount > 0 ? sumX / skinPixelCount : width / 2;
    const centerY = skinPixelCount > 0 ? sumY / skinPixelCount : height / 2;

    // Normalize centroid to (-1 to +1) relative to frame center
    const normX = (centerX - width / 2) / (width / 2); // -1 (left) to +1 (right)
    const normY = (centerY - height / 2) / (height / 2); // -1 (top) to +1 (bottom)

    // Calculate approximate yaw and pitch
    // Yaw: looking right tilts centroid right or asymmetric pixel cluster
    const yaw = faceDetected ? Math.max(-50, Math.min(50, normX * 42)) : 0;
    const pitch = faceDetected ? Math.max(-40, Math.min(40, normY * 35)) : 0;
    const roll = faceDetected ? Math.max(-30, Math.min(30, (normX * normY) * 15)) : 0;

    const boundingBox = faceDetected
      ? {
          x: Math.max(0, minX),
          y: Math.max(0, minY),
          width: Math.min(width - minX, Math.max(80, maxX - minX)),
          height: Math.min(height - minY, Math.max(100, maxY - minY)),
        }
      : undefined;

    return {
      faceCount,
      faceDetected,
      boundingBox,
      headOrientation: { yaw, pitch, roll },
      gazeDirection: 'center',
      lightingCondition,
      luminance: Math.round(avgLuminance),
      confidence: faceDetected ? Math.min(0.98, skinPixelCount / (sampledPixels * 0.15)) : 0,
    };
  }
}
