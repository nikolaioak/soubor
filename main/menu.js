// Modules
const { app, BrowserWindow, Menu, shell } = require('electron');
const { autoUpdater } = require('electron-updater');

// Template(s)
let appTemplate = [{
    label: 'File',
    submenu: [{
        label: 'Save Action Plan',
        accelerator: 'CmdOrCtrl+S',
        click: (item, focusedWindow) => {
            if (focusedWindow) {
                if (focusedWindow.id === 1) {
                    focusedWindow.webContents.send('fromMain', `saveAP`);
                }
            }
        }
    }, {
        type: 'separator'
    }, {
        label: 'Load Action Plan',
        accelerator: 'CmdOrCtrl+L',
        click: (item, focusedWindow) => {
            if (focusedWindow) {
                if (focusedWindow.id === 1) {
                    focusedWindow.webContents.send('fromMain', `loadAP`);
                }
            }
        }
    }]
    }, {
    label: 'Help',
    role: 'help',
    submenu: [{
        label: 'Learn More',
        click: () => {
            shell.openExternal('https://github.com/nikolaioak/soubor')
        }
    }, {
        label: 'Search Issues',
        click: () => {
            shell.openExternal('https://github.com/nikolaioak/soubor/issues')
        }
    }]
}]

function addUpdateMenuItems (items, position) {
    if (process.mas) return

    const version = app.getVersion()
    let updateItems = [{
        label: `Version ${version}`,
        enabled: false
    }, {
        label: 'Checking for Update',
        enabled: false,
        key: 'checkingForUpdate'
    }, {
        label: 'Check for Update',
        visible: false,
        key: 'checkForUpdate',
        click: () => {
            autoUpdater.checkForUpdates()
        }
    }, {
        label: 'Restart and Install Update',
        enabled: true,
        visible: false,
        key: 'restartToUpdate',
        click: () => {
            autoUpdater.quitAndInstall()
        }
    }]

    items.splice.apply(items, [position, 0].concat(updateItems))
}

if (process.platform === 'darwin') {
    const name = app.getName()
    template.unshift({
      label: name,
      submenu: [{
        label: `About ${name}`,
        role: 'about'
      }, {
        type: 'separator'
      }, {
        label: 'Services',
        role: 'services',
        submenu: []
      }, {
        type: 'separator'
      }, {
        label: `Hide ${name}`,
        accelerator: 'Command+H',
        role: 'hide'
      }, {
        label: 'Hide Others',
        accelerator: 'Command+Alt+H',
        role: 'hideothers'
      }, {
        label: 'Show All',
        role: 'unhide'
      }, {
        type: 'separator'
      }, {
        label: 'Quit',
        accelerator: 'Command+Q',
        click: () => {
          app.quit()
        }
      }]
    })
  
    // Window menu.
    template[3].submenu.push({
      type: 'separator'
    }, {
      label: 'Bring All to Front',
      role: 'front'
    })
  
    addUpdateMenuItems(template[0].submenu, 1)
}
  
if (process.platform === 'win32') {
    const helpMenu = template[template.length - 1].submenu
    addUpdateMenuItems(helpMenu, 0)
}
  
app.on('ready', () => {
    const menu = Menu.buildFromTemplate(appTemplate)
    Menu.setApplicationMenu(menu)
})