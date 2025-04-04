const { ipcRenderer } = require('electron');

export default function Controller(this: any): void {
  this.menu = [];

  this.add = function (this: any, category: string, label: string, fn: () => void, accelerator?: string): void {
    let categoryEntry = this.menu.find((entry: any) => entry.label === category);
    if (!categoryEntry) {
      categoryEntry = { label: category, submenu: [] };
      this.menu.push(categoryEntry);
    }

    categoryEntry.submenu.push({ label, accelerator, click: fn });
  };

  this.addRole = function (this: any, category: string, role: string): void {
    let categoryEntry = this.menu.find((entry: any) => entry.label === category);
    if (!categoryEntry) {
      categoryEntry = { label: category, submenu: [] };
      this.menu.push(categoryEntry);
    }

    categoryEntry.submenu.push({ role });
  };

  this.commit = function (this: any): void {
    ipcRenderer.invoke('set-application-menu', this.menu);
  };

  // Define the menu structure
  this.add("File", "Quit", () => {
    ipcRenderer.invoke('quit-app');
  }, "CmdOrCtrl+Q");

  this.add("View", "Toggle Developer Tools", () => {
    ipcRenderer.invoke('toggle-devtools');
  }, "CmdOrCtrl+Alt+I");

  this.add("View", "Toggle Fullscreen", () => {
    ipcRenderer.invoke('toggle-fullscreen');
  }, "CmdOrCtrl+Enter");

  this.add("View", "Hide Application", () => {
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
