"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Cast the app to include our extensions
const extendedApp = electron_1.app;
function createWindow() {
    extendedApp.win = new electron_1.BrowserWindow({
        width: 445,
        height: 210,
        minWidth: 200,
        minHeight: 190,
        backgroundColor: '#000',
        icon: path_1.default.join(__dirname, 'icon.icns'),
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
    const htmlPath = path_1.default.join(__dirname, '..', 'sources', 'index.html');
    // Log the path for debugging
    console.log(`Attempting to load HTML from: ${htmlPath}`);
    // Check if the file exists
    if (fs_1.default.existsSync(htmlPath)) {
        console.log('HTML file found, loading...');
        extendedApp.win.loadURL(`file://${htmlPath}`);
    }
    else {
        console.log('HTML file not found, trying alternative path...');
        // Try an alternative path - this handles the case where we're running from the dist directory
        const altPath = path_1.default.join(__dirname, 'sources', 'index.html');
        if (fs_1.default.existsSync(altPath)) {
            console.log(`Loading from alternative path: ${altPath}`);
            extendedApp.win.loadURL(`file://${altPath}`);
        }
        else {
            console.error('Could not find HTML file in any expected location');
            electron_1.dialog.showErrorBox('Error', 'Could not find the main HTML file');
        }
    }
    extendedApp.win.on('closed', () => {
        extendedApp.win = undefined;
        electron_1.app.quit();
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
function protocolHandler(request, respond) {
    try {
        const pathname = request.url.replace(/^js:\/*/, '');
        const filename = path_1.default.resolve(electron_1.app.getAppPath(), pathname);
        respond({ mimeType: 'text/javascript', data: fs_1.default.readFileSync(filename) });
    }
    catch (e) {
        console.error(e, request);
    }
}
electron_1.app.on('ready', () => {
    require('electron').protocol.registerBufferProtocol('js', protocolHandler);
    createWindow();
});
electron_1.ipcMain.handle('set-application-menu', (_event, menuTemplate) => {
    try {
        const menu = electron_1.Menu.buildFromTemplate(menuTemplate);
        electron_1.Menu.setApplicationMenu(menu);
    }
    catch (error) {
        console.error('Failed to set application menu:', error);
        throw error;
    }
});
extendedApp.inspect = function () {
    extendedApp.win?.webContents.toggleDevTools();
};
extendedApp.toggleFullscreen = function () {
    extendedApp.win?.setFullScreen(!extendedApp.win?.isFullScreen());
};
extendedApp.toggleVisible = function () {
    if (process.platform === 'darwin') {
        if (isShown && !extendedApp.win?.isFullScreen()) {
            extendedApp.win?.hide();
        }
        else {
            extendedApp.win?.show();
        }
    }
    else {
        if (!extendedApp.win?.isMinimized()) {
            extendedApp.win?.minimize();
        }
        else {
            extendedApp.win?.restore();
        }
    }
};
extendedApp.injectMenu = function (menu) {
    try {
        electron_1.Menu.setApplicationMenu(electron_1.Menu.buildFromTemplate(menu));
    }
    catch (err) {
        console.warn('Cannot inject menu.');
    }
};
