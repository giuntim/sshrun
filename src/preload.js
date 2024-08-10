// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts


const { ipcRenderer } = require('electron')


ipcRenderer.on('readconfig', (event, message) => {
let el = window.document.getElementById('info');  
if(!el) {
  console.log("Error: cannot find info element");
  return;
}
  
if(message) {
  let str='';
  let i=0;
  message.forEach(host => {
    // str += `<button id="btn-${i}" width="100%">${host}</button><br>`;
    //str += `<button id="btn-${i}" class="btn btn-sm btn-primary ">${host}</button>`;
    str += `<a id="btn-${i}" class="list-group-item list-group-item-action" href="#">${host}</a>`;
    i++;
  });

  el.innerHTML=str;   

   for(let k=0;k<i;k++) {
    let button = document.getElementById(`btn-${k}`);
    button.addEventListener('click', () => {
      ipcRenderer.send('runssh', message[k]);
    });
        
   }
}
else {
  // Errore lettura file
  el.innerText="ERROR: cannot read .ssh/config file";  
}


});

