const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const localShortcut = require('electron-localshortcut');
const { readdir, readFile, writeFile, rename } = require('node:fs/promises');
const { existsSync, mkdirSync } = require('fs');

function createWindow() {
	const win = new BrowserWindow({
		minWidth: 800,
		minHeight: 600,
		frame: false,
		webPreferences: {
			// Set the path of an additional "preload" script that can be used to
			// communicate between node-land and browser-land.
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: true,
			devTools: true // Must be disabled before build the project.
		}
	});
	registerLocalShortcuts(win);

	if (app.isPackaged) {
		win.loadFile(path.resolve(__dirname, 'index.html')).then();
	} else {
		win.loadURL('http://localhost:3000').then();
		win.webContents.openDevTools({ mode: 'detach' });
	}
	return win;
}

function registerLocalShortcuts(win) {
	localShortcut.register(win, ['CommandOrControl+R', 'F5'], () => {
		win.reload();
	});
}

// This method will be called when Electron has finished its initialization and
// is ready to create the browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
	createWindow();
});

app.on('activate', () => {
	// On macOS, it is common to re-create a window in the app when the
	// dock icon is clicked and there no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

// Quit when all windows are closed, except on macOS.
// There, it is common for applications, and their menu bar to stay active until
// the user quits explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});


// ========================================
// Handlers
// ========================================


ipcMain.handle('save:get-files-from-folder', (event, folderName) => {
	return readdir(folderName);
});

ipcMain.handle('save:read-scene', (event, fileName) => {
	return readFile(fileName, { encoding: 'utf-8' }).catch(error => {
		if (error.code === 'ENOENT')
			return null;
	});
});

ipcMain.handle('save:write-scene', (event, fileName, data) => {
	const fileFolder = fileName.substring(0, fileName.lastIndexOf('/'));
	if (!existsSync(fileFolder)) {
		mkdirSync(fileFolder);
	}
	return writeFile(fileName, data, { encoding: 'utf-8' }).catch(error => {
		console.error(error);
		if (error.code === '') {
			return null;
		}
	});
});

ipcMain.handle('save:rename-scene', (event, oldName, newName) => {
	return rename(oldName, newName).catch(error => {
		console.error(error);
		if (error.code === '') {
			return null;
		}
	});
});

ipcMain.handle('app:minimize', () => {
	BrowserWindow.getFocusedWindow().minimize();
});

ipcMain.handle('app:maximize', () => {
	const win = BrowserWindow.getFocusedWindow();
	if (win.isMaximized()) {
		win.unmaximize();
	} else {
		win.maximize();
	}
});

ipcMain.handle('app:close', () => {
	BrowserWindow.getFocusedWindow().close();
});