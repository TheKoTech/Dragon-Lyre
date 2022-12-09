const { contextBridge, ipcRenderer } = require('electron');

process.once('loaded', () => {
	contextBridge.exposeInMainWorld('electronAPI', {
		/**
		 *
		 * @param {File} folder
		 * @returns {Promise<string[]>}
		 */
		getFilesFromFolder: (folder) => {
			return ipcRenderer.invoke('app:get-files-from-folder', folder);
		},
		/**
		 *
		 * @param {string} file
		 * @returns {Promise<string>}
		 */
		readSceneSave: (file) => {
			return ipcRenderer.invoke('app:read-scene-save', file);
		},
		/**
		 *
		 * @param {string} file
		 * @param {string} data
		 */
		writeSceneSave: (file, data) => {
			return ipcRenderer.invoke('app:write-scene-save', file, data);
		},
	});
});