





const FILE_SYSTEM = {
    'My Documents': [
        { name: 'resume.txt', type: 'txt', content: 'EXPERIENCE: Senior Web Developer...' },
        { name: 'CV.png', type: 'img', content: 'assets/img/CV.png' },
        { name: 'todo.txt', type: 'txt', content: '- Finish OS Project\n- Buy Milk' },
        { name: 'notes.txt', type: 'txt', content: 'Meeting at 5PM' }
    ],
    'Images': [
        { name: 'cat.png', type: 'img', content: '🐱' },
        { name: 'dog.png', type: 'img', content: '🐶' },
        { name: 'vacation.jpg', type: 'img', content: '🏖️' }
    ],
    'System': [
        { name: 'config.sys', type: 'txt', content: 'sys_root=true' },
        { name: 'autoexec.bat', type: 'txt', content: '@echo off' }
    ]
};

const GALLERY_DATA = [
    { id: 1, title: 'Retro Computer', year: '1984', desc: 'The dawn of personal computing.', icon: '💻', color: '#ff9e42' },
    { id: 2, title: 'Floppy Disk', year: '1971', desc: '1.44MB of pure storage power.', icon: '💾', color: '#4287f5' },
    { id: 3, title: 'Cassette Tape', year: '1963', desc: 'Music and data in a magnetic ribbon.', icon: '📼', color: '#e042f5' },
    { id: 4, title: 'Arcade Stick', year: '1980', desc: 'Precise control for pixel battles.', icon: '🕹️', color: '#f54242' },
    { id: 5, title: 'CRT Monitor', year: '1990', desc: 'Heavy, warm, and beautiful scanlines.', icon: '📺', color: '#42f590' },
    { id: 6, title: 'Game Cartridge', year: '1985', desc: 'Blow on it to make it work.', icon: '👾', color: '#f5ef42' }
];

const APPS = {
    'about': {
        title: 'About OS',
        icon: 'ℹ️',
        content: () => `
            <div style="padding: 20px; text-align: center;">
                <h2>WebWave Retro OS</h2>
                <p>v1.0.0</p>
                <br>
                <p>A pure JS/CSS retro operating system simulation.</p>
                <p>Created for the Senior Category Project.</p>
                <br>
                <ul style="text-align: left; margin-left: 20px;">
                    <li>Vanilla HTML/CSS/JS</li>
                    <li>No Frameworks</li>
                    <li>Persistent Settings</li>
                </ul>
                <div style="margin-top: 20px; border-top: 2px dashed var(--border-color); padding-top: 10px;">
                    <h3>Developer</h3>
                    <p style="font-weight: bold; margin-bottom: 5px;">Senula Rohanaweera</p>
                    <div style="display: flex; flex-direction: column; gap: 5px;">
                        <a href="https://senula007.netlify.app" target="_blank" style="color: var(--text-color); text-decoration: none; border-bottom: 1px dotted var(--accent-color);">🌐 Website</a>
                        <a href="https://www.instagram.com/senula007/" target="_blank" style="color: var(--text-color); text-decoration: none; border-bottom: 1px dotted var(--accent-color);">📸 Instagram</a>
                        <a href="https://www.facebook.com/profile.php?id=61557262795362" target="_blank" style="color: var(--text-color); text-decoration: none; border-bottom: 1px dotted var(--accent-color);">📘 Facebook</a>
                    </div>
                </div>
            </div>
        `
    },
    'settings': {
        title: 'Settings',
        icon: '⚙️',
        content: () => `
            <div class="settings-panel" style="padding: 20px;">
                <h3>Display Settings</h3>
                
                <div class="setting-row">
                    <label>Theme:</label>
                    <select id="theme-select" class="pixel-input" onchange="createAppsHandlers.changeTheme(this.value)">
                        <option value="orange">Retro Orange</option>
                        <option value="light">Classic White</option>
                        <option value="dark">Midnight Dark</option>
                    </select>
                </div>
                
                <br>
                <div class="setting-row">
                    <label>
                        <input type="checkbox" id="crt-toggle" onchange="createAppsHandlers.toggleCRT(this.checked)" checked>
                        CRT Effects
                    </label>
                </div>

                <div class="setting-row">
                    <button class="pixel-btn" onclick="localStorage.clear(); location.reload();" style="width: 100%; margin-top: 20px; background: red; color: white;">RESET SYSTEM</button>
                </div>
            </div>
        `,
        onOpen: () => {
            const theme = localStorage.getItem('retroos_theme') || 'orange';
            const crt = localStorage.getItem('retroos_crt') !== 'false';
            setTimeout(() => {
                const sel = document.getElementById('theme-select');
                const tog = document.getElementById('crt-toggle');
                if (sel) sel.value = theme;
                if (tog) tog.checked = crt;
            }, 0);
        }
    },
    'gallery': {
        title: 'Gallery Museum',
        icon: '🖼️',
        content: () => `
            <div style="padding: 10px; height: 100%; display: flex; flex-direction: column;">
                <div style="margin-bottom: 10px; font-weight: bold; border-bottom: 2px solid var(--border-color);">Exhibit Hall</div>
                <div class="gallery-grid" style="flex: 1; overflow-y: auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px; padding-bottom: 20px;">
                    ${GALLERY_DATA.map(item => `
                        <div class="gallery-item pixel-border" onclick="createAppsHandlers.openGalleryItem(${item.id})" style="background: ${item.color}20; cursor: pointer; display: flex; flex-direction: column; align-items: center; padding: 10px; transition: transform 0.1s;">
                            <div style="font-size: 40px;">${item.icon}</div>
                            <div style="font-weight: bold; margin-top: 5px; text-align: center; font-size: 14px;">${item.title}</div>
                            <div style="font-size: 12px; opacity: 0.7;">${item.year}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `
    },
    'terminal': {
        title: 'Terminal',
        icon: '>_',
        content: () => `
            <div class="terminal-container" style="background: #000; color: #0f0; padding: 10px; height: 100%; font-family: monospace;">
                <div id="terminal-output">Welcome to WebWave Shell. Type 'help' for commands.</div>
                <div style="display: flex; margin-top: 10px;">
                    <span>$ </span>
                    <input type="text" id="terminal-input" style="background: transparent; border: none; color: #0f0; width: 100%; outline: none; font-family: monospace;" autofocus onkeydown="createAppsHandlers.handleTerminal(event)">
                </div>
            </div>
        `,
        onOpen: (id) => {
            setTimeout(() => {
                const input = document.querySelector(`#${id} #terminal-input`);
                if (input) input.focus();
            }, 100);
        }
    },
    'minesweeper': {
        title: 'Minesweeper',
        icon: '💣',
        content: () => `
            <div id="minesweeper-game" style="text-align: center; padding: 10px;">
                <div class="ms-header pixel-border" style="display: flex; justify-content: space-between; padding: 4px; margin-bottom: 8px; background: #c0c0c0; color: black;">
                    <div id="ms-mines-count" class="ms-counter">010</div>
                    <button class="ms-face-btn" onclick="window.initMinesweeper()">😊</button>
                    <div id="ms-timer" class="ms-counter">000</div>
                </div>
                <div id="ms-board" class="pixel-border" style="display: inline-grid; gap: 0; background: #808080;">
                    
                </div>
                <div style="margin-top: 8px; font-size: 12px;">Right Click to Flag</div>
            </div>
        `,
        onOpen: () => {
            if (window.initMinesweeper) window.initMinesweeper();
        }
    },
    'explorer': {
        title: 'File Explorer',
        icon: '📁',
        content: () => `
            <div class="explorer-container">
                <div class="explorer-sidebar">
                    <div style="font-weight: bold; padding: 4px;">My Computer</div>
                    <ul style="list-style: none; padding-left: 10px; cursor: pointer;">
                        <li onclick="createAppsHandlers.openFolder('My Documents')">📂 My Documents</li>
                        <li onclick="createAppsHandlers.openFolder('Images')">📷 Images</li>
                        <li onclick="createAppsHandlers.openFolder('System')">⚙️ System</li>
                    </ul>
                </div>
                <div class="explorer-main" id="explorer-view">
                    <div style="text-align: center; width: 100%; padding-top: 20px; color: grey;">Select a folder...</div>
                </div>
            </div>
        `
    },
    'image-viewer': {
        title: 'Image Viewer',
        icon: '🖼️',
        content: (args) => {
            const src = args && args.path ? args.path : '';
            if (!src) return `<div style="padding:20px;">No Image Selected</div>`;
            if (src.includes('.')) {
                return `<div style="display:flex; justify-content:center; align-items:center; height:100%; background:#000;">
                        <img src="${src}" style="max-width:100%; max-height:100%; object-fit:contain;">
                      </div>`;
            } else {
                return `<div style="display:flex; justify-content:center; align-items:center; height:100%; font-size:100px;">
                        ${src}
                      </div>`;
            }
        }
    }
};


window.APPS = APPS;
window.FILE_SYSTEM = FILE_SYSTEM;


const createAppsHandlers = {
    changeTheme: (theme) => {
        applyTheme(theme);
    },
    toggleCRT: (enabled) => {
        const overlay = document.getElementById('crt-overlay');
        overlay.style.display = enabled ? 'block' : 'none';
        localStorage.setItem('retroos_crt', enabled);
    },
    handleTerminal: (e) => {
        if (e.key === 'Enter') {
            const input = e.target;
            const cmd = input.value.trim().toLowerCase();
            const output = input.parentElement.parentElement.querySelector('#terminal-output');

            output.innerHTML += `<div>$ ${input.value}</div>`;

            if (cmd === 'help') {
                output.innerHTML += `<div>Available: help, clear, about, theme [orange|light|dark]</div>`;
            } else if (cmd === 'clear') {
                output.innerHTML = '';
            } else if (cmd.startsWith('theme ')) {
                const theme = cmd.split(' ')[1];
                if (['orange', 'light', 'dark'].includes(theme)) {
                    applyTheme(theme);
                    output.innerHTML += `<div>Theme changed to ${theme}</div>`;
                } else {
                    output.innerHTML += `<div>Unknown theme. Use: orange, light, dark</div>`;
                }
            } else {
                output.innerHTML += `<div>Command not found: ${cmd}</div>`;
            }

            input.value = '';
            output.scrollTop = output.scrollHeight;
        }
    },
    openFolder: (folderName) => {
        const view = document.getElementById('explorer-view');
        if (!view) return;

        const files = FILE_SYSTEM[folderName];
        if (!files) return;

        view.innerHTML = '';
        files.forEach(file => {
            const el = document.createElement('div');
            el.className = 'file-item';
            el.innerHTML = `
                <div class="file-icon">${file.type === 'txt' ? '📄' : '📷'}</div>
                <div class="file-name">${file.name}</div>
            `;
            el.ondblclick = () => {
                if (file.type === 'img') {
                    window.windowManager.openWindow('image-viewer', { path: file.content });
                } else {
                    alert(`Opening ${file.name}\n\n${file.content}`);
                }
            };
            view.appendChild(el);
        });
    },
    openGalleryItem: (id) => {
        const item = GALLERY_DATA.find(i => i.id === id);
        if (!item) return;

        const overlay = document.createElement('div');
        overlay.id = 'gallery-lightbox';
        overlay.className = 'lightbox-overlay';
        overlay.innerHTML = `
            <div class="lightbox-content pixel-border">
                <button class="lightbox-close pixel-btn" onclick="this.closest('#gallery-lightbox').remove()">X</button>
                <div class="lightbox-hero" style="background: ${item.color};">
                    <div style="font-size: 100px;">${item.icon}</div>
                </div>
                <div class="lightbox-details">
                    <h1>${item.title}</h1>
                    <div class="badge">${item.year}</div>
                    <p>${item.desc}</p>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    }
};

window.createAppsHandlers = createAppsHandlers;


const DESKTOP_ICONS = [
    { id: 'about', label: 'About OS', icon: 'ℹ️', action: 'about' },
    { id: 'settings', label: 'Settings', icon: '⚙️', action: 'settings' },
    { id: 'explorer', label: 'My Files', icon: '📁', action: 'explorer' },
    { id: 'gallery', label: 'Gallery', icon: '🖼️', action: 'gallery' },
    { id: 'terminal', label: 'Terminal', icon: '>_', action: 'terminal' },
    { id: 'minesweeper', label: 'Minesweeper', icon: '💣', action: 'minesweeper' },
];

function generateDesktopIcons() {
    const container = document.getElementById('desktop-icons-container');
    container.innerHTML = '';

    DESKTOP_ICONS.forEach(icon => {
        const el = document.createElement('div');
        el.className = 'desktop-icon';
        el.innerHTML = `
            <div class="icon-img">${icon.icon}</div>
            <div class="icon-label">${icon.label}</div>
        `;
        el.onclick = () => {
            document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
            el.classList.add('selected');
        };
        el.ondblclick = () => {
            window.windowManager.openWindow(icon.action);
        };
        container.appendChild(el);
    });
}
