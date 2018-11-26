const promotionParser = require('./promotion.parser.js');

const {remote,ipcRenderer} = require('electron');
const mainProcess = remote.require('./main.js');


const openFileButton = document.querySelector('.open-file');
const parseAttributesButton = document.querySelector('.parse-attributes');


const jsonView = document.querySelector('.json-view');
const promotionsView = document.querySelector('.promotions-view');

const messageArea = document.querySelector('.message-area');

var promotionParseResult = { 
    error: "", 
    promotionsMap: new Map()
};

promotionsView.addEventListener('click', (event) => {
    if ( event.target.tagName == "LI" ) {
        var promotionId = parseInt(event.target.id);
        var promotionObj = promotionParseResult.promotionsMap.get(promotionId);
        if ( typeof(promotionObj === 'Promotion') ) {
            console.log(promotionObj.toString());
        }
    }
});

openFileButton.addEventListener('click',() => {
    console.log('"Open File" button pressed');
    mainProcess.getFileFromUser();
});

parseAttributesButton.addEventListener('click', () => {
    console.log('"Parse" button pressed');
    const promotionsList = JSON.parse(jsonView.value);
    promotionParseResult = promotionParser.parsePromotionsList(promotionsList);
    if ( promotionParseResult.error === "" ) {
        var promotionsViewContent = createPromotionsViewContent(promotionParseResult.promotionsMap);
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
        str += `<li id="${key}">Promotion id ${key}</li>`;
    }
    str += "</ul>";
    console.log(str);
    return str;
}
