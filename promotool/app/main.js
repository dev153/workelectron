const {app,dialog,BrowserWindow} = require('electron');
const fs = require('fs');

const applicationWindowSettings = { 
    title: 'Intralot Promotion Tool',
    width: 1024, 
    height: 768, 
    show: false 
};

console.log('PROMOTION TOOL');

let applicationWindow = null;
let promotionsJsonContent = null;
// let promotionsMap = new Map();

//=============================================================================
// FUNCTIONS
//=============================================================================

const logEvent = (eventName) => {
    console.log(`[${eventName}] event`);
};

const getFileFromUser = exports.getFileFromUser = () => {
    files = dialog.showOpenDialog({
        properties: ['openFile'],
        filters:[
            { name: "Json Files", extensions: ['json','js'] }
        ]
    });

    if ( files ) {
        console.log(files[0]);
        openFile(files[0]);
    }
}

const openFile = exports.openFile = (file) => {
    const content = fs.readFileSync(file).toString();
    var result = validateContent(content);
    if ( result === true ) {
        promotionsJsonContent = JSON.parse(content);
    }
    applicationWindow.webContents.send('file-opened',result,content);
}

const validateContent = exports.validateContent = (content) => {
    var result = true;
    try {
        promotionsJsonContent = JSON.parse(content);
    } catch ( error ) {
        promotionsJsonContent = null;
        result = false;
    }
    console.log(`validateContent result=${result}`);
    return result;
}

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
