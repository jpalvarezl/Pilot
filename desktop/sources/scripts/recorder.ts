import { ipcRenderer } from 'electron';
import Tone from 'tone';
import fs from 'fs';

export default class Recorder {
  el: HTMLElement;
  isRecording: boolean;
  private chunks: BlobPart[];

  constructor(pilot: any) {
    this.el = document.createElement('div');
    this.el.id = 'recorder';
    this.el.className = 'blink';
    this.el.textContent = '\u2022';
    this.isRecording = false;
    this.chunks = [];

    pilot.mixer.hook = Tone.context.createMediaStreamDestination();
    pilot.mixer.recorder = new MediaRecorder(pilot.mixer.hook.stream);
    pilot.mixer.effects.limiter.connect(pilot.mixer.hook);

    pilot.mixer.recorder.onstop = (evt: Event): void => {
      const blob = new Blob(this.chunks, { type: 'audio/opus; codecs=opus' });
      this.save(blob, pilot);
    };

    pilot.mixer.recorder.ondataavailable = (evt: BlobEvent): void => {
      this.chunks.push(evt.data);
    };
  }

  install(host: HTMLElement): void {
    console.log('Recorder', 'Installing..');
    host.appendChild(this.el);
  }

  start(pilot: any): void {
    console.log('Recorder', 'Starting..');
    this.isRecording = true;
    this.chunks = [];
    pilot.mixer.recorder.start();
    pilot.el.className = 'recording';
  }

  stop(pilot: any): void {
    if (!this.isRecording) {
      return;
    }

    console.log('Recorder', 'Stopping..');
    this.isRecording = false;
    pilot.mixer.recorder.stop();
    pilot.el.className = '';
  }

  toggle(pilot: any): void {
    if (this.isRecording !== true) {
      this.start(pilot);
    } else {
      this.stop(pilot);
    }
  }

  private save(blob: Blob, pilot: any): void {
    ipcRenderer.invoke('show-save-dialog', {
      filters: [{ name: 'Audio File', extensions: ['opus'] }],
    }).then((path: string | undefined) => {
      if (!path) {
        return;
      }
      this.write(path, blob, pilot);
    });
  }

  private write(path: string, blob: Blob, pilot: any): void {
    const reader = new FileReader();
    reader.onload = function (): void {
      const buffer = Buffer.from(reader.result as ArrayBuffer);
      ipcRenderer.invoke('write-file', path, buffer).then(() => {
        console.log('Recorder', 'Export complete.');
      }).catch((err: Error) => {
        console.error(err);
      });
    };
    reader.readAsArrayBuffer(blob);
  }
}
