import { app, BrowserWindow, Menu, dialog, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';
// Cast the app to include our extensions
const extendedApp = app;
function createWindow() {
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
    }
    else {
        console.log('HTML file not found, trying alternative path...');
        // Try an alternative path - this handles the case where we're running from the dist directory
        const altPath = path.join(__dirname, 'sources', 'index.html');
        if (fs.existsSync(altPath)) {
            console.log(`Loading from alternative path: ${altPath}`);
            extendedApp.win.loadURL(`file://${altPath}`);
        }
        else {
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
app.on('ready', () => {
    createWindow();
});
ipcMain.handle('set-application-menu', (_event, menuTemplate) => {
    try {
        const menu = Menu.buildFromTemplate(menuTemplate);
        Menu.setApplicationMenu(menu);
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
        Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
    }
    catch (err) {
        console.warn('Cannot inject menu.');
    }
};
