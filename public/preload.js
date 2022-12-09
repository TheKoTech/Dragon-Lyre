const { contextBridge, ipcRenderer } = require('electron');

process.once('loaded', () => {
	contextBridge.exposeInMainWorld('electronAPI', {
		/**
		 *
		 * @param {File} folderName
		 * @returns {Promise<string[]>}
		 */
		getFilesFromFolder: (folderName) => {
			return ipcRenderer.invoke('app:get-files-from-folder', folderName);
		},
		/**
		 *
		 * @param {string} fileName
		 * @returns {Promise<string>}
		 */
		readSceneSave: (fileName) => {
			return ipcRenderer.invoke('save:read-scene', fileName);
		},
		/**
		 *
		 * @param {string} fileName
		 * @param {string} data
		 */
		writeSceneSave: (fileName, data) => {
			return ipcRenderer.invoke('save:write-scene', fileName, data);
		},
		/**
		 *
		 * @param {string} oldName
		 * @param {string} newName
		 */
		renameSceneSave: (oldName, newName) => {
			return ipcRenderer.invoke('save:rename-scene', oldName, newName);
		},
	});
});