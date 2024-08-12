const path = require("path")
const electron = require('electron')
const fs = require('fs');
let loadedLanguage;
let app = electron.app ? electron.app : electron.remote.app
//console.log("app locale",app.getLocale());

let i18nfile=path.join(__dirname, app.getLocale() + '.js');
function i18n() {
    if(fs.existsSync(i18nfile)) {
         loadedLanguage = JSON.parse(fs.readFileSync(path.join(__dirname, app.getLocale() + '.js'), 'utf8'))
    }
    else {
         loadedLanguage = JSON.parse(fs.readFileSync(path.join(__dirname, 'en.js'), 'utf8'))
    }
}


i18n.prototype.__ = function(phrase) {
    let translation = loadedLanguage[phrase]
    if(translation === undefined) {
         translation = phrase
    }
    return translation
}

i18n.prototype.getLoadedLanguage = function() {     
     return loadedLanguage;
 }

module.exports = i18n;