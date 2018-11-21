const {app,BrowserWindow,dialog} = require('electron');
const fs = require('fs');

let mainWindow = null;

//=============================================================================
// FUNCTIONS
//=============================================================================

const getFileFromUser = exports.getFileFromUser = () => {
    // passing the mainWindow reference in the showOpenDialog as a reference
    // on MacOS the dialog will be shown as a drop-down sheet.
    // NOTE: Check on MacOS.
    const files = dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [
            {name: "Text Files", extensions: ['txt'] },
            {name: "Markdown Files", extensions: ['md','markdown']}
        ]
    });
    if ( files ) {
        openFile(files[0]);
    }
};

const openFile = (file) => {
    const content = fs.readFileSync(file).toString();
    mainWindow.webContents.send('file-opened',file,content);
}

//=============================================================================
// EVENT LISTENERS
//=============================================================================

app.on('ready', () => {
    mainWindow = new BrowserWindow(
        { 
            show:false,
            width: 1024,
            height: 768
        }
    );
    mainWindow.webContents.loadFile(__dirname+"/index.html");
    // Avoid the flickering when showing the application by setting the show option to true
    // only when the browser window is ready to be shown.
    mainWindow.once('ready-to-show',()=>{
        console.log('[ready-to-show] event');
        mainWindow.show();
        // getFileFromUser();
    });
    mainWindow.on('closed', () => {
        console.log('[closed] event');
        mainWindow = null;
    });
});
