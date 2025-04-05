"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var tone_1 = require("tone");
var Recorder = /** @class */ (function () {
    function Recorder(pilot) {
        var _this = this;
        this.el = document.createElement('div');
        this.el.id = 'recorder';
        this.el.className = 'blink';
        this.el.textContent = '\u2022';
        this.isRecording = false;
        this.chunks = [];
        pilot.mixer.hook = tone_1.default.context.createMediaStreamDestination();
        pilot.mixer.recorder = new MediaRecorder(pilot.mixer.hook.stream);
        pilot.mixer.effects.limiter.connect(pilot.mixer.hook);
        pilot.mixer.recorder.onstop = function (evt) {
            var blob = new Blob(_this.chunks, { type: 'audio/opus; codecs=opus' });
            _this.save(blob, pilot);
        };
        pilot.mixer.recorder.ondataavailable = function (evt) {
            _this.chunks.push(evt.data);
        };
    }
    Recorder.prototype.install = function (host) {
        console.log('Recorder', 'Installing..');
        host.appendChild(this.el);
    };
    Recorder.prototype.start = function (pilot) {
        console.log('Recorder', 'Starting..');
        this.isRecording = true;
        this.chunks = [];
        pilot.mixer.recorder.start();
        pilot.el.className = 'recording';
    };
    Recorder.prototype.stop = function (pilot) {
        if (!this.isRecording) {
            return;
        }
        console.log('Recorder', 'Stopping..');
        this.isRecording = false;
        pilot.mixer.recorder.stop();
        pilot.el.className = '';
    };
    Recorder.prototype.toggle = function (pilot) {
        if (this.isRecording !== true) {
            this.start(pilot);
        }
        else {
            this.stop(pilot);
        }
    };
    Recorder.prototype.save = function (blob, pilot) {
        var _this = this;
        electron_1.ipcRenderer.invoke('show-save-dialog', {
            filters: [{ name: 'Audio File', extensions: ['opus'] }],
        }).then(function (path) {
            if (!path) {
                return;
            }
            _this.write(path, blob, pilot);
        });
    };
    Recorder.prototype.write = function (path, blob, pilot) {
        var reader = new FileReader();
        reader.onload = function () {
            var buffer = Buffer.from(reader.result);
            electron_1.ipcRenderer.invoke('write-file', path, buffer).then(function () {
                console.log('Recorder', 'Export complete.');
            }).catch(function (err) {
                console.error(err);
            });
        };
        reader.readAsArrayBuffer(blob);
    };
    return Recorder;
}());
exports.default = Recorder;
