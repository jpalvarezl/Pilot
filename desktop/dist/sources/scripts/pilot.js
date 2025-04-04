"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Pilot;
const listener_1 = __importDefault(require("./listener"));
const mixer_1 = __importDefault(require("./mixer"));
const recorder_1 = __importDefault(require("./recorder"));
const commander_1 = __importDefault(require("./commander"));
const theme_1 = __importDefault(require("./lib/theme"));
const { webFrame } = require('electron');
function Pilot() {
    this.listener = null;
    this.mixer = null;
    this.recorder = null;
    this.commander = null;
    this.theme = (0, theme_1.default)({
        background: '#000000',
        f_high: '#ffffff',
        f_med: '#777777',
        f_low: '#444444',
        f_inv: '#000000',
        b_high: '#eeeeee',
        b_med: '#333',
        b_low: '#444444',
        b_inv: '#fff',
    });
    this.el = document.createElement('div');
    this.el.id = 'pilot';
    this.animate = true;
    this.install = function (host) {
        console.info('Pilot is installing..');
        this.mixer = new mixer_1.default(this);
        this.listener = new listener_1.default(this);
        this.recorder = new recorder_1.default(this);
        this.commander = new commander_1.default(this);
        host.appendChild(this.el);
        this.theme.install();
        this.mixer.install(this.el);
        this.recorder.install(this.el);
        this.commander.install(this.el);
    };
    this.start = function () {
        console.info('Pilot is starting..');
        this.mixer?.start();
        this.commander?.start();
        this.theme?.start();
        const zoomFactor = Number(localStorage.getItem('zoomFactor'));
        if (isNaN(zoomFactor) || zoomFactor <= 0) {
            console.warn('Invalid zoomFactor, setting to default value of 1.0');
            webFrame.setZoomFactor(1.0);
            localStorage.setItem('zoomFactor', '1.0');
        }
        else {
            webFrame.setZoomFactor(zoomFactor);
        }
    };
    this.toggleAnimations = function () {
        this.animate = !this.animate;
    };
    this.modZoom = function (mod = 0, set = false) {
        const currentZoomFactor = webFrame.getZoomFactor();
        const newZoomFactor = set ? mod : currentZoomFactor + mod;
        webFrame.setZoomFactor(newZoomFactor);
        localStorage.setItem('zoomFactor', newZoomFactor.toString());
    };
}
