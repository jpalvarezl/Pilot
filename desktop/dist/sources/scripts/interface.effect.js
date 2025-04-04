"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const interface_1 = __importDefault(require("./interface"));
class EffectInterface {
    constructor(pilot, id, node) {
        this.lastEffect = null;
        interface_1.default.call(this, pilot, id, node);
        this.node = node;
        if (this.node.wet) {
            this.node.wet.value = 0;
        }
        this.el = document.createElement('div');
        this.el.id = `ch${id}`;
        this.el.className = 'effect';
        this.cid_el = document.createElement('span');
        this.cid_el.className = `cid`;
        this.val_el = document.createElement('span');
        this.val_el.className = `val`;
        this.cid_el.innerHTML = `${id}`;
        this.el.appendChild(this.cid_el);
        this.el.appendChild(this.val_el);
    }
    run(msg) {
        if (!msg || msg.substr(0, 3).toLowerCase() !== this.el.id) {
            return;
        }
        if (msg.substr(0, 3).toLowerCase() === this.el.id) {
            this.operate(`${msg}`.substr(3));
        }
    }
    operate(msg) {
        const data = this.parse(`${msg}`);
        if (!data) {
            console.warn(`Unknown data`);
            return;
        }
        this.setEffect(data);
    }
    setEffect(data) {
        if (this.lastEffect && performance.now() - this.lastEffect < 100) {
            return;
        }
        if (this.node.wet) {
            this.node.wet.value = data.wet;
        }
        if (!isNaN(data.value)) {
            if (this.el.id === 'rev') {
                this.node.roomSize.value = data.value;
            }
            else if (this.el.id === 'dis') {
                this.node.distortion = data.value;
            }
            else if (this.el.id === 'bit') {
                this.node.bits = Math.max(1, Math.min(parseInt((data.value * 8).toString()), 8));
            }
            else if (this.el.id === 'cho') {
                this.node.depth = data.value;
            }
            else if (this.el.id === 'fee') {
                this.node.delayTime.value = data.value;
            }
            else if (this.el.id === 'tre') {
                this.node.depth.value = data.value;
            }
            else if (this.el.id === 'vib') {
                this.node.depth.value = data.value;
            }
            else if (this.el.id === 'aut') {
                this.node.depth.value = data.value;
            }
            else if (this.el.id === 'pha') {
                this.node.octaves = Math.max(0, Math.min(parseInt((data.value * 3).toString()), 8));
            }
            else if (this.el.id === 'wah') {
                this.node.octaves = Math.max(0, Math.min(parseInt((data.value * 6).toString()), 8));
            }
            else if (this.el.id === 'che') {
                this.node.order = Math.max(0, Math.min(parseInt((data.value * 100).toString()), 8));
            }
            else {
                console.warn('Unknown value', this.node);
            }
        }
        this.lastEffect = performance.now();
        this.updateEffect(data, true);
    }
    rand() {
        this.operate(`${this.to16(Math.random() * 0.5)}${this.to16(Math.random() * 1)}`);
    }
    updateAll(data, force = false) {
        this.updateEffect(data, force);
    }
    updateEffect(data, force = false) {
        if (!force && (!data || !data.isEffect)) {
            return;
        }
        let value = 0;
        if (this.el.id === 'rev') {
            value = this.node.roomSize.value;
        }
        else if (this.el.id === 'dis') {
            value = this.node.distortion;
        }
        else if (this.el.id === 'cho') {
            value = this.node.depth;
        }
        else if (this.el.id === 'bit') {
            value = this.node.bits / 8;
        }
        else if (this.el.id === 'fee') {
            value = this.node.delayTime.value;
        }
        else if (this.el.id === 'tre') {
            value = this.node.depth.value;
        }
        else if (this.el.id === 'vib') {
            value = this.node.depth.value;
        }
        else if (this.el.id === 'aut') {
            value = this.node.depth.value;
        }
        else if (this.el.id === 'pha') {
            value = this.node.octaves / 3;
        }
        else if (this.el.id === 'wah') {
            value = this.node.octaves / 6;
        }
        else if (this.el.id === 'che') {
            value = this.node.order / 100;
        }
        if (this.node.wet) {
            this.setContent(this.val_el, `${this.to16(this.node.wet.value)}${this.to16(value)}`);
        }
    }
    parse(msg) {
        if (msg.length !== 2 && msg.length !== 1) {
            console.warn(`Misformatted effect`, msg);
            return;
        }
        const wet = parseInt(msg.substr(0, 1), 36) / 15;
        const value = parseInt(msg.substr(1, 1), 36) / 15;
        return { isEffect: true, code: this.el.id, wet: wet, value: value };
    }
    to16(float) {
        return Math.floor(float * 15).toString(36);
    }
    setContent(el, ct) {
        if (el.innerHTML !== ct) {
            el.innerHTML = ct;
        }
    }
    connect(node) {
        console.log(`Connecting effect ${this.el.id} to node.`);
        // Implement connection logic here
    }
    install(host) {
        console.log(`Installing effect ${this.el.id}.`);
        host.appendChild(this.el);
    }
    start() {
        console.log(`Starting effect ${this.el.id}.`);
        // Implement start logic here
    }
}
exports.default = EffectInterface;
