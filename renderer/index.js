// Modules

// DOM Node
let message = document.getElementById('message'),
 themeSwitch = document.getElementById('slider'),
 changeFolder = document.getElementById('changeFolder'),
 folderField = document.getElementById('folderField'),
 modal = document.getElementById('myModal'),
 modalContent = document.getElementById('modal-content'),
 span = document.getElementsByClassName('close')[0],
 fileTable = document.getElementById('fileTable'),
 selectAction = document.getElementById('actionSelect'),
 actionHolder = document.getElementById('actionHolder')

this.lastPath = localStorage.getItem('lastPath') || []

window.onload = () => {
    // send a request for the username
    window.api.send('toMain','userRequest')
}


// Listen for messages
window.api.receive('fromMain', (data) => {
    let responseType = data.split('|')[0]
    let responseData = data.split('|')[1]
    if (responseType === 'fileDetails') {
        let fileDetails = responseData.split(',')
        generateFileTable(fileDetails);
    } else if (responseType === 'userResponse') {
        // load user name for fun
        message.innerHTML = `Welcome to soubor, ${responseData}. Let's rename some files.`
        // load last path if exists
        if (this.lastPath.length !== 0) {
            folderField.value = this.lastPath
            loadFiles(this.lastPath)
        } else {
            folderField.value = `/home/${responseData}`
        }
    } else if (responseType === 'folderPath') {
        // bring in path
        folderField.value = responseData
        // set the item to localStorage
        localStorage.setItem('lastPath',responseData)
        // load the file info
        loadFiles(responseData)
    } else if (responseType === 'error') {
        modalAlert(responseData)
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
    let fileRows = ''
    // iterate through fileDetails array to build table
    for (let i = 0; i < fileDetails.length; i++) {
        let fileName = fileDetails[i].split(':')[0]
        let fileModified = fileDetails[i].split(':')[1]
        let fileSize = fileDetails[i].split(':')[2]
        //build a row per file
        fileRows += `<tr><td class="tdName">${fileName}</td><td class="tdDetails">${fileModified}</td><td class="tdDetails">${fileSize}</td></tr>`
    }
    fileTable.innerHTML = ''
    fileTable.innerHTML = fileRows
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

// handle action selection UI
selectAction.addEventListener('change', e => {
    let loadHtml = ''
    let startEndSelector = '<select id="startOrEnd" class="field"><option value="startOrEnd" selected disabled>From Start Or End?</option><option value="start">Start</option><option value="end">End</option></select>'
    let textField = '<input id="textField" class="field" type="text" placeholder="Text">'
    let upLowSelector = '<select id="upperLower" class="field"><option value="upperLower" selected disabled>Uppercase or Lowercase?</option><option value="upper">Upper</option><option value="lower">Lower</option></select>'
    
    if (selectAction.value === 'clearFileName') {
        // nothing to do here? add explanation?

    } else if (selectAction.value === 'replaceText') {
        // add fields for replace and replace with


    } else if (selectAction.value === 'addText') {
        // add selector for start vs end and text field
        loadHtml = `<div class="col span-1-of-4">${startEndSelector}</div><div class="col span-2-of-4">${textField}</div>`
    } else if (selectAction.value === 'addNum') {
        // add selector for beginning vs end

        // add field(s) for rule [start number, skip numbers, leading zeroes]

    } else if (selectAction.value === 'trimText') {
        // add selector for beginning vs end

        // add field for start number

    } else if (selectAction.value === 'changeCase') {
        // add selector for Uppercase vs Lowercase
        loadHtml = `<div class="col span-2-of-4">${upLowSelector}</div>`
    } else if (selectAction.value === 'customAction') {
        // modal Alert to give tips on variables
        modalAlert('tips go here')
        // add field for interpretation

    }
    actionHolder.innerHTML = loadHtml
})

let modalAlert = txt => {
    modalContent.removeChild(modalContent.lastElementChild)
    modal.style.display = 'block';
    let modalNode = document.createElement('p')
    modalNode.innerHTML = txt
    modalContent.appendChild(modalNode)
}

span.addEventListener('click', e => {
    modal.style.display = 'none';
})