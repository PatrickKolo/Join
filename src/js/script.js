setURL('https://patrick-kolodziej.developerakademie.net/join/src/smallest_backend_ever');
let currentUserEmail = localStorage.getItem('userLoggedInEmail');
let users = [];
let currentUser;
let currentUserTasks = [];
let allTasks = [];
let showMenuinheader = 0;


/**
 * init function will be executed when loading the page, includes heder an sidebar navigation, and get several arrays from the backend
 */
async function init() {
    await includeHTML();
    await downloadFromServer();
    users = await JSON.parse(backend.getItem('users')) || [];
    getCurrentUser();
}


/**
 * checks if the user is logged in
 */
function checkUserIsLoggedIn() {
    checkRememberMeStatus();
    let loginStatus = sessionStorage.getItem('loggedIn');
    if (loginStatus == 'true' && (window.location.pathname == '/join/src/index.html' || window.location.pathname == '/join/src/')) {
        window.location.href = './summary.html';
    } else if (loginStatus == 'true' && window.location.pathname == '/join/src/sign-up.html') {
        window.location.href = './summary.html';
    } else if (loginStatus == null && (window.location.pathname == '/join/src/sign-up.html' || window.location.pathname == '/join/src/')) {

    }
    else if (loginStatus == null && window.location.pathname != '/join/src/index.html') {
        window.location.href = './index.html';
    }
}


/**
 * get the data from the user who is logged in
 */
function getCurrentUser() {
    currentUser = users.find(user => user.email == currentUserEmail);
    //console.log(currentUser);
}


/**
 * logs the user out, deletes the session storage key loggedIn and the local storage key remeberMe
 * user will redirect to log in page index.html
 */
function logout() {
    localStorage.removeItem('userLoggedInEmail', '');
    localStorage.removeItem('userLoggedInName', '');
    sessionStorage.removeItem('loggedIn');
    localStorage.removeItem('rememberMe');
    window.location.href = './index.html';
}


/**
 * checks the remember me status of the user and log the in if the remember me status true
 */
function checkRememberMeStatus() {
    let rememberMeStatus = localStorage.getItem('rememberMe');
    if (rememberMeStatus == 'true') {
        sessionStorage.setItem('loggedIn', 'true')
    }
}


/**
 * shows the popup menu to log out and change the user image
 */
function showMenu() {
    if (showMenuinheader == 0) {
        let menu = document.getElementById('header_nav_popup');
        menu.classList.add('show-menu');
        showMenuinheader++;
    }
    else {
        let menu = document.getElementById('header_nav_popup');
        menu.classList.remove('show-menu');
        showMenuinheader--;
    }
}


/**
 * show aktive page in sidebar navigation
 */
function setNavLinkActive() {
    let navLinks = document.getElementById('sidebar-navigation').getElementsByTagName('a');
    for (let i = 0; i < navLinks.length; i++)
        if (document.location.href.indexOf(navLinks[i].href) >= 0) {
            navLinks[i].classList.add('active');
        }
}


/**
 * function to include html files e.g. header.html and sidebar-navigation.html
 */
async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html");
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}

/**
 * for the user Sign in the header
 */
function imgheader() {
    let letterFB = currentUser['name'].match(/\b(\w)/g).join('');
    let lettersFB = letterFB.toUpperCase();
    document.getElementById('menu_show').innerHTML = lettersFB;
}


/**
 * init function for help.html, privacy-policy.html and impress.html
 */
async function initHelpLegalNotice() {
    await init();
    imgheader();
}