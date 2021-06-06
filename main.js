// Modules
const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const os = require('os');
const updater = require('./main/updater');
const glob = require('glob')

if (process.mas) app.setName('soubor')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null;

function initialize() {

    // make single instance
    makeSingleInstance()

    // load main js files
    loadMains()

    updater()

    function createWindow() {

        const windowOptions = {
            minWidth: 900, minHeight: 600,
            show: false, frame: true,
            title: app.getName(),
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                enableRemoteModule: false,
                worldSafeExecuteJavaScript: true,
                preload: path.join(__dirname, "preload.js")
            }
        }

        if (process.platform === 'linux') {
            windowOptions.icon = path.join(__dirname, '/assets/app.png')
        }

        // Create the browser window.
        mainWindow = new BrowserWindow(windowOptions);

        // show window once ready
        mainWindow.on('ready-to-show', () => {
            mainWindow.show();
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
    app.on('ready', () => {
        createWindow();
    });

    // Quit when all windows are closed - (Not macOS - Darwin)
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit()
    });

    // When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
    app.on('activate', () => {
        if (mainWindow === null) createWindow()
    });
}

// Make this app a single instance app.
// The main window will be restored and focused instead of a second window
// opened when a person attempts to launch a second instance.
function makeSingleInstance () {
    if (process.mas) return
  
    app.requestSingleInstanceLock()
  
    app.on('second-instance', () => {
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore()
        mainWindow.focus()
      }
    })
}

initialize();

// Require each JS file in the main dir
function loadMains () {
    const files = glob.sync(path.join(__dirname, './main/**/*.js'))
    files.forEach((file) => { require(file) })
}

ipcMain.on('toMain', (event, args) => {
    if (args === 'vRequest') {
        mainWindow.webContents.send('fromMain', `vResponse|${app.getVersion()}`);
    } else if (args === 'userRequest') {
        mainWindow.webContents.send('fromMain', `userResponse|${os.userInfo().username}`);
    }
});
