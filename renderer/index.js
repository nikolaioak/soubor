// Modules

// DOM Node
let message = document.getElementById('message'),
 themeSwitch = document.getElementById('slider'),
 changeFolder = document.getElementById('changeFolder'),
 folderField = document.getElementById('folderField')

// Functions
setTimeout( () => {
    // send a request for the version number update and username
    window.api.send('toMain','userRequest')
}, 2000)

// Listen for messages
window.api.receive('fromMain', (data) => {
    let responseType = data.split('|')[0]
    let responseData = data.split('|')[1]
    if (responseType === 'fileDetails') {
        generateFileTable(responseData);
    } else if (responseType === 'userResponse') {
        message.innerHTML = `Welcome to soubor, ${responseData}. Let's rename some files.`
    }
});

// Immediately invoked functions to set the theme and file path on initial load
(function () {
   if (localStorage.getItem('theme') === 'theme-dark') {
       setTheme('theme-dark');
   } else {
       setTheme('theme-light');
   }
})();

(function () {
    if (localStorage.getItem('lastPath')) {
        loadFiles(localStorage.getItem('lastPath'));
    } else {
        loadFiles('default');
    }
})();

// function to set a given theme/color-scheme
function setTheme(themeName) {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;
}

// function to request file information from main process
function loadFiles(path) {
    window.api.send('toMain',`loadFiles|${path}`)
}

// function to load file information based on retrieval from main process
function generateFileTable(fileDetails) {
    // iterate through fileDetails array to build table

}

// button to browse for a folder, clear / update folder path in app.
changeFolder.addEventListener('click', e => {
    window.api.send('toMain','folderBrowse');
})

// function to toggle between light and dark theme
themeSwitch.addEventListener('change', e => {
   if (localStorage.getItem('theme') === 'theme-dark'){
       setTheme('theme-light');
   } else {
       setTheme('theme-dark');
   }
});