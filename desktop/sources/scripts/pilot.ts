import Listener from './listener';
import Mixer from './mixer';
import Recorder from './recorder';
import Commander from './commander';
import Theme from './lib/theme';

const { webFrame } = require('electron');

export default function Pilot(this: any): void {
  this.listener = null as typeof Listener | null;
  this.mixer = null as typeof Mixer | null;
  this.recorder = null as typeof Recorder | null;
  this.commander = null as typeof Commander | null;
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

  this.install = function (this: any, host: HTMLElement): void {
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
  };

  this.start = function (this: any): void {
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
  };

  this.toggleAnimations = function (this: any): void {
    this.animate = !this.animate;
  };

  this.modZoom = function (this: any, mod: number = 0, set: boolean = false): void {
    const currentZoomFactor = webFrame.getZoomFactor();
    const newZoomFactor = set ? mod : currentZoomFactor + mod;
    webFrame.setZoomFactor(newZoomFactor);
    localStorage.setItem('zoomFactor', newZoomFactor.toString());
  };
}
