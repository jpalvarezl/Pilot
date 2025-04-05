"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var interface_1 = require("./interface");
'use strict';
var Tone = {
    Synth: /** @class */ (function () {
        function class_1() {
        }
        class_1.prototype.triggerAttackRelease = function (note, length, time, velocity) {
            console.log("Playing note: ".concat(note, ", Length: ").concat(length, ", Time: ").concat(time, ", Velocity: ").concat(velocity));
        };
        return class_1;
    }()),
};
var OCTAVE = ['C', 'c', 'D', 'd', 'E', 'F', 'f', 'G', 'g', 'A', 'a', 'B'];
var WAVCODES = ['si', 'tr', 'sq', 'sw', '2i', '2r', '2q', '2w', '4i', '4r', '4q', '4w', '8i', '8r', '8q', '8w'];
var WAVNAMES = ['sine', 'triangle', 'square', 'sawtooth', 'sine2', 'triangle2', 'square2', 'sawtooth2', 'sine4', 'triangle4', 'square4', 'sawtooth4', 'sine8', 'triangle8', 'square8', 'sawtooth8'];
var ChannelInterface = /** @class */ (function () {
    function ChannelInterface(pilot, id, node) {
        interface_1.default.call(this, pilot, id, node);
        this.node = node;
        this.el = document.createElement('div');
        this.el.id = "ch".concat(id);
        this.el.className = 'channel';
        this.cid_el = document.createElement('span');
        this.cid_el.className = "cid";
        this.env_el = document.createElement('span');
        this.env_el.className = "env";
        this.osc_el = document.createElement('span');
        this.osc_el.className = "osc";
        this.cid_el.innerHTML = "".concat(id);
        this.el.appendChild(this.cid_el);
        this.el.appendChild(this.env_el);
        this.el.appendChild(this.osc_el);
    }
    ChannelInterface.prototype.run = function (msg) {
        var channel = "".concat(msg).substr(0, 1);
        if (channel === this.el.id) {
            this.operate("".concat(msg).substr(1));
        }
    };
    ChannelInterface.prototype.operate = function (msg) {
        var data = this.parse("".concat(msg));
        if (!data) {
            console.warn("Unknown data");
            return;
        }
        if (data.isEnv) {
            this.setEnv(data);
        }
        else if (data.isOsc) {
            this.setOsc(data);
        }
        else if (data.isNote) {
            this.playNote(data);
        }
    };
    ChannelInterface.prototype.playNote = function (data) {
        if (isNaN(data.octave)) {
            return;
        }
        if (OCTAVE.indexOf(data.note) < 0) {
            console.warn("Unknown Note");
            return;
        }
        var name = "".concat(data.note).concat(data.sharp).concat(data.octave);
        var length = Math.max(0.1, Math.min(data.length, 0.9));
        this.node.triggerAttackRelease(name, length, '+0', data.velocity);
    };
    ChannelInterface.prototype.setEnv = function (data) {
        if (!this.node.envelope) {
            return;
        }
        if (!isNaN(data.attack)) {
            this.node.envelope.attack = Math.max(0.01, Math.min(data.attack, 1.0));
        }
        if (!isNaN(data.decay)) {
            this.node.envelope.decay = Math.max(0.01, Math.min(data.decay, 1.0));
        }
        if (!isNaN(data.sustain)) {
            this.node.envelope.sustain = Math.max(0.01, Math.min(data.sustain, 1.0));
        }
        if (!isNaN(data.release)) {
            this.node.envelope.release = Math.max(0.01, Math.min(data.release, 1.0));
        }
    };
    ChannelInterface.prototype.setOsc = function (data) {
        if (data.wav && this.node.oscillator) {
            this.node.oscillator.type = data.wav;
        }
        if (data.mod && this.node.modulation) {
            this.node.modulation.type = data.mod;
        }
    };
    ChannelInterface.prototype.parse = function (msg) {
        var cmd = msg.substr(0, 3).toLowerCase();
        var val = msg.substr(3);
        if (cmd === 'osc') {
            return { isOsc: true, wav: val.substr(0, 2), mod: val.substr(2, 2) };
        }
        else if (cmd === 'env') {
            return { isEnv: true, attack: parseFloat(val.substr(0, 1)), decay: parseFloat(val.substr(1, 1)), sustain: parseFloat(val.substr(2, 1)), release: parseFloat(val.substr(3, 1)) };
        }
        else if (cmd === 'note') {
            return { isNote: true, note: val.substr(0, 1), octave: parseInt(val.substr(1, 1), 10), sharp: val.substr(2, 1) === '#' };
        }
        return null;
    };
    ChannelInterface.prototype.connect = function (node) {
        console.log("Connecting channel ".concat(this.el.id, " to node."));
        // Implement connection logic here
    };
    ChannelInterface.prototype.install = function (host) {
        console.log("Installing channel ".concat(this.el.id, "."));
        host.appendChild(this.el);
    };
    ChannelInterface.prototype.start = function () {
        console.log("Starting channel ".concat(this.el.id, "."));
        // Implement start logic here
    };
    ChannelInterface.prototype.randEnv = function () {
        console.log("Randomizing envelope for channel ".concat(this.el.id, "."));
        // Implement random envelope logic here
    };
    ChannelInterface.prototype.randOsc = function () {
        console.log("Randomizing oscillator for channel ".concat(this.el.id, "."));
        // Implement random oscillator logic here
    };
    return ChannelInterface;
}());
exports.default = ChannelInterface;
