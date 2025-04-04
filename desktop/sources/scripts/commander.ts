export default class Commander {
  el: HTMLElement;
  input: HTMLInputElement;
  history: string[];
  historyIndex: number;
  isBrowsingHistory: boolean;

  constructor(pilot: any) {
    this.el = document.createElement('div');
    this.el.id = 'commander';

    this.input = document.createElement('input');

    this.history = [];
    this.historyIndex = 0;
    this.isBrowsingHistory = false;

    this.input.oninput = (e: Event): void => {
      // Handle input event
    };

    this.input.onkeydown = (e: KeyboardEvent): void => {
      switch (e.key) {
        case 'ArrowDown': // Down
          e.preventDefault();
          if (!this.isBrowsingHistory) {
            return;
          }

          if (this.history.length) {
            if (this.historyIndex === this.history.length - 1) {
              this.isBrowsingHistory = false;
              this.input.value = '';
              return;
            }

            this.historyIndex += 1;
            this.input.value = this.history[this.historyIndex];
          }
          break;
        case 'ArrowUp': // Up
          e.preventDefault();
          if (!this.isBrowsingHistory) {
            this.historyIndex = this.history.length;
          }

          this.isBrowsingHistory = true;
          if (this.history.length && this.historyIndex > 0) {
            this.historyIndex -= 1;
            this.input.value = this.history[this.historyIndex];
          }

          break;
      }
    };

    this.input.onkeypress = (e: KeyboardEvent): void => {
      if (e.key !== 'Enter') {
        return;
      }
      e.preventDefault();
      this.isBrowsingHistory = false;
      this.history.push(this.input.value);
      pilot.mixer.run(this.input.value);
      this.input.value = '';
    };
  }

  install(host: HTMLElement): void {
    this.el.appendChild(this.input);
    host.appendChild(this.el);
  }

  start(): void {
    this.input.focus();
  }
}
