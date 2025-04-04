import { app, BrowserWindow, Menu, dialog, ipcMain, ProtocolRequest, ProtocolResponse } from 'electron';
import path from 'path';
import fs from 'fs';

// Define our custom app interface to avoid conflicts with electron.d.ts
interface ExtendedApp {
  win?: BrowserWindow;
  inspect: () => void;
  toggleFullscreen: () => void;
  toggleVisible: () => void;
  injectMenu: (menu: Electron.MenuItemConstructorOptions[]) => void;
}

// Cast the app to include our extensions
const extendedApp = app as unknown as typeof app & ExtendedApp;

function createWindow(): void {
  extendedApp.win = new BrowserWindow({
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

  // Get the correct path to the HTML file, handling both development and production environments
  const htmlPath = path.join(__dirname, '..', 'sources', 'index.html');
  
  // Log the path for debugging
  console.log(`Attempting to load HTML from: ${htmlPath}`);
  
  // Check if the file exists
  if (fs.existsSync(htmlPath)) {
    console.log('HTML file found, loading...');
    extendedApp.win.loadURL(`file://${htmlPath}`);
  } else {
    console.log('HTML file not found, trying alternative path...');
    // Try an alternative path - this handles the case where we're running from the dist directory
    const altPath = path.join(__dirname, 'sources', 'index.html');
    if (fs.existsSync(altPath)) {
      console.log(`Loading from alternative path: ${altPath}`);
      extendedApp.win.loadURL(`file://${altPath}`);
    } else {
      console.error('Could not find HTML file in any expected location');
      dialog.showErrorBox('Error', 'Could not find the main HTML file');
    }
  }

  extendedApp.win.on('closed', () => {
    extendedApp.win = undefined;
    app.quit();
  });

  extendedApp.win.on('hide', () => {
    isShown = false;
  });

  extendedApp.win.on('show', () => {
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

extendedApp.inspect = function (): void {
  extendedApp.win?.webContents.toggleDevTools();
};

extendedApp.toggleFullscreen = function (): void {
  extendedApp.win?.setFullScreen(!extendedApp.win?.isFullScreen());
};

extendedApp.toggleVisible = function (): void {
  if (process.platform === 'darwin') {
    if (isShown && !extendedApp.win?.isFullScreen()) {
      extendedApp.win?.hide();
    } else {
      extendedApp.win?.show();
    }
  } else {
    if (!extendedApp.win?.isMinimized()) {
      extendedApp.win?.minimize();
    } else {
      extendedApp.win?.restore();
    }
  }
};

extendedApp.injectMenu = function (menu: Electron.MenuItemConstructorOptions[]): void {
  try {
    Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
  } catch (err) {
    console.warn('Cannot inject menu.');
  }
};
