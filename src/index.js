const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage } = require('electron');

const path = require('node:path');
const fs = require('node:fs');
//const spawn = require("child_process").spawn;
const child_process = require('child_process');

// Finestra principale e tray icon
var mainWindow=null;
var tray=null;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname , 'sshrun256.png'),
    show: false,
    autoHideMenuBar: true, // Hide menu
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  
  

  const icon = nativeImage.createFromPath(path.join(__dirname , 'sshrun256.png'));
  tray = new Tray(icon);

 

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
  
  mainWindow.on('minimize',function(event){
    event.preventDefault();
    mainWindow.hide();
  });
  
  mainWindow.on('close', function(event) {
    if(!app.isQuiting){
        event.preventDefault();
        mainWindow.hide();
    }
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }

  });

  let filepath = app.getPath('home');
  filepath += '/.ssh/config';

  let traymenu = []; // Tray menu
  traymenu.push(
    { label: 'Main window', click:  function(){
      if(mainWindow.isVisible()) {
        mainWindow.hide();
      }
      else {
        mainWindow.show();
      }
    } });
  traymenu.push(
    { label: 'Quit', click:  function(){
      app.isQuiting = true;
      app.quit();
    } });
  traymenu.push({type:'separator'});


  // Read ssh config file and build menu
  let hosts = [];
  fs.readFile(filepath, 'utf8', function (err, data) {
    // Display the file content
    let lines = data.split("\n");
    let i=0;
    lines.forEach(l => {
      l=l.trim();
      if(l.substring(0,5).toLowerCase() == 'host ') {
          let ary = l.split(" ");
          hosts.push(ary[1]);
          traymenu.push({label:ary[1],id:'ssh-'+i,type:'normal',click:app.sshconnect})
          i++;
      }
    });

    
    // Createcontext menu and add it to the tray icon
    const contextMenu = Menu.buildFromTemplate(traymenu);
    tray.setContextMenu(contextMenu);
    
    tray.on('click',function(event){
      if(mainWindow.isVisible()) {
        mainWindow.hide();
      }
      else {
        mainWindow.show();
      }
    });
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.on('runssh', (event, command) => {
  let cmd ="gnome-terminal -e 'ssh "+command+"'";
  child_process.exec(cmd);
})

app.sshconnect = function(event) {
  let cmd ="gnome-terminal -e 'ssh "+event.label+"'";
  child_process.exec(cmd);
}