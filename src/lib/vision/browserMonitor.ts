import { MonitoringEventType } from '../types';

export interface BrowserActivityCallbacks {
  onTabHidden: (timestamp: number) => void;
  onTabVisible: (durationSeconds: number) => void;
  onWindowBlur: () => void;
  onWindowFocus: () => void;
  onEvent: (
    eventType: MonitoringEventType,
    durationSeconds: number,
    metadata: Record<string, any>
  ) => void;
}

export class BrowserActivityMonitor {
  private isListening: boolean = false;
  private tabHiddenStartTime: number | null = null;
  private windowBlurStartTime: number | null = null;
  private callbacks: Partial<BrowserActivityCallbacks> = {};

  constructor(callbacks: Partial<BrowserActivityCallbacks> = {}) {
    this.callbacks = callbacks;
  }

  public start() {
    if (typeof window === 'undefined' || this.isListening) return;
    this.isListening = true;

    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    window.addEventListener('blur', this.handleWindowBlur);
    window.addEventListener('focus', this.handleWindowFocus);
  }

  public stop() {
    if (typeof window === 'undefined' || !this.isListening) return;
    this.isListening = false;

    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('blur', this.handleWindowBlur);
    window.removeEventListener('focus', this.handleWindowFocus);
  }

  private handleVisibilityChange = () => {
    const now = Date.now();
    if (document.hidden) {
      this.tabHiddenStartTime = now;
      this.callbacks.onTabHidden?.(now);

      this.callbacks.onEvent?.('tab_visibility_change', 0, {
        description: 'Interview tab hidden or switched away',
        detail: 'The browser tab was switched or minimized by the student',
        browserState: 'hidden',
        triggerSource: 'visibilitychange',
      });
    } else {
      let durationSeconds = 0;
      if (this.tabHiddenStartTime) {
        durationSeconds = Math.round(((now - this.tabHiddenStartTime) / 1000) * 10) / 10;
        this.tabHiddenStartTime = null;
      }
      this.callbacks.onTabVisible?.(durationSeconds);

      this.callbacks.onEvent?.('tab_visibility_change', durationSeconds, {
        description: 'Interview tab became visible again',
        detail: `Student returned to the interview tab after ${durationSeconds} seconds`,
        browserState: 'visible',
        triggerSource: 'visibilitychange',
        duration_seconds: durationSeconds,
      });
    }
  };

  private handleWindowBlur = () => {
    this.windowBlurStartTime = Date.now();
    this.callbacks.onWindowBlur?.();

    this.callbacks.onEvent?.('normal_observation', 0, {
      description: 'Browser window lost focus',
      detail: 'Window focus shifted temporarily (e.g. OS notification or window rearrangement)',
      browserState: 'blur',
      triggerSource: 'window_blur',
    });
  };

  private handleWindowFocus = () => {
    let blurDuration = 0;
    if (this.windowBlurStartTime) {
      blurDuration = Math.round(((Date.now() - this.windowBlurStartTime) / 1000) * 10) / 10;
      this.windowBlurStartTime = null;
    }
    this.callbacks.onWindowFocus?.();
  };
}
