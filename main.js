// Modules
const {app, BrowserWindow, ipcMain, globalShortcut, dialog} = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const os = require('os');
const updater = require('./main/updater');
const glob = require('glob');
const fs = require('fs');

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

        globalShortcut.register('CommandOrControl+R', function() {
            mainWindow.reload()
        })

        const windowOptions = {
            minWidth: 1000, minHeight: 600,
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

        if (process.platform !== 'darwin') {
            windowOptions.icon = path.join(__dirname, 'main/assets/app.png')
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

ipcMain.on('toMain', async (event, args) => {
    let arg0 = args.split('|')[0]
    let arg1 = args.split('|')[1]
    if (args === 'userRequest') {
        mainWindow.webContents.send('fromMain', `userResponse|${os.userInfo().username}`);
    } else if (arg0 === 'loadFiles') {
        // browse provided folder path and load file details as an array of objects
        let folderPath = arg1
        try {
            // get files as array
            const files = await fs.promises.readdir(folderPath);
            let fileDetails = []
            // loop through the files
            for ( const file of files ) {
                // get full file path
                let filePath = path.join(folderPath, file);
                // stat the file
                const stat = await fs.promises.stat(filePath);
                if (stat.isFile()) {
                    let month, day, year, modifiedDate, fileSize
                    month = stat.mtime.toLocaleDateString('default', { month: 'short'})
                    day = stat.mtime.getDate()
                    year = stat.mtime.getFullYear()
                    modifiedDate = `${day}-${month}-${year}`
                    fileSize = convertBytes(stat.size)
                    fileDetails.push(`${file}:${modifiedDate}:${fileSize}`)
                }
            }
            mainWindow.webContents.send('fromMain',`fileDetails|${fileDetails}`);
        } catch (err) {
            console.error(`Oops! ${err}`)
            mainWindow.webContents.send('fromMain',`error|${err}`);
        }
    } else if (args === 'folderBrowse') {
        // open default file browser to select a folder
        const result = await dialog.showOpenDialog(mainWindow, {
            properties: ['openDirectory']
        })
        mainWindow.webContents.send('fromMain',`folderPath|${result.filePaths}`)
    }
});

const convertBytes = bytes => {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]

    if (bytes == 0) {
        return 'N/A'
    }

    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))

    if (i == 0) {
        return bytes + " " + sizes[i]
    }

    return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i]
}