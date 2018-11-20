const {app,BrowserWindow} = require('electron');
const {path} = require('path');
const applicationSettings = {
  'title': 'My Links',
  'width': 1024,
  'height': 768
};

let mainWindow = null;

app.on('ready', () => {
    console.log('Hello from Electron');
    mainWindow = new BrowserWindow(applicationSettings);
    mainWindow.webContents.loadFile(__dirname+'/index.html');
});
