

class WindowManager {
    constructor() {
        this.windows = [];
        this.zIndex = 200;
        this.activeWindowId = null;
        this.container = document.getElementById('windows-container');
        this.taskbarApps = document.getElementById('running-apps');
    }

    init() {
        document.addEventListener('mousedown', (e) => {
            const win = e.target.closest('.window');
            if (win) {
                this.focusWindow(win.id);
            }
        });
    }

    openWindow(appId, args = {}) {
        const appConfig = APPS[appId];
        if (!appConfig) {
            console.error(`App ${appId} not found`);
            return;
        }

        const id = `win-${Date.now()}`;
        const winEl = this.createWindowDOM(id, appConfig, args);

        this.container.appendChild(winEl);
        this.windows.push({
            id,
            appId,
            element: winEl,
            minimized: false,
            maximized: false,
            preMaxState: null
        });

        this.setupDrag(winEl);
        this.setupResize(winEl);
        this.focusWindow(id);
        this.addTaskbarItem(id, appConfig);

        if (appConfig.onOpen) appConfig.onOpen(id, args);
    }

    createWindowDOM(id, config, args) {
        const div = document.createElement('div');
        div.id = id;
        div.className = 'window pixel-border';
        div.style.left = '50px';
        div.style.top = '50px';
        div.style.zIndex = ++this.zIndex;

        const titleBar = document.createElement('div');
        titleBar.className = 'title-bar';
        titleBar.innerHTML = `
            <div class="title-text">
                <span class="icon">${config.icon}</span> ${config.title}
            </div>
            <div class="window-controls">
                <button class="minimize-btn" title="Minimize" onclick="window.windowManager.minimizeWindow('${id}')">_</button>
                <button class="maximize-btn" title="Maximize" onclick="window.windowManager.toggleMaximize('${id}')">◻</button>
                <button class="close-btn" title="Close" onclick="window.windowManager.closeWindow('${id}')">X</button>
            </div>
        `;

        const content = document.createElement('div');
        content.className = 'window-content';
        content.innerHTML = config.content(args);

        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'resize-handle';

        div.appendChild(titleBar);
        div.appendChild(content);
        div.appendChild(resizeHandle);
        return div;
    }

    closeWindow(id) {
        const win = document.getElementById(id);
        if (win) {
            win.remove();
            this.windows = this.windows.filter(w => w.id !== id);
            this.removeTaskbarItem(id);
        }
    }

    minimizeWindow(id) {
        const win = document.getElementById(id);
        if (win) {
            win.style.display = 'none';
            const winObj = this.windows.find(w => w.id === id);
            if (winObj) winObj.minimized = true;
            this.updateTaskbarState(id, true);
        }
    }

    restoreWindow(id) {
        const win = document.getElementById(id);
        if (win) {
            win.style.display = 'flex';
            const winObj = this.windows.find(w => w.id === id);
            if (winObj) winObj.minimized = false;
            this.focusWindow(id);
            this.updateTaskbarState(id, false);
        }
    }

    toggleMaximize(id) {
        const win = document.getElementById(id);
        const winObj = this.windows.find(w => w.id === id);

        if (!win || !winObj) return;

        if (!winObj.maximized) {
            winObj.preMaxState = {
                top: win.style.top,
                left: win.style.left,
                width: win.style.width,
                height: win.style.height
            };
            win.classList.add('maximized');
            win.style.top = '0';
            win.style.left = '0';
            win.style.width = '100%';
            win.style.height = 'calc(100% - 48px)';

            winObj.maximized = true;
        } else {
            win.classList.remove('maximized');
            if (winObj.preMaxState) {
                win.style.top = winObj.preMaxState.top;
                win.style.left = winObj.preMaxState.left;
                win.style.width = winObj.preMaxState.width || '';
                win.style.height = winObj.preMaxState.height || '';
            }
            winObj.maximized = false;
        }
    }

    toggleWindow(id) {
        const winObj = this.windows.find(w => w.id === id);
        if (winObj) {
            if (winObj.minimized) {
                this.restoreWindow(id);
            } else {
                if (this.activeWindowId === id) {
                    this.minimizeWindow(id);
                } else {
                    this.focusWindow(id);
                }
            }
        }
    }

    focusWindow(id) {
        const win = document.getElementById(id);
        if (win) {
            this.zIndex++;
            win.style.zIndex = this.zIndex;
            this.activeWindowId = id;

            document.querySelectorAll('.window').forEach(w => w.classList.remove('active'));
            win.classList.add('active');

            this.updateTaskbarState(id, false);
        }
    }

    
    addTaskbarItem(id, config) {
        const btn = document.createElement('button');
        btn.className = 'taskbar-item pixel-btn';
        btn.id = `task-${id}`;
        btn.innerHTML = `${config.icon} ${config.title}`;
        btn.onclick = () => this.toggleWindow(id);
        this.taskbarApps.appendChild(btn);
    }

    removeTaskbarItem(id) {
        const btn = document.getElementById(`task-${id}`);
        if (btn) btn.remove();
    }

    updateTaskbarState(id, minimized) {
        document.querySelectorAll('.taskbar-item').forEach(btn => btn.classList.remove('active'));
        const btn = document.getElementById(`task-${id}`);
        if (btn && !minimized && this.activeWindowId === id) {
            btn.classList.add('active');
        }
    }

    
    setupDrag(element) {
        const titleBar = element.querySelector('.title-bar');
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        titleBar.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON') return;
            const winObj = this.windows.find(w => w.id === element.id);
            if (winObj && winObj.maximized) return;

            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initialLeft = element.offsetLeft;
            initialTop = element.offsetTop;

            this.focusWindow(element.id);
            element.classList.add('dragging');
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            element.style.left = `${initialLeft + dx}px`;
            element.style.top = `${initialTop + dy}px`;
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                element.classList.remove('dragging');
            }
        });
    }

    
    setupResize(element) {
        const handle = element.querySelector('.resize-handle');
        let isResizing = false;
        let startX, startY, startWidth, startHeight;

        handle.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            const winObj = this.windows.find(w => w.id === element.id);
            if (winObj && winObj.maximized) return;

            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startWidth = parseInt(getComputedStyle(element).width, 10);
            startHeight = parseInt(getComputedStyle(element).height, 10);

            this.focusWindow(element.id);
            element.classList.add('resizing');
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            element.style.width = `${startWidth + dx}px`;
            element.style.height = `${startHeight + dy}px`;
        });

        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                element.classList.remove('resizing');
            }
        });
    }
}

window.windowManager = new WindowManager();
