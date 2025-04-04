const Tone = require('tone');

export default function Interface(this: any, pilot: any, id: string, node: any): void {
  this.node = node;
  this.meter = new Tone.Meter(0.95);
  this.waveform = new Tone.Waveform(256);

  this.el = document.createElement('div');
  this.el.id = `ch${id}`;
  this.canvas = document.createElement('canvas');

  const self = this;
  const waveform = this.waveform;
  const meter = this.meter;
  const canvasWidth = 13 * 4;
  const canvasHeight = 13 * 2;
  const context = this.canvas.getContext('2d');

  let lastUpdate: number | null = null;

  this.install = function (this: any, host: HTMLElement): void {
    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;
    this.canvas.style.width = `${canvasWidth / 2}px`;
    this.canvas.style.height = `${canvasHeight / 2}px`;

    if (context) {
      context.lineJoin = 'round';
      context.lineWidth = 2;
      context.strokeStyle = pilot.theme.active.f_high;
    }

    this.node.connect(this.meter);
    this.node.fan(this.waveform);
    this.el.appendChild(this.canvas);
    host.appendChild(this.el);
  };

  this.start = function (this: any): void {
    this.updateAll({}, true);
    loop();
  };

  this.connect = function (this: any, node: any): void {
    this.node.connect(node);
  };

  function draw(level: number): void {
    if (lastUpdate && performance.now() - lastUpdate < 30) {
      return;
    }
    lastUpdate = performance.now();

    if (context) {
      context.clearRect(0, 0, canvasWidth, canvasHeight);
      context.beginPath();
      context.moveTo(0, ((level + 1) / 2) * canvasHeight);
      context.lineTo(canvasWidth, ((level + 1) / 2) * canvasHeight);
      context.stroke();
    }
  }

  function drawWaveform(): void {
    const values = waveform.getValue();
    const level = meter.getLevel();
    const gain = Tone.dbToGain(level);

    if (context) {
      context.beginPath();
      context.moveTo(0, Math.floor(((values[0] + 1) / 2) * canvasHeight));

      if (gain > 0.01) {
        for (let i = 1, len = values.length; i < len; i++) {
          if (i % 17 !== 0) {
            continue;
          }
          const x = Math.floor(canvasWidth * (i / len));
          const y = Math.floor(((values[i] + 1) / 2) * canvasHeight);
          context.lineTo(clamp(x, 2, canvasWidth - 2), clamp(y, 2, canvasHeight - 2));
        }
      }

      context.lineTo(canvasWidth, Math.floor(((values[0] + 1) / 2) * canvasHeight));

      context.stroke();
      context.closePath();
    }
  }

  function drawActivity(): void {
    if (!self) {
      return;
    }
    if (!self.lastNote) {
      return;
    }

    const elapsed = performance.now() - self.lastNote;
    const max = 500;

    context.beginPath();
    context.arc(2, 4, 2, 0, 2 * Math.PI, false);
    context.fillStyle = `rgba(255,255,255,${1 - elapsed / max})`;
    context.fill();
    context.closePath();
  }

  function loop(): void {
    requestAnimationFrame(loop);
    drawWaveform();
  }

  function clamp(v: number, min: number, max: number): number {
    return v < min ? min : v > max ? max : v;
  }
}
