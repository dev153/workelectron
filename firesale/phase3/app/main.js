const {app,BrowserWindow,dialog} = require('electron');
const fs = require('fs');

const windowSettings = { 
    show:false,
    width: 1024,
    height: 768
};
const windows = new Set();

//let mainWindow = null;

//=============================================================================
// FUNCTIONS
//=============================================================================

/**
 * The "targetWindow" argument is added so as the renderer process to pass the reference of the target window
 * the "Open File" must be handled.
 */
const getFileFromUser = exports.getFileFromUser = (targetWindow) => {
    // passing the mainWindow reference in the showOpenDialog as a reference
    // on MacOS the dialog will be shown as a drop-down sheet.
    // NOTE: Check on MacOS.
    const files = dialog.showOpenDialog(targetWindow, {
        properties: ['openFile'],
        filters: [
            {name: "Text Files", extensions: ['txt'] },
            {name: "Markdown Files", extensions: ['md','markdown']}
        ]
    });
    if ( files ) {
        /** 
         * The target window is passed as a reference to the renderer process 
         * so as the correct window to be updated.
         * */ 
        openFile(targetWindow, files[0]);
    }
};

const openFile = exports.openfile = (targetWindow, file) => {
    const content = fs.readFileSync(file).toString();
    targetWindow.webContents.send('file-opened',file,content);
}

const createWindow = exports.createWindow = () => {

    let x,y;

    /** Obtain th current window and the position on screen. Increment by 10 pixels both X and Y. 
     * The new window created starting show position is adjusted by the new values.
    */
    const currentWindow = BrowserWindow.getFocusedWindow();
        
    if ( currentWindow ) {
        const [ currentWindowX, currentWindowY ] = currentWindow.getPosition();
        x = currentWindowX + 10;
        y = currentWindowY + 10;
    }

    let newWindow = new BrowserWindow(windowSettings);
    if ( currentWindow ) {
        newWindow.setPosition(x,y);
    }
    
    newWindow.webContents.loadFile(`${__dirname}/index.html`);
    // Avoid the flickering when showing the application by setting the show option to true
    // only when the browser window is ready to be shown.
    newWindow.once('ready-to-show',() => {
        console.log('[ready-to-show] event');
        newWindow.show();
    });
    newWindow.on('closed', ()=>{
        windows.delete(newWindow);
        newWindow = null;
    });
    windows.add(newWindow);
    return newWindow;
};

//=============================================================================
// EVENT LISTENERS
//=============================================================================

app.on('ready', () => {
    console.log('[ready] event');
    createWindow();
});

app.on('window-all-closed', () => {
    console.log('[window-all-closed] event');
    /** On MacOS when all application windows are closed the application must not quit.
     * It should stay open but without any windows open.
     */
    if ( process.platform === 'darwin' ) {
        return false;
    }
    app.quit();
});
app.on('activate',(event,hasVisibleWindows) => {
    console.log('[activate] event');
    console.log(`Has visible windows=${hasVisibleWindows}`);
    if ( !hasVisibleWindows ) {
        createWindow();
    }
});
