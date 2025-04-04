"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const tone_1 = __importDefault(require("tone"));
class Recorder {
    constructor(pilot) {
        this.el = document.createElement('div');
        this.el.id = 'recorder';
        this.el.className = 'blink';
        this.el.textContent = '\u2022';
        this.isRecording = false;
        this.chunks = [];
        pilot.mixer.hook = tone_1.default.context.createMediaStreamDestination();
        pilot.mixer.recorder = new MediaRecorder(pilot.mixer.hook.stream);
        pilot.mixer.effects.limiter.connect(pilot.mixer.hook);
        pilot.mixer.recorder.onstop = (evt) => {
            const blob = new Blob(this.chunks, { type: 'audio/opus; codecs=opus' });
            this.save(blob, pilot);
        };
        pilot.mixer.recorder.ondataavailable = (evt) => {
            this.chunks.push(evt.data);
        };
    }
    install(host) {
        console.log('Recorder', 'Installing..');
        host.appendChild(this.el);
    }
    start(pilot) {
        console.log('Recorder', 'Starting..');
        this.isRecording = true;
        this.chunks = [];
        pilot.mixer.recorder.start();
        pilot.el.className = 'recording';
    }
    stop(pilot) {
        if (!this.isRecording) {
            return;
        }
        console.log('Recorder', 'Stopping..');
        this.isRecording = false;
        pilot.mixer.recorder.stop();
        pilot.el.className = '';
    }
    toggle(pilot) {
        if (this.isRecording !== true) {
            this.start(pilot);
        }
        else {
            this.stop(pilot);
        }
    }
    save(blob, pilot) {
        electron_1.ipcRenderer.invoke('show-save-dialog', {
            filters: [{ name: 'Audio File', extensions: ['opus'] }],
        }).then((path) => {
            if (!path) {
                return;
            }
            this.write(path, blob, pilot);
        });
    }
    write(path, blob, pilot) {
        const reader = new FileReader();
        reader.onload = function () {
            const buffer = Buffer.from(reader.result);
            electron_1.ipcRenderer.invoke('write-file', path, buffer).then(() => {
                console.log('Recorder', 'Export complete.');
            }).catch((err) => {
                console.error(err);
            });
        };
        reader.readAsArrayBuffer(blob);
    }
}
exports.default = Recorder;
