// Modules

// DOM Node
let message = document.getElementById('message'),
 version = document.getElementById('version')

// Functions
setTimeout( () => {
    // send a request for the version number update and username
    window.api.send('toMain','userRequest')
    window.api.send('toMain','vRequest')
}, 2000)

// Listen for messages
window.api.receive('fromMain', (data) => {
    let responseType = data.split('|')[0]
    let responseData = data.split('|')[1]
    if (responseType === 'vResponse') {
        version.innerHTML = responseData
    } else if (responseType === 'userResponse') {
        message.innerHTML = `Welcome to soubor, ${responseData}. Let's rename some files.`
    }
})