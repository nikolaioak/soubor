// Modules
const { dialog } = require('electron')
const { autoUpdater } = require('electron-updater')
const isDev = require('electron-is-dev')

// Configure log debugging
autoUpdater.logger = require('electron-log')
autoUpdater.logger.transports.file.level = "debug"

// disable auto downloading of updates
autoUpdater.autoDownload = false

// single export to check for and apply updates
module.exports = () => {

    if (isDev) {
        // do nothing
    } else {
        // check for updates from the remote server
        autoUpdater.checkForUpdates()

        // listen for update found
        autoUpdater.on('update-available', () => {
            // prompt user to update
            dialog.showMessageBox({
                type: 'info',
                title: 'Update Available',
                message: 'A new version of soubor is available. Would you like to install it?',
                buttons: ['Sure','No Thanks']
            }).then(result => {
                let buttonIndex = result.response
                // if update selected, start download
                if (buttonIndex === 0) {
                    autoUpdater.downloadUpdate()
                }
            })
        })

        // listen for download ready
        autoUpdater.on('update-downloaded', () => {
            // prompt user to update
            dialog.showMessageBox({
                type: 'info',
                title: 'Update Downloaded',
                message: 'New version of soubor downloaded. Quit and install now?',
                buttons: ['Update','Later']
            }).then(result => {
                let buttonIndex = result.response
                // if update selected, start download
                if (buttonIndex === 0) {
                    autoUpdater.quitAndInstall(true,true)
                }
            })
            
        })
    }
}