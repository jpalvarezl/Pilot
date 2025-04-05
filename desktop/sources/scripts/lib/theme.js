"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Theme;
var electron_1 = require("electron");
function Theme(_default) {
    var themer = this;
    this.active = _default;
    this.el = document.createElement('style');
    this.el.type = 'text/css';
    this.install = function (host, callback) {
        if (host === void 0) { host = document.body; }
        console.log('Theme', 'Installing..');
        host.appendChild(this.el);
        this.callback = callback;
    };
    this.start = function () {
        console.log('Theme', 'Starting..');
        if (isJson(localStorage.theme)) {
            var storage = JSON.parse(localStorage.theme);
            if (validate(storage)) {
                console.log('Theme', 'Found theme in localStorage!');
                this.load(storage);
                return;
            }
        }
        this.load(_default);
    };
    this.load = function (data) {
        var theme = parse(data);
        if (!validate(theme)) {
            console.warn('Theme', 'Not a theme', theme);
            return;
        }
        console.log('Theme', "Loading theme with background ".concat(theme.background, "."));
        this.el.innerHTML = ":root { --background: ".concat(theme.background, "; --f_high: ").concat(theme.f_high, "; --f_med: ").concat(theme.f_med, "; --f_low: ").concat(theme.f_low, "; --f_inv: ").concat(theme.f_inv, "; --b_high: ").concat(theme.b_high, "; --b_med: ").concat(theme.b_med, "; --b_low: ").concat(theme.b_low, "; --b_inv: ").concat(theme.b_inv, "; }");
        localStorage.setItem('theme', JSON.stringify(theme));
        this.active = theme;
        if (this.callback) {
            this.callback();
        }
    };
    this.reset = function () {
        this.load(_default);
    };
    function parse(any) {
        if (any && any.background) {
            return any;
        }
        else if (any && any.data) {
            return any.data;
        }
        else if (any && isJson(any)) {
            return JSON.parse(any);
        }
        else if (any && isHtml(any)) {
            return extract(any);
        }
        return null;
    }
    // Drag
    this.drag = function (e) {
        e.stopPropagation();
        e.preventDefault();
        if (e.dataTransfer) {
            e.dataTransfer.dropEffect = 'copy';
        }
    };
    this.drop = function (e) {
        var _a;
        e.preventDefault();
        e.stopPropagation();
        var file = (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.files[0];
        if (!file || !file.name) {
            console.warn('Theme', 'Unnamed file.');
            return;
        }
        if (file.name.indexOf('.thm') < 0 && file.name.indexOf('.svg') < 0) {
            console.warn('Theme', 'Skipped, not a theme');
            return;
        }
        var reader = new FileReader();
        reader.onload = function (e) {
            if (e.target && e.target.result) {
                themer.load(e.target.result.toString());
            }
        };
        reader.readAsText(file);
    };
    this.open = function () {
        electron_1.ipcRenderer.invoke('show-open-dialog', {
            properties: ['openFile'],
            filters: [{ name: 'Themes', extensions: ['svg'] }],
        }).then(function (result) {
            if (!result.canceled && result.filePaths.length > 0) {
                var fs = require('fs');
                fs.readFile(result.filePaths[0], 'utf8', function (err, data) {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    themer.load(data);
                });
            }
        });
    };
    window.addEventListener('dragover', this.drag.bind(this));
    window.addEventListener('drop', this.drop.bind(this));
    // Helpers
    function validate(json) {
        if (!json) {
            return false;
        }
        if (!json.background) {
            return false;
        }
        if (!json.f_high) {
            return false;
        }
        if (!json.f_med) {
            return false;
        }
        if (!json.f_low) {
            return false;
        }
        if (!json.f_inv) {
            return false;
        }
        if (!json.b_high) {
            return false;
        }
        if (!json.b_med) {
            return false;
        }
        if (!json.b_low) {
            return false;
        }
        if (!json.b_inv) {
            return false;
        }
        return true;
    }
    function extract(text) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        var svg = new DOMParser().parseFromString(text, 'text/xml');
        try {
            return {
                'background': ((_a = svg.getElementById('background')) === null || _a === void 0 ? void 0 : _a.getAttribute('fill')) || '',
                'f_high': ((_b = svg.getElementById('f_high')) === null || _b === void 0 ? void 0 : _b.getAttribute('fill')) || '',
                'f_med': ((_c = svg.getElementById('f_med')) === null || _c === void 0 ? void 0 : _c.getAttribute('fill')) || '',
                'f_low': ((_d = svg.getElementById('f_low')) === null || _d === void 0 ? void 0 : _d.getAttribute('fill')) || '',
                'f_inv': ((_e = svg.getElementById('f_inv')) === null || _e === void 0 ? void 0 : _e.getAttribute('fill')) || '',
                'b_high': ((_f = svg.getElementById('b_high')) === null || _f === void 0 ? void 0 : _f.getAttribute('fill')) || '',
                'b_med': ((_g = svg.getElementById('b_med')) === null || _g === void 0 ? void 0 : _g.getAttribute('fill')) || '',
                'b_low': ((_h = svg.getElementById('b_low')) === null || _h === void 0 ? void 0 : _h.getAttribute('fill')) || '',
                'b_inv': ((_j = svg.getElementById('b_inv')) === null || _j === void 0 ? void 0 : _j.getAttribute('fill')) || ''
            };
        }
        catch (err) {
            console.warn('Theme', 'Incomplete SVG Theme', err);
        }
    }
    function isJson(text) {
        try {
            JSON.parse(text);
            return true;
        }
        catch (error) {
            return false;
        }
    }
    function isHtml(text) {
        try {
            new DOMParser().parseFromString(text, 'text/xml');
            return true;
        }
        catch (error) {
            return false;
        }
    }
}
