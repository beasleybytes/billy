const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  addBill: (name, amount, type) => ipcRenderer.invoke("add-bill", name, amount, type),
  getBills: () => ipcRenderer.invoke("get-bills"),
  editBill: (id, newName, newAmount) => ipcRenderer.invoke("edit-bill", id, newName, newAmount),
  deleteBill: (id) => ipcRenderer.invoke("delete-bill", id),
});