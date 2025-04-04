"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const interface_1 = __importDefault(require("./interface"));
'use strict';
const Tone = {
    Synth: class {
        triggerAttackRelease(note, length, time, velocity) {
            console.log(`Playing note: ${note}, Length: ${length}, Time: ${time}, Velocity: ${velocity}`);
        }
    },
};
const OCTAVE = ['C', 'c', 'D', 'd', 'E', 'F', 'f', 'G', 'g', 'A', 'a', 'B'];
const WAVCODES = ['si', 'tr', 'sq', 'sw', '2i', '2r', '2q', '2w', '4i', '4r', '4q', '4w', '8i', '8r', '8q', '8w'];
const WAVNAMES = ['sine', 'triangle', 'square', 'sawtooth', 'sine2', 'triangle2', 'square2', 'sawtooth2', 'sine4', 'triangle4', 'square4', 'sawtooth4', 'sine8', 'triangle8', 'square8', 'sawtooth8'];
class ChannelInterface {
    constructor(pilot, id, node) {
        interface_1.default.call(this, pilot, id, node);
        this.node = node;
        this.el = document.createElement('div');
        this.el.id = `ch${id}`;
        this.el.className = 'channel';
        this.cid_el = document.createElement('span');
        this.cid_el.className = `cid`;
        this.env_el = document.createElement('span');
        this.env_el.className = `env`;
        this.osc_el = document.createElement('span');
        this.osc_el.className = `osc`;
        this.cid_el.innerHTML = `${id}`;
        this.el.appendChild(this.cid_el);
        this.el.appendChild(this.env_el);
        this.el.appendChild(this.osc_el);
    }
    run(msg) {
        const channel = `${msg}`.substr(0, 1);
        if (channel === this.el.id) {
            this.operate(`${msg}`.substr(1));
        }
    }
    operate(msg) {
        const data = this.parse(`${msg}`);
        if (!data) {
            console.warn(`Unknown data`);
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
    }
    playNote(data) {
        if (isNaN(data.octave)) {
            return;
        }
        if (OCTAVE.indexOf(data.note) < 0) {
            console.warn(`Unknown Note`);
            return;
        }
        const name = `${data.note}${data.sharp}${data.octave}`;
        const length = Math.max(0.1, Math.min(data.length, 0.9));
        this.node.triggerAttackRelease(name, length, '+0', data.velocity);
    }
    setEnv(data) {
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
    }
    setOsc(data) {
        if (data.wav && this.node.oscillator) {
            this.node.oscillator.type = data.wav;
        }
        if (data.mod && this.node.modulation) {
            this.node.modulation.type = data.mod;
        }
    }
    parse(msg) {
        const cmd = msg.substr(0, 3).toLowerCase();
        const val = msg.substr(3);
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
    }
    connect(node) {
        console.log(`Connecting channel ${this.el.id} to node.`);
        // Implement connection logic here
    }
    install(host) {
        console.log(`Installing channel ${this.el.id}.`);
        host.appendChild(this.el);
    }
    start() {
        console.log(`Starting channel ${this.el.id}.`);
        // Implement start logic here
    }
    randEnv() {
        console.log(`Randomizing envelope for channel ${this.el.id}.`);
        // Implement random envelope logic here
    }
    randOsc() {
        console.log(`Randomizing oscillator for channel ${this.el.id}.`);
        // Implement random oscillator logic here
    }
}
exports.default = ChannelInterface;
