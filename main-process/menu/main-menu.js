const { app, Menu, BrowserWindow, ipcMain, nativeTheme, Tray, dialog } = require('electron')
const homedir = require("os").homedir();
const dbPath = homedir + "/sivathai-collections/";
const dbName = 'sivathai.db';
const fs = require("fs");

const isMac = process.platform === 'darwin';
let knex = require("knex");

let server = require(__dirname+'./../../server.js');

const template = [
  // { role: 'appMenu' }
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  // { role: 'fileMenu' }
  {
    label: 'Menus',
    submenu: [
      {
        label: 'All Streets',
        click(item, focusedWindow,event) {
          focusedWindow.webContents.send('switch-ng-page', 'all-streets');
        }
      },
      {
        label: 'All Families',
        click(item, focusedWindow, event) {
          focusedWindow.webContents.send('switch-ng-page', 'all-families');
        }
      },
      {
        label: 'All Collections',
        click(item, focusedWindow, event) {
          focusedWindow.webContents.send('switch-ng-page', 'all-collections');
        }
      },{
        label: 'Exit',
        role: 'quit'
      }
    ]
  },
  {
    label: 'Action',
    submenu: [
      {
        label: 'Export Data',
        click(item, focusedWindow) {
          // focusedWindow.webContents.send('switch-ng-page', 'no-service');
          exportDatabase();
        }
      },
      {
        label: 'Import Data',
        click(item, focusedWindow) {
          // focusedWindow.webContents.send('switch-ng-page', 'no-service');
          importDatabase();
        }
      }
    ]
  },
  {
    label: 'Reports',
    submenu: [
      {
        label: 'Families',
        click(item, focusedWindow) {
          focusedWindow.webContents.send('switch-ng-page', 'no-service');
        }
      },
      {
        label: 'People',
        click(item, focusedWindow) {
          focusedWindow.webContents.send('switch-ng-page', 'no-service');
        }
      },
      {
        label: 'Collections',
        click(item, focusedWindow) {
          focusedWindow.webContents.send('switch-ng-page', 'no-service');
        }
      }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Contact Developer - Selvavignesh Perumal',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://www.facebook.com/selva.vignesh.1029')
        }
      }
      ,{
        label: 'Other Support - Balagunasingh',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://www.facebook.com/balagunasingh')
        }
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Alt+A' : 'Alt+A',
        click(item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.toggleDevTools()
        }
      },
    ]
  }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

ipcMain.on('open-error-dialog', (event) => {
  dialog.showErrorBox('An Error Message', 'Demonstrating an error message.')
})

async function exportDatabase(){

const activeWindow = BrowserWindow.getFocusedWindow();


  await dialog.showMessageBox(activeWindow, {title: 'warning', message: 'The exported data may contains sensitive information.'})

  var options = {
    title: "Export Data",
    defaultPath : "Sivathaiya Puram - "+(new Date).toDateString(),
    buttonLabel : "Save",

    filters :[
        {name: 'Sqlite Database', extensions: ['db']},
        {name: 'All Files', extensions: ['*']}
    ]
};

dialog.showSaveDialog(activeWindow, options).then(({ filePath }) => {
    // fs.writeFileSync(filePath, "hello world", 'utf-8');
    fs.copyFile(dbPath+dbName, filePath, (err)=>{
      if (err) {
        // console.log('err :>> ', err);
        activeWindow.webContents.send('switch-ng-page', {type:'message', message: 'Cannot be saved'});
        return;
      };
      activeWindow.webContents.send('switch-ng-page',{type:'message', message: 'Successfully exported'});
    });
});

}

async function importDatabase(){
  // server = null;

  console.log('knex.client :>> ', knex.client);
  // const knex = require("knex")({
  //   client: "sqlite3",
  //   connection: {
  //     filename: dbPath+dbName
  //   },
  // });

  // knex.destroy();


  const activeWindow = BrowserWindow.getFocusedWindow();

  var fileOptions = {
    title: "Import Data",
    buttonLabel : "Select",
    multiSelctions:false,
    filters :[
        {name: 'Sqlite Database', extensions: ['db']}
    ]
  };

  await dialog.showMessageBox(activeWindow, {title: 'warning', message: 'Import a data erase your existing data, are you sure to proceed..?', buttons: ["Yes","No"]} )
  .then(({response})=>{
    if(response==0){

      dialog.showOpenDialog(activeWindow, fileOptions).then(({filePaths})=>{
        // console.log('response :>> ', selectedFile);
        if(filePaths.length!=0){
          // console.log('import');
          fs.renameSync(dbPath+dbName, dbPath+'backup.db', err=>{
            console.log('err :>> ', err);
          })

        }
        console.log('filePaths :>> ', filePaths);
      })
    }
  })
  .catch(err=>{
    console.log('err :>> ', err);
  })

}
