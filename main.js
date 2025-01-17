const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { addBill, getBills, editBill, deleteBill } = require("./database");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  mainWindow.loadFile("index.html");

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Handle database operations
ipcMain.handle("add-bill", async (event, name, amount, type) => {
  await addBill(name, amount, type);
});

ipcMain.handle("get-bills", async () => {
  return await getBills();
});

ipcMain.handle("edit-bill", async (event, id, newName, newAmount) => {
  await editBill(id, newName, newAmount);
});

ipcMain.handle("delete-bill", async (event, id) => {
  await deleteBill(id);
});

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});