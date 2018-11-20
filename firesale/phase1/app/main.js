const {app,BrowserWindow} = require('electron');

const browserWindowOptions = {
    width: 800,
    height: 600,
    show: false
}

let mainWindow = null;

app.on('ready', () => {
    mainWindow = new BrowserWindow(browserWindowOptions);
    mainWindow.webContents.loadFile(__dirname+"/index.html");
    // Avoid the flickering when showing the application by setting the show option to true
    // only when the browser window is ready to be shown.
    mainWindow.on('ready-to-show',()=>{
        console.log('[ready-to-show] event');
        mainWindow.show();
    });
    mainWindow.on('closed', () => {
        console.log('[closed] event');
        mainWindow = null;
    });
});