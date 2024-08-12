// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts


const { ipcRenderer } = require('electron');


// Applies I18N to main window elements
ipcRenderer.on('i18n', (event, trans) => {
  Object.keys(trans).forEach(function(key) {
    // console.log(key, trans[key]);
    if(key.substring(0,1)=='#') {
      let elid=key.substring(1);
      let el = window.document.getElementById(elid);
      if(el) {
        el.innerText = trans[key];
      }
    }
  });

});

