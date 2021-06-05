// Modules
const os = require('os');
const electron = window.require('electron');
const { ipcRenderer } = electron.ipcRenderer;

// DOM Node
let message = document.getElementById('message'),
 version = document.getElementById('version')

// Functions
setTimeout( () => {
    hello()
    // send a request for the version number update
    ipcRenderer.send('vrequest')
}, 2000)

let hello = () => {
    message.innerHTML = `Welcome to soubor, ${os.userInfo().username}. Let's find some files to rename.`
}

// Listen for messages
ipcRenderer.on('message', (e, text) => {
    // load information into version field
    version.innerHTML = text
})