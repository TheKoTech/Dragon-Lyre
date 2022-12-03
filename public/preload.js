const { contextBridge, ipcRenderer } = require('electron');

process.once('loaded', () => {
	contextBridge.exposeInMainWorld('electronAPI', {
		getFilesFromFolder: (folder) => {
			return ipcRenderer.invoke('app:get-files-from-folder', folder);
		},
	});
});