const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
	const mainWindow = new BrowserWindow({
		minWidth: 800,
		minHeight: 600,
		webPreferences: {
			autoHideMenuBar: true,
			// Set the path of an additional "preload" script that can be used to
			// communicate between node-land and browser-land.
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: true,
			devTools: true // Must be disabled before build the project.
		}
	});

	if (app.isPackaged)
		mainWindow.loadFile(path.resolve(__dirname, 'index.html'));
	else
		mainWindow.loadURL('http://localhost:3000');

	return mainWindow;
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

// If your app has no need to navigate or only needs to navigate to known pages,
// it is a good idea to limit navigation outright to that known scope,
// disallowing any other kinds of navigation.
const allowedNavigationDestinations = 'https://my-electron-app.com';
app.on('web-contents-created', (event, contents) => {
	contents.on('will-navigate', (event, navigationUrl) => {
		const parsedUrl = new URL(navigationUrl);

		if (!allowedNavigationDestinations.includes(parsedUrl.origin)) {
			event.preventDefault();
		}
	});
});