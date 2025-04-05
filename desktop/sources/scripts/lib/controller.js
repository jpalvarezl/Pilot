"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ipcRenderer = require('electron').ipcRenderer;
var Controller = /** @class */ (function () {
    function Controller() {
        this.menu = [];
        this.add("File", "Quit", function () {
            ipcRenderer.invoke('quit-app');
        }, "CmdOrCtrl+Q");
        this.add("View", "Toggle Developer Tools", function () {
            ipcRenderer.invoke('toggle-devtools');
        }, "CmdOrCtrl+Alt+I");
        this.add("View", "Toggle Fullscreen", function () {
            ipcRenderer.invoke('toggle-fullscreen');
        }, "CmdOrCtrl+Enter");
        this.add("View", "Hide Application", function () {
            ipcRenderer.invoke('toggle-visibility');
        }, "CmdOrCtrl+H");
        this.addRole("Edit", "undo");
        this.addRole("Edit", "redo");
        this.addRole("Edit", "cut");
        this.addRole("Edit", "copy");
        this.addRole("Edit", "paste");
        this.addRole("Edit", "selectall");
        this.commit();
    }
    Controller.prototype.add = function (category, label, fn, accelerator) {
        var categoryEntry = this.menu.find(function (entry) { return entry.label === category; });
        if (!categoryEntry) {
            categoryEntry = { label: category, submenu: [] };
            this.menu.push(categoryEntry);
        }
        categoryEntry.submenu.push({ label: label, accelerator: accelerator, click: fn });
    };
    Controller.prototype.addRole = function (category, role) {
        var categoryEntry = this.menu.find(function (entry) { return entry.label === category; });
        if (!categoryEntry) {
            categoryEntry = { label: category, submenu: [] };
            this.menu.push(categoryEntry);
        }
        categoryEntry.submenu.push({ role: role });
    };
    Controller.prototype.commit = function () {
        ipcRenderer.invoke('set-application-menu', this.menu);
    };
    return Controller;
}());
exports.default = Controller;
