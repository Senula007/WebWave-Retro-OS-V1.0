

const SYSTEM_STATE = {
    username: null,
    isLoggedIn: false,
    theme: localStorage.getItem('retroos_theme') || 'orange',
    bootComplete: false
};

const screens = {
    boot: document.getElementById('boot-screen'),
    login: document.getElementById('login-screen'),
    desktop: document.getElementById('desktop')
};

const UI = {
    bootBar: document.getElementById('boot-progress'),
    loginInput: document.getElementById('username-input'),
    loginBtn: document.getElementById('login-btn'),
    loginError: document.getElementById('login-error'),
    userDisplay: document.getElementById('user-display'),
    logoutBtn: document.getElementById('logout-btn'),
    clock: document.getElementById('clock-display'),
    startBtn: document.getElementById('start-btn'),
    startMenu: null
};


document.addEventListener('DOMContentLoaded', () => {
    applyTheme(SYSTEM_STATE.theme);
    runBootSequence();
    setupEventListeners();
    startClock();
    injectStartMenu();
});


function runBootSequence() {
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 10) + 5;
        if (progress > 100) progress = 100;

        if (UI.bootBar) UI.bootBar.style.width = `${progress}%`;

        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                transitionToLogin();
            }, 800);
        }
    }, 200);
}

function transitionToLogin() {
    SYSTEM_STATE.bootComplete = true;
    screens.boot.style.display = 'none';
    screens.login.style.display = 'flex';

    const savedUser = localStorage.getItem('retroos_username');
    if (savedUser) {
        UI.loginInput.value = savedUser;
    }
    UI.loginInput.focus();
}


function handleLogin() {
    const input = UI.loginInput.value.trim();

    if (input.length === 0) {
        showLoginError("USERNAME REQUIRED");
        return;
    }

    SYSTEM_STATE.username = input;
    SYSTEM_STATE.isLoggedIn = true;
    localStorage.setItem('retroos_username', input);

    UI.userDisplay.textContent = input.toUpperCase();

    screens.login.style.display = 'none';
    screens.desktop.style.display = 'block';

    initializeDesktop();
}

function showLoginError(msg) {
    UI.loginError.textContent = msg;
    const loginWindow = document.querySelector('.login-window');
    loginWindow.style.transform = 'translate(5px, 0)';
    setTimeout(() => loginWindow.style.transform = 'translate(-5px, 0)', 50);
    setTimeout(() => loginWindow.style.transform = 'translate(5px, 0)', 100);
    setTimeout(() => loginWindow.style.transform = 'translate(0, 0)', 150);
}

function handleLogout() {
    SYSTEM_STATE.isLoggedIn = false;
    SYSTEM_STATE.username = null;

    screens.desktop.style.display = 'none';
    screens.login.style.display = 'flex';
    UI.loginInput.value = '';
    UI.loginInput.focus();

    if (window.windowManager && window.windowManager.closeAll) {
        window.windowManager.closeAll();
    }
    window.location.reload();
}


function applyTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    SYSTEM_STATE.theme = themeName;
    localStorage.setItem('retroos_theme', themeName);
}


function initializeDesktop() {
    console.log("Desktop Environment Loaded");
    if (window.generateDesktopIcons) window.generateDesktopIcons();
    if (window.windowManager) window.windowManager.init();
}

function startClock() {
    setInterval(() => {
        const now = new Date();
        UI.clock.textContent = now.toLocaleTimeString();
    }, 1000);
}

function injectStartMenu() {
    const taskbar = document.getElementById('taskbar');
    const menu = document.createElement('div');
    menu.id = 'start-menu';
    menu.innerHTML = `
        <div class="start-menu-header">
            <span style="font-size: 24px;">💾</span>
            <div>WEBWAVE<br>RETRO OS</div>
        </div>
        <div class="start-menu-items">
            <div class="start-item" onclick="window.windowManager.openWindow('explorer'); toggleStartMenu();">📁 My Files</div>
            <div class="start-item" onclick="window.windowManager.openWindow('terminal'); toggleStartMenu();">>_ Terminal</div>
            <div class="start-item" onclick="window.windowManager.openWindow('minesweeper'); toggleStartMenu();">💣 Minesweeper</div>
            <div class="start-item" onclick="window.windowManager.openWindow('settings'); toggleStartMenu();">⚙️ Settings</div>
            <div class="start-item logout" onclick="handleLogout()">🚪 Log Out</div>
        </div>
    `;
    screens.desktop.appendChild(menu);
    UI.startMenu = menu;
}

function toggleStartMenu() {
    const menu = document.getElementById('start-menu');
    if (!menu) return;
    menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
}


function setupEventListeners() {
    UI.loginBtn.addEventListener('click', handleLogin);
    UI.loginInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });

    UI.logoutBtn.addEventListener('click', handleLogout);

    UI.startBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleStartMenu();
    });

    document.addEventListener('click', (e) => {
        if (e.target.id !== 'start-btn' && !e.target.closest('#start-menu')) {
            const menu = document.getElementById('start-menu');
            if (menu) menu.style.display = 'none';
        }
    });

    document.addEventListener('contextmenu', event => event.preventDefault());
}
