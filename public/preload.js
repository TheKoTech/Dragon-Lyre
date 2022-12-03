const { contextBridge, ipcRenderer } = require('electron');

process.once('loaded', () => {
	contextBridge.exposeInMainWorld('electronAPI', {
		getFilesFromFolder: (folder) => {
			ipcRenderer.invoke('app:get-files-from-folder', folder);
		}
	});
});