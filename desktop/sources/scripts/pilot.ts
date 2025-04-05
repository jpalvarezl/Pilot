import Listener from './listener';
import Mixer from './mixer';
import Recorder from './recorder';
import Commander from './commander';
import Theme from './lib/theme';

const { webFrame } = require('electron');

export default class Pilot {
  listener: typeof Listener | null;
  mixer: typeof Mixer | null;
  recorder: typeof Recorder | null;
  commander: typeof Commander | null;
  theme: any;
  el: HTMLElement;
  animate: boolean;

  constructor() {
    this.listener = null;
    this.mixer = null;
    this.recorder = null;
    this.commander = null;
    this.theme = Theme({
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
  }

  install(host: HTMLElement): void {
    console.info('Pilot is installing..');

    this.mixer = new Mixer(this);
    this.listener = new Listener(this);
    this.recorder = new Recorder(this);
    this.commander = new Commander(this);

    host.appendChild(this.el);

    this.theme.install();
    this.mixer.install(this.el);
    this.recorder.install(this.el);
    this.commander.install(this.el);
  }

  start(): void {
    console.info('Pilot is starting..');
    this.mixer?.start();
    this.commander?.start();
    this.theme?.start();

    const zoomFactor = Number(localStorage.getItem('zoomFactor'));
    if (isNaN(zoomFactor) || zoomFactor <= 0) {
      console.warn('Invalid zoomFactor, setting to default value of 1.0');
      webFrame.setZoomFactor(1.0);
      localStorage.setItem('zoomFactor', '1.0');
    } else {
      webFrame.setZoomFactor(zoomFactor);
    }
  }

  toggleAnimations(): void {
    this.animate = !this.animate;
  }

  modZoom(mod: number = 0, set: boolean = false): void {
    const currentZoomFactor = webFrame.getZoomFactor();
    const newZoomFactor = set ? mod : currentZoomFactor + mod;
    webFrame.setZoomFactor(newZoomFactor);
    localStorage.setItem('zoomFactor', newZoomFactor.toString());
  }
}
