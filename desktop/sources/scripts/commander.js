"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Commander = /** @class */ (function () {
    function Commander(pilot) {
        var _this = this;
        this.el = document.createElement('div');
        this.el.id = 'commander';
        this.input = document.createElement('input');
        this.history = [];
        this.historyIndex = 0;
        this.isBrowsingHistory = false;
        this.input.oninput = function (e) {
            // Handle input event
        };
        this.input.onkeydown = function (e) {
            switch (e.key) {
                case 'ArrowDown': // Down
                    e.preventDefault();
                    if (!_this.isBrowsingHistory) {
                        return;
                    }
                    if (_this.history.length) {
                        if (_this.historyIndex === _this.history.length - 1) {
                            _this.isBrowsingHistory = false;
                            _this.input.value = '';
                            return;
                        }
                        _this.historyIndex += 1;
                        _this.input.value = _this.history[_this.historyIndex];
                    }
                    break;
                case 'ArrowUp': // Up
                    e.preventDefault();
                    if (!_this.isBrowsingHistory) {
                        _this.historyIndex = _this.history.length;
                    }
                    _this.isBrowsingHistory = true;
                    if (_this.history.length && _this.historyIndex > 0) {
                        _this.historyIndex -= 1;
                        _this.input.value = _this.history[_this.historyIndex];
                    }
                    break;
            }
        };
        this.input.onkeypress = function (e) {
            if (e.key !== 'Enter') {
                return;
            }
            e.preventDefault();
            _this.isBrowsingHistory = false;
            _this.history.push(_this.input.value);
            pilot.mixer.run(_this.input.value);
            _this.input.value = '';
        };
    }
    Commander.prototype.install = function (host) {
        this.el.appendChild(this.input);
        host.appendChild(this.el);
    };
    Commander.prototype.start = function () {
        this.input.focus();
    };
    return Commander;
}());
exports.default = Commander;
