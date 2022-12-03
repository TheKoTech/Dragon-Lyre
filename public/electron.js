const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const path = require('path');

function createWindow() {
	const mainWindow = new BrowserWindow({
		minWidth: 800,
		minHeight: 600,
		webPreferences: {
			// Set the path of an additional "preload" script that can be used to
			// communicate between node-land and browser-land.
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: true,
			devTools: true // Must be disabled before build the project.
		}
	});
	mainWindow.removeMenu();
	registerGlobalShortcuts(mainWindow);


	if (app.isPackaged) {
		mainWindow.loadFile(path.resolve(__dirname, 'index.html'));
	} else {
		mainWindow.loadURL('http://localhost:3000');
		mainWindow.webContents.openDevTools({ mode: 'detach' });
	}
	return mainWindow;
}

function registerGlobalShortcuts(mainWindow) {
	globalShortcut.register('F5', () => {
		mainWindow.reload();
	});
	globalShortcut.register('CommandOrControl+R', () => {
		mainWindow.reload();
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


// Handlers

ipcMain.handle('app:get-files-from-folder', (event, folder) => {
	const fs = require('fs');

	const files = [];
	fs.readdirSync(folder).forEach(file => {
		files.push(file);
	});
	return files;
});