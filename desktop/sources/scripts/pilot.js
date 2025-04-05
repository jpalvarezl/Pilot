"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Pilot;
var listener_1 = require("./listener");
var mixer_1 = require("./mixer");
var recorder_1 = require("./recorder");
var commander_1 = require("./commander");
var theme_1 = require("./lib/theme");
var webFrame = require('electron').webFrame;
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
        var _a, _b, _c;
        console.info('Pilot is starting..');
        (_a = this.mixer) === null || _a === void 0 ? void 0 : _a.start();
        (_b = this.commander) === null || _b === void 0 ? void 0 : _b.start();
        (_c = this.theme) === null || _c === void 0 ? void 0 : _c.start();
        var zoomFactor = Number(localStorage.getItem('zoomFactor'));
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
    this.modZoom = function (mod, set) {
        if (mod === void 0) { mod = 0; }
        if (set === void 0) { set = false; }
        var currentZoomFactor = webFrame.getZoomFactor();
        var newZoomFactor = set ? mod : currentZoomFactor + mod;
        webFrame.setZoomFactor(newZoomFactor);
        localStorage.setItem('zoomFactor', newZoomFactor.toString());
    };
}
