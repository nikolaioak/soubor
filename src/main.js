// Modules
const {app, BrowserWindow, dialog, ipcMain} = require('electron');
const { autoUpdater } = require('electron-updater');
const updater = require('./updater.js');
const path = require('path');
const isDev = require('electron-is-dev');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function sendStatusToWindow(text) {
    mainWindow.webContents.send('message', text);
};

ipcMain.on('vrequest', e => {
    sendStatusToWindow(`${app.getVersion()}`);
});

function createWindow() {
    // check for app updates
    setTimeout(updater, 3000)

    // Create the browser window.
    mainWindow = new BrowserWindow({
        minWidth: 900, maxWidth: 1366, minHeight: 600,
        show: false, frame: true,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            worldSafeExecuteJavaScript: true
        }
    });

    // show window once ready
    mainWindow.on('ready-to-show', () => {
        mainWindow.show();
        // Pass App Version to main.html
        sendStatusToWindow(`${app.getVersion()}`);
    });

    // and load the index.html of the app.
    mainWindow.loadFile('renderer/index.html')

    // Open DevTools
    if (isDev) {
        mainWindow.webContents.openDevTools()
    };

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        mainWindow = null
    })
}

// force renderer process reuse to false
app.allowRendererProcessReuse = false

// Electron app is ready
app.on('ready', createWindow);

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
    if (mainWindow === null) createWindow()
})