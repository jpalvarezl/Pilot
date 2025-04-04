import { app, BrowserWindow, Menu, dialog, ipcMain, ProtocolRequest, ProtocolResponse } from 'electron';
import path from 'path';
import fs from 'fs';

// Extend the existing Electron.App type to include custom properties and methods
declare module 'electron' {
  interface App {
    win?: BrowserWindow;
    inspect?: () => void;
    toggleFullscreen?: () => void;
    toggleVisible?: () => void;
    injectMenu?: (menu: Electron.MenuItemConstructorOptions[]) => void;
  }
}

function createWindow(): void {
  app.win = new BrowserWindow({
    width: 445,
    height: 210,
    minWidth: 200,
    minHeight: 190,
    backgroundColor: '#000',
    icon: path.join(__dirname, 'icon.icns'),
    resizable: true,
    frame: process.platform !== 'darwin',
    skipTaskbar: process.platform === 'darwin',
    autoHideMenuBar: process.platform === 'darwin',
    webPreferences: {
      zoomFactor: 1.0,
      nodeIntegration: true, // Enable Node.js integration
      contextIsolation: false, // Disable context isolation for compatibility
      backgroundThrottling: false,
    },
  });

  app.win.loadURL(`file://${__dirname}/sources/index.html`);

  app.win.on('closed', () => {
    app.win = undefined;
    app.quit();
  });

  app.win.on('hide', () => {
    isShown = false;
  });

  app.win.on('show', () => {
    isShown = true;
  });
}

let isShown = true;

require('electron').protocol.registerSchemesAsPrivileged([
  { scheme: 'js', privileges: { standard: true, secure: true } },
]);

function protocolHandler(request: ProtocolRequest, respond: (response: ProtocolResponse) => void): void {
  try {
    const pathname = request.url.replace(/^js:\/*/, '');
    const filename = path.resolve(app.getAppPath(), pathname);
    respond({ mimeType: 'text/javascript', data: fs.readFileSync(filename) });
  } catch (e) {
    console.error(e, request);
  }
}

app.on('ready', () => {
  require('electron').protocol.registerBufferProtocol('js', protocolHandler);
  createWindow();
});

ipcMain.handle('set-application-menu', (_event, menuTemplate: Electron.MenuItemConstructorOptions[]) => {
  try {
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
  } catch (error) {
    console.error('Failed to set application menu:', error);
    throw error;
  }
});

app.inspect = function (): void {
  app.win?.webContents.toggleDevTools();
};

app.toggleFullscreen = function (): void {
  app.win?.setFullScreen(!app.win?.isFullScreen());
};

app.toggleVisible = function (): void {
  if (process.platform === 'darwin') {
    if (isShown && !app.win?.isFullScreen()) {
      app.win?.hide();
    } else {
      app.win?.show();
    }
  } else {
    if (!app.win?.isMinimized()) {
      app.win?.minimize();
    } else {
      app.win?.restore();
    }
  }
};

app.injectMenu = function (menu: Electron.MenuItemConstructorOptions[]): void {
  try {
    Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
  } catch (err) {
    console.warn('Cannot inject menu.');
  }
};
