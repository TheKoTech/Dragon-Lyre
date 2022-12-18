const { contextBridge, ipcRenderer } = require('electron');

process.once('loaded', () => {
	contextBridge.exposeInMainWorld('electronAPI', {
		minimize: () => ipcRenderer.invoke('app:minimize'),
		maximize: () => ipcRenderer.invoke('app:maximize'),
		close: () => ipcRenderer.invoke('app:close'),
	});

	contextBridge.exposeInMainWorld('sceneAPI', {
		/**
		 * Returns all files contained in a folder.
		 * @param {File} folderName
		 * @returns {Promise<string[]>}
		 */
		getFilesFromFolder: (folderName) => {
			return ipcRenderer.invoke('save:get-files-from-folder', folderName);
		},
		/**
		 * Reads text from a file.
		 * @param {string} fileName
		 * @returns {Promise<string>}
		 */
		readSceneSave: (fileName) => {
			return ipcRenderer.invoke('save:read-scene', fileName);
		},
		/**
		 * Overwrites the file with the given text. If the file does not exist, it creates a new one.
		 * @param {string} fileName
		 * @param {string} data
		 */
		writeSceneSave: (fileName, data) => {
			return ipcRenderer.invoke('save:write-scene', fileName, data);
		},
		/**
		 * Renames a file.
		 * @param {string} oldName
		 * @param {string} newName
		 */
		renameSceneSave: (oldName, newName) => {
			return ipcRenderer.invoke('save:rename-scene', oldName, newName);
		},
	});
});