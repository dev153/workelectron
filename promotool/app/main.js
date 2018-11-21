const {app,BrowserWindow} = require('electron');

const applicationWindowSettings = { 
    title: 'Intralot Promtion Tool',
    width: 1024, 
    height: 768, 
    show: false 
};

console.log('PROMOTION TOOL');

let applicationWindow = null;

//=============================================================================
// FUNCTIONS
//=============================================================================

const logEvent = (eventName) => {
    console.log(`[${eventName}] event`);
};

//=============================================================================
// EVENT LISTENERS
//=============================================================================

const createApplicationWindow = () => {
    applicationWindow = new BrowserWindow(applicationWindowSettings);

    applicationWindow.loadURL(`file://${__dirname}/index.html`);

    applicationWindow.once('ready-to-show', () => {
        logEvent('ready-to-show');
        applicationWindow.show();
    });
    applicationWindow.on('closed',()=>{
        logEvent('closed')
        applicationWindow = null;
    });
};

app.on('ready', () => {
    logEvent('ready');
    createApplicationWindow();
});




