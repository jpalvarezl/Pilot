"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const interface_channel_1 = __importDefault(require("./interface.channel"));
const interface_effect_1 = __importDefault(require("./interface.effect"));
const Tone = require('tone');
class Mixer {
    constructor(pilot) {
        this.el = document.createElement('div');
        this.el.id = 'mixer';
        this.channels = [];
        this.effects = {};
        this.pilot = pilot;
        this.initializeChannels(pilot);
        this.initializeEffects(pilot);
    }
    initializeChannels(pilot) {
        this.channels[0] = new interface_channel_1.default(pilot, '0', new Tone.AMSynth({ 'harmonicity': 1.25, 'oscillator': { 'type': 'sine8' }, 'modulation': { 'type': 'sine' } }));
        this.channels[1] = new interface_channel_1.default(pilot, '1', new Tone.AMSynth({ 'harmonicity': 1.5, 'oscillator': { 'type': 'triangle8' }, 'modulation': { 'type': 'sawtooth' } }));
        this.channels[2] = new interface_channel_1.default(pilot, '2', new Tone.AMSynth({ 'harmonicity': 1.75, 'oscillator': { 'type': 'sawtooth8' }, 'modulation': { 'type': 'triangle' } }));
        this.channels[3] = new interface_channel_1.default(pilot, '3', new Tone.AMSynth({ 'harmonicity': 2, 'oscillator': { 'type': 'square8' }, 'modulation': { 'type': 'square' } }));
        // AM
        this.channels[4] = new interface_channel_1.default(pilot, '4', new Tone.AMSynth({ 'harmonicity': 1.25, 'oscillator': { 'type': 'sine4' }, 'modulation': { 'type': 'square8' } }));
        this.channels[5] = new interface_channel_1.default(pilot, '5', new Tone.AMSynth({ 'harmonicity': 1.5, 'oscillator': { 'type': 'triangle4' }, 'modulation': { 'type': 'sawtooth8' } }));
        this.channels[6] = new interface_channel_1.default(pilot, '6', new Tone.FMSynth({ 'harmonicity': 1.75, 'modulationIndex': 10, 'oscillator': { 'type': 'sawtooth4' }, 'modulation': { 'type': 'triangle8' } }));
        this.channels[7] = new interface_channel_1.default(pilot, '7', new Tone.FMSynth({ 'harmonicity': 2, 'modulationIndex': 20, 'oscillator': { 'type': 'square4' }, 'modulation': { 'type': 'sine8' } }));
        // FM
        this.channels[8] = new interface_channel_1.default(pilot, '8', new Tone.FMSynth({ 'harmonicity': 0.5, 'modulationIndex': 30, 'oscillator': { 'type': 'sine' }, 'modulation': { 'type': 'sawtooth4' } }));
        this.channels[9] = new interface_channel_1.default(pilot, '9', new Tone.FMSynth({ 'harmonicity': 2.5, 'modulationIndex': 40, 'oscillator': { 'type': 'sine' }, 'modulation': { 'type': 'triangle8' } }));
        this.channels[10] = new interface_channel_1.default(pilot, '10', new Tone.MonoSynth({ 'volume': -20, oscillator: { 'type': 'sawtooth4' } }));
        this.channels[11] = new interface_channel_1.default(pilot, '11', new Tone.MonoSynth({ 'volume': -20, oscillator: { 'type': 'sine4' } }));
        // Membrane
        this.channels[12] = new interface_channel_1.default(pilot, '12', new Tone.MembraneSynth({ 'octaves': 5, 'oscillator': { 'type': 'sine' } }));
        this.channels[13] = new interface_channel_1.default(pilot, '13', new Tone.MembraneSynth({ 'octaves': 10, 'oscillator': { 'type': 'sawtooth' } }));
        this.channels[14] = new interface_channel_1.default(pilot, '14', new Tone.MembraneSynth({ 'octaves': 15, 'oscillator': { 'type': 'triangle' } }));
        this.channels[15] = new interface_channel_1.default(pilot, '15', new Tone.MembraneSynth({ 'octaves': 20, 'oscillator': { 'type': 'square' } }));
    }
    initializeEffects(pilot) {
        this.effects.bitcrusher = new interface_effect_1.default(pilot, 'bit', new Tone.BitCrusher(4));
        this.effects.distortion = new interface_effect_1.default(pilot, 'dis', new Tone.Distortion(0.05));
        this.effects.autowah = new interface_effect_1.default(pilot, 'wah', new Tone.AutoWah(100, 6, 0));
        this.effects.chebyshev = new interface_effect_1.default(pilot, 'che', new Tone.Chebyshev(50));
        // II
        this.effects.feedback = new interface_effect_1.default(pilot, 'fee', new Tone.FeedbackDelay(0));
        this.effects.delay = new interface_effect_1.default(pilot, 'del', new Tone.PingPongDelay('4n', 0.2));
        this.effects.tremolo = new interface_effect_1.default(pilot, 'tre', new Tone.Tremolo());
        this.effects.reverb = new interface_effect_1.default(pilot, 'rev', new Tone.JCReverb(0));
        // III
        this.effects.phaser = new interface_effect_1.default(pilot, 'pha', new Tone.Phaser(0.5, 3, 350));
        this.effects.vibrato = new interface_effect_1.default(pilot, 'vib', new Tone.Vibrato());
        this.effects.chorus = new interface_effect_1.default(pilot, 'cho', new Tone.Chorus(4, 2.5, 0.5));
        this.effects.widener = new interface_effect_1.default(pilot, 'ste', new Tone.StereoWidener(0.5, 3, 350));
        // Mastering
        this.effects.equalizer = new interface_effect_1.default(pilot, 'equ', new Tone.EQ3(5, 0, 5));
        this.effects.compressor = new interface_effect_1.default(pilot, 'com', new Tone.Compressor(-6, 4));
        this.effects.volume = new interface_effect_1.default(pilot, 'vol', new Tone.Volume(6));
        this.effects.limiter = new interface_effect_1.default(pilot, 'lim', new Tone.Limiter(-2));
    }
    install(host) {
        console.log('Mixer', 'Installing..');
        Tone.start();
        Tone.Transport.start();
        for (const id in this.channels) {
            this.channels[id].connect(this.effects.bitcrusher.node);
        }
        this.effects.bitcrusher.connect(this.effects.distortion.node);
        this.effects.distortion.connect(this.effects.autowah.node);
        this.effects.autowah.connect(this.effects.chebyshev.node);
        this.effects.chebyshev.connect(this.effects.feedback.node);
        this.effects.feedback.connect(this.effects.delay.node);
        this.effects.delay.connect(this.effects.tremolo.node);
        this.effects.tremolo.connect(this.effects.reverb.node);
        this.effects.reverb.connect(this.effects.phaser.node);
        this.effects.phaser.connect(this.effects.vibrato.node);
        this.effects.vibrato.connect(this.effects.chorus.node);
        this.effects.chorus.connect(this.effects.widener.node);
        this.effects.widener.connect(this.effects.equalizer.node);
        this.effects.equalizer.connect(this.effects.compressor.node);
        this.effects.compressor.connect(this.effects.volume.node);
        this.effects.volume.connect(this.effects.limiter.node);
        for (const id in this.channels) {
            this.channels[id].install(this.el);
        }
        for (const id in this.effects) {
            this.effects[id].install(this.el);
        }
        host.appendChild(this.el);
    }
    start() {
        console.log('Synthetiser', 'Starting..');
        for (const id in this.channels) {
            this.channels[id].start();
        }
        for (const id in this.effects) {
            this.effects[id].start();
        }
        this.reset();
        this.setSpeed(120); // Pass a number directly
        setTimeout(() => { this.effects.limiter.node.toMaster(); }, 2000);
        this.run(''); // Provide an empty string as the default argument
    }
    run(msg) {
        if (`${msg}`.indexOf(';') > -1) {
            const parts = `${msg}`.split(';');
            for (const id in parts) {
                this.run(parts[id]);
            }
            return;
        }
        for (const id in this.channels) {
            this.channels[id].run(msg);
        }
        for (const id in this.effects) {
            this.effects[id].run(msg);
        }
        if (msg && `${msg}`.substr(0, 3).toLowerCase() === 'bpm') {
            this.setSpeed(parseInt(msg.substr(3))); // Convert string to number
        }
        if (msg && `${msg}`.substr(0, 4).toLowerCase() === 'renv') {
            for (const id in this.channels) {
                this.channels[id].randEnv();
            }
        }
        if (msg && `${msg}`.substr(0, 4).toLowerCase() === 'rosc') {
            for (const id in this.channels) {
                this.channels[id].randOsc();
            }
        }
        if (msg && `${msg}`.substr(0, 4).toLowerCase() === 'refx') {
            for (const id in this.effects) {
                this.effects[id].rand(); // Remove the argument
            }
        }
        if (msg && `${msg}`.substr(0, 5).toLowerCase() === 'reset') {
            this.reset();
        }
    }
    setSpeed(bpm) {
        if (bpm < 30) {
            return;
        }
        Tone.Transport.bpm.rampTo(bpm, 4);
        console.log(`Changed BPM to ${bpm}.`);
        if (this.pilot && this.pilot.recorder) {
            this.pilot.recorder.el.innerHTML = `${bpm}`;
        }
    }
    reset() {
        for (const id in this.channels) {
            this.channels[id].setEnv({ isEnv: true,
                attack: 0.001,
                decay: clamp(((8 - (parseInt(id) % 8)) / 8), 0.01, 0.9),
                sustain: clamp(((parseInt(id) % 4) / 4), 0.01, 0.9),
                release: clamp(((parseInt(id) % 6) / 6), 0.01, 0.9)
            });
        }
        this.run('0OSC8ISI;1OSC8RSW;2OSC8WTR;3OSC8QSQ;4OSC4I8Q;5OSC4R8W;6OSCTR8R;7OSCTR8I;8OSCTR4W;9OSCTR8R;AOSC4W--;BOSC4I--;COSCSI--;DOSCSW--;EOSCTR--;FOSCSQ--');
        this.run('BIT07;DIS00;WAH0F;CHE07;FEE00;TRE07;REV00;PHA0F;VIB01;CHO07');
    }
}
exports.default = Mixer;
function clamp(v, min, max) { return v < min ? min : v > max ? max : v; }
