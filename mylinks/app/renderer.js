const parser = new DOMParser();
const linksSection = document.querySelector('.links');
const errorMessage = document.querySelector('.error-message');
const newLinkForm = document.querySelector('.new-link-form');
const newLinkUrl = document.querySelector('.new-link-url');
const newLinkSubmit = document.querySelector('.new-link-submit');
const clearStorageButton = document.querySelector('.clear-storage');

// Helper functions
const clearForm = () => {
    newLinkUrl.value = null;
}
const parseResponse = (text) => {
    return parser.parseFromString(text,'text/html');
}
const findTitle = (nodes) => {
    return nodes.querySelector('title').innerText;
}
const storeLink = (title,url) => {
    localStorage.setItem(url, JSON.stringify({title: title, url: url}));
}
const getLinks = () => {
    return Object.keys(localStorage)
        .map(key => JSON.parse(localStorage.getItem(key)));
}
const convertToElement = (link) => {
        var result = "";
        result += '<div class="link">';
        result += `<h3>${link.title}</h3>`;
        result += '<p>';
        result += `<a href="${link.url}">${link.url}</a>`;
        result += '</p>';
        result += '</div>';
        return result;
};
const renderLinks = () => {
    const linkElements = getLinks().map(convertToElement).join('');
    linksSection.innerHTML = linkElements;
};
// Event handlers
newLinkUrl.addEventListener('keyup', () => {
    newLinkSubmit.disabled = !newLinkUrl.validity.valid;
});

newLinkForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const url = newLinkUrl.value;
    fetch(url)
    .then(response => response.text())
    .then(parseResponse)
    .then(findTitle)
    .then(title => storeLink(title,url))
    .then(clearForm)
    .then(renderLinks);
});

clearStorageButton.addEventListener('click', () => {
    localStorage.clear();
    linksSection.innerHTML = '';
});

renderLinks();
