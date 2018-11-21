const {remote,ipcRenderer} = require('electron');
const mainProcess = remote.require('./main.js');

const openFileButton = document.querySelector('#open-file');

openFileButton.addEventListener('click',() => {
    console.log('"Open File" button pressed');
});