const promotionParser = require('./promotion.parser.js');

const {remote,ipcRenderer} = require('electron');
const mainProcess = remote.require('./main.js');


const openFileButton = document.querySelector('.open-file');
const parseAttributesButton = document.querySelector('.parse-attributes');


const jsonView = document.querySelector('.json-view');
const promotionsView = document.querySelector('.promotions-view');

const messageArea = document.querySelector('.message-area');

openFileButton.addEventListener('click',() => {
    console.log('"Open File" button pressed');
    mainProcess.getFileFromUser();
});

parseAttributesButton.addEventListener('click', () => {
    console.log('"Parse" button pressed');
    const promotionsList = JSON.parse(jsonView.value);
    const result = promotionParser.parsePromotionsList(promotionsList);
    if ( result.error === "" ) {
        var promotionsViewContent = createPromotionsViewContent(result.promotionsMap);
        setPromotionViewContent(promotionsViewContent);
    } else {
        showErrorMessage(result.error);
    }
});

ipcRenderer.on('file-opened',(event,result,content) => {
    console.log('-> file-opened');
    parseAttributesButton.disabled = !result;
    if ( result === true ) {  
        jsonView.value = content;
    } else {
        showErrorMessage('JSON file content invalid.');
    }
});

ipcRenderer.on('promotions-parsed',(event, error, content) => {
    console.log('-> promotions-parsed');
    if ( error === "" ) {
        setPromotionViewContent(content);
    } else {
        showErrorMessage(error);
    }
});

showErrorMessage = (message) => {
    console.log(message);
    messageArea.innerHTML = message;
}

setPromotionViewContent = (content) => {
    promotionsView.innerHTML = content;
}

//=============================================================================
// GUI helper functions
//=============================================================================

const createPromotionsViewContent = (promotionsMap) => {
    console.log(promotionsMap);
    var str = "";
    str += "<ul>";
    for (var [key, value] of promotionsMap) {
        str += `<li>Promotion id ${key}</li>`;
    }
    str += "</ul>";
    console.log(str);
    return str;
}
