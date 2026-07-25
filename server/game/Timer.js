class Timer {
  constructor(duration, onTick, onEnd) {
    this.duration = duration * 1000; // ms
    this.startTime = null;
    this.endTime = null;
    this.onTick = onTick;
    this.onEnd = onEnd;
    this.interval = null;
    this.paused = false;
    this.lastRemaining = duration;
  }

  start() {
    this.startTime = Date.now();
    this.endTime = this.startTime + this.duration;
    this.lastRemaining = this.duration / 1000;

    this.interval = setInterval(() => {
      if (this.paused) return;

      const remaining = Math.max(0, Math.ceil((this.endTime - Date.now()) / 1000));

      if (remaining !== this.lastRemaining) {
        this.lastRemaining = remaining;
        if (this.onTick) this.onTick(remaining);
      }

      if (remaining <= 0) {
        this.stop();
        if (this.onEnd) this.onEnd();
      }
    }, 250); // Check 4x per second for accuracy
  }

  reduce(seconds) {
    this.endTime -= seconds * 1000;
    this.lastRemaining = -1; // Force next tick to emit
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  get remaining() {
    if (!this.endTime) return 0;
    return Math.max(0, Math.ceil((this.endTime - Date.now()) / 1000));
  }
}

module.exports = Timer;
