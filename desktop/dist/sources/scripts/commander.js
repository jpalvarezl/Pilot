export default class Commander {
    constructor(pilot) {
        this.el = document.createElement('div');
        this.el.id = 'commander';
        this.input = document.createElement('input');
        this.history = [];
        this.historyIndex = 0;
        this.isBrowsingHistory = false;
        this.input.oninput = (e) => {
            // Handle input event
        };
        this.input.onkeydown = (e) => {
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
        this.input.onkeypress = (e) => {
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
    install(host) {
        this.el.appendChild(this.input);
        host.appendChild(this.el);
    }
    start() {
        this.input.focus();
    }
}
