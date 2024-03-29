const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
var Datastore = require('nedb')
    , competitorDB = new Datastore({ filename: 'competitorData.db', autoload: true });

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let  mainWindow;
let child;
const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  //Menu.setApplicationMenu(null);

  //and load the index.html of the app.
  //mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.loadURL('http://localhost:3000/');

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on('dataImported', (event, data) => {
  console.log('data imported');
  console.log(data);
  competitorDB.insert(data);
});

ipcMain.on('deleteAll', (event) => {
  competitorDB.remove({}, { multi: true }, function (err, numRemoved) {
    console.log('removed ' + numRemoved + ' documents');
  } );
});

ipcMain.on('ImportCSV', (event) => {
  child = new BrowserWindow({ parent: mainWindow, 
    modal: true,
     show: false,
      width: 700,
       height: 400,
       webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
      }, })
  child.loadURL('http://localhost:3000/importcsv')
  child.once('ready-to-show', () => {
    child.show()
  });
  child.webContents.openDevTools();
});

ipcMain.on('exitTestMode', (event) => {
  child.close();
})


ipcMain.on('getAll', (event) => {
    competitorDB.find({}, function (err, docs) {
        event.reply('received', docs);
    });
});

ipcMain.on('dataBrute', (event, data) => {
    console.log('data brut');
    console.log(data);
    competitorDB.insert(data);
});


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
