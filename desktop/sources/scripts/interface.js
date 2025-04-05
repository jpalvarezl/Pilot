"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Interface;
var Tone = require('tone');
function Interface(pilot, id, node) {
    this.node = node;
    this.meter = new Tone.Meter(0.95);
    this.waveform = new Tone.Waveform(256);
    this.el = document.createElement('div');
    this.el.id = "ch".concat(id);
    this.canvas = document.createElement('canvas');
    var self = this;
    var waveform = this.waveform;
    var meter = this.meter;
    var canvasWidth = 13 * 4;
    var canvasHeight = 13 * 2;
    var context = this.canvas.getContext('2d');
    var lastUpdate = null;
    this.install = function (host) {
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.canvas.style.width = "".concat(canvasWidth / 2, "px");
        this.canvas.style.height = "".concat(canvasHeight / 2, "px");
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
    this.start = function () {
        this.updateAll({}, true);
        loop();
    };
    this.connect = function (node) {
        this.node.connect(node);
    };
    function draw(level) {
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
    function drawWaveform() {
        var values = waveform.getValue();
        var level = meter.getLevel();
        var gain = Tone.dbToGain(level);
        if (context) {
            context.beginPath();
            context.moveTo(0, Math.floor(((values[0] + 1) / 2) * canvasHeight));
            if (gain > 0.01) {
                for (var i = 1, len = values.length; i < len; i++) {
                    if (i % 17 !== 0) {
                        continue;
                    }
                    var x = Math.floor(canvasWidth * (i / len));
                    var y = Math.floor(((values[i] + 1) / 2) * canvasHeight);
                    context.lineTo(clamp(x, 2, canvasWidth - 2), clamp(y, 2, canvasHeight - 2));
                }
            }
            context.lineTo(canvasWidth, Math.floor(((values[0] + 1) / 2) * canvasHeight));
            context.stroke();
            context.closePath();
        }
    }
    function drawActivity() {
        if (!self) {
            return;
        }
        if (!self.lastNote) {
            return;
        }
        var elapsed = performance.now() - self.lastNote;
        var max = 500;
        context.beginPath();
        context.arc(2, 4, 2, 0, 2 * Math.PI, false);
        context.fillStyle = "rgba(255,255,255,".concat(1 - elapsed / max, ")");
        context.fill();
        context.closePath();
    }
    function loop() {
        requestAnimationFrame(loop);
        drawWaveform();
    }
    function clamp(v, min, max) {
        return v < min ? min : v > max ? max : v;
    }
}
