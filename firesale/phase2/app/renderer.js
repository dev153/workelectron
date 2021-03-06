const {remote,ipcRenderer} = require('electron');
const marked = require('marked');

const mainProcess = remote.require('./main.js');

const markdownView = document.querySelector('#markdown');
const htmlView = document.querySelector('#html');
const newFileButton = document.querySelector('#new-file');
const openFileButton = document.querySelector('#open-file');
const saveMarkdownButton = document.querySelector('#save-markdown');
const revertButton = document.querySelector('#revert');
const saveHtmlButton = document.querySelector('#save-html');
const showFileButton = document.querySelector('#show-file');
const openInDefaultButton = document.querySelector('#open-in-default');

//=============================================================================
// FUNCTIONS
//=============================================================================

const renderMarkdownToHtml = (markdown) => {
    htmlView.innerHTML = marked(markdown, {sanitize: true});
};

//=============================================================================
// EVENT LISTENERS
//=============================================================================

markdownView.addEventListener('keyup', (event)=>{
    console.log('-> Markdown view [keyup] event...');
    const currentContent = event.target.value;
    renderMarkdownToHtml(currentContent);
});
openFileButton.addEventListener('click', () => {
    console.log('-> "Open File" button pressed...');
    //alert('You clicked the "Open File" button.');
    mainProcess.getFileFromUser();
});
ipcRenderer.on('file-opened',(event,file,content)=>{
    markdownView.value = content;
    renderMarkdownToHtml(content);
});