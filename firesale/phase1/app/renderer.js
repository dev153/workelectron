const marked = require('marked');

const markdownView = document.querySelector('#markdown');
const htmlView = document.querySelector('#html');
const newFileButton = document.querySelector('#new-file');
const openFileButton = document.querySelector('#open-file');
const saveMarkdownButton = document.querySelector('#save-markdown');
const revertButton = document.querySelector('#revert');
const saveHtmlButton = document.querySelector('#save-html');
const showFileButton = document.querySelector('#show-file');
const openInDefaultButton = document.querySelector('#open-in-default');

//=====================================================================================================================
// FUNCTIONS
//=====================================================================================================================

const renderMarkdownToHtml = (markdown) => {
    htmlView.innerHTML = marked(markdown, {sanitize: true});
};

//=====================================================================================================================
// EVENT LISTENERS
//=====================================================================================================================

markdownView.addEventListener('keyup', (event)=>{
    console.log('-> Markdown view [keyup] event...');
    const currentContent = event.target.value;
    renderMarkdownToHtml(currentContent);
});

newFileButton.addEventListener('click', () => {
    console.log('-> New file button pressed...');
});