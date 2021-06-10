// Modules

// DOM Node
let message = document.getElementById('message'),
 themeSwitch = document.getElementById('slider')

// Functions
setTimeout( () => {
    // send a request for the version number update and username
    window.api.send('toMain','userRequest')
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
});

// Immediately invoked function to set the theme on initial load
(function () {
   if (localStorage.getItem('theme') === 'theme-dark') {
       setTheme('theme-dark');
   } else {
       setTheme('theme-light');
   }
})();

// function to set a given theme/color-scheme
function setTheme(themeName) {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;
}

// function to toggle between light and dark theme
themeSwitch.addEventListener('change', e => {
   if (localStorage.getItem('theme') === 'theme-dark'){
       setTheme('theme-light');
   } else {
       setTheme('theme-dark');
   }
});