const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage } = require('electron');

const path = require('node:path');
const fs = require('node:fs');
const child_process = require('child_process');

// I18N
var i18n = null; 


// Finestra principale e tray icon
var mainWindow=null;
var tray=null;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const trayIcon = nativeImage.createFromPath(path.join(__dirname , 'sshrun256.png'))
const appIcon = nativeImage.createFromPath(path.join(__dirname , 'sshrun256.png'))


const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: appIcon,
    show: false,
    autoHideMenuBar: true, // Hide menu
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });


  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  
  
  // Create Tray icon
  tray = new Tray(trayIcon);

 

  // Open the DevTools. (needed for debug only)
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

  // Init 18n (must init after startup)
  i18n = new(require('./i18n/i18n.js'))
  


  // Create main window
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

    // Add fixed menu elemente
    traymenu.push({type:'separator'});
    traymenu.push(
      { label: i18n.__('Main window'), click:  function(){
        if(mainWindow.isVisible()) {
          mainWindow.hide();
        }
        else {
          mainWindow.show();
        }
      } });
    traymenu.push(
      { label: i18n.__('Quit'), click:  function(){
        app.isQuiting = true;
        app.quit();
      } });
  
    
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

  // Send I18N to interface process
  app.interfaceI18n();

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


app.interfaceI18n = function() {
  // sne I18N JSON to interface
  //console.log(i18n.getLoadedLanguage());
  mainWindow.webContents.send('i18n', i18n.getLoadedLanguage());
}