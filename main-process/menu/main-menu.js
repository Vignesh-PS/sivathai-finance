const {
  app,
  Menu,
  BrowserWindow,
  ipcMain,
  nativeTheme,
  Tray,
  dialog,
} = require("electron");
const homedir = require("os").homedir();
const dbPath = homedir + "/sivathai-collections/";
const dbName = "sivathai.db";
const fs = require("fs");

const isMac = process.platform === "darwin";
let knex = require("knex");

let server = require(__dirname + "./../../server.js");

const template = [
  // { role: 'appMenu' }
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            { role: "about" },
            { type: "separator" },
            { role: "services" },
            { type: "separator" },
            { role: "hide" },
            { role: "hideothers" },
            { role: "unhide" },
            { type: "separator" },
            { role: "quit" },
          ],
        },
      ]
    : []),
  // { role: 'fileMenu' }
  {
    label: "Menus",
    submenu: [
      {
        label: "All Streets",
        click(item, focusedWindow, event) {
          focusedWindow.webContents.send("switch-ng-page", "all-streets");
        },
      },
      {
        label: "All Families",
        click(item, focusedWindow, event) {
          focusedWindow.webContents.send("switch-ng-page", "all-families");
        },
      },
      {
        label: "All Collections",
        click(item, focusedWindow, event) {
          focusedWindow.webContents.send("switch-ng-page", "all-collections");
        },
      },
      {
        label: "Exit",
        // role: "quit",
        click(){
          exitApplication();
        }
      },
    ],
  },
  {
    label: "Action",
    submenu: [
      {
        label: "Export Data",
        click(item, focusedWindow) {
          // focusedWindow.webContents.send('switch-ng-page', 'no-service');
          exportDatabase();
        },
      },
      {
        label: "Import Data",
        click(item, focusedWindow) {
          focusedWindow.webContents.send("switch-ng-page", "import-database");
          // importDatabase();
        },
      },
    ],
  },
  {
    label: "Reports",
    submenu: [
      {
        label: "Families",
        click(item, focusedWindow) {
          focusedWindow.webContents.send("switch-ng-page", "no-service");
        },
      },
      {
        label: "People",
        click(item, focusedWindow) {
          focusedWindow.webContents.send("switch-ng-page", "no-service");
        },
      },
      {
        label: "Collections",
        click(item, focusedWindow) {
          focusedWindow.webContents.send("switch-ng-page", "no-service");
        },
      },
    ],
  },
  {
    role: "help",
    submenu: [
      {
        label: "Contact Developer - Selvavignesh Perumal",
        click: async () => {
          const { shell } = require("electron");
          await shell.openExternal(
            "https://www.facebook.com/selva.vignesh.1029"
          );
        },
      },
      {
        label: "Other Support - Balagunasingh",
        click: async () => {
          const { shell } = require("electron");
          await shell.openExternal("https://www.facebook.com/balagunasingh");
        },
      },
      {
        label: "Toggle Developer Tools",
        accelerator: process.platform === "darwin" ? "Alt+A" : "Alt+A",
        click(item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.toggleDevTools();
        },
      },
    ],
  },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

//Connection from renderer process
ipcMain.on("ipc-renderer", (event, arg) => {
  console.log("event :>> ", arg);
  switch (arg) {
    case "db-connection-destroyed":
      importDatabase();
      break;
  }
});

async function exportDatabase() {
  const activeWindow = BrowserWindow.getFocusedWindow();
  await dialog.showMessageBox(activeWindow, {
    title: "warning",
    message: "The exported data may contains sensitive information.",
  });
  var options = {
    title: "Export Data",
    defaultPath: "Sivathaiya Puram - " + new Date().toDateString(),
    buttonLabel: "Save",

    filters: [
      { name: "Sqlite Database", extensions: ["db"] },
      { name: "All Files", extensions: ["*"] },
    ],
  };
  dialog.showSaveDialog(activeWindow, options).then(({ filePath }) => {
    fs.copyFile(dbPath + dbName, filePath, (err) => {
      if (err) {
        activeWindow.webContents.send("switch-ng-page", {
          type: "message",
          message: "Cannot be saved",
        });
        return;
      }
      activeWindow.webContents.send("switch-ng-page", {
        type: "message",
        message: "Successfully exported",
      });
    });
  });
}

async function importDatabase() {
  // server = null;
  const activeWindow = BrowserWindow.getFocusedWindow();

  var fileOptions = {
    title: "Import Data",
    buttonLabel: "Select",
    multiSelctions: false,
    filters: [{ name: "Sqlite Database", extensions: ["db"] }],
  };

  await dialog
    .showMessageBox(activeWindow, {
      title: "warning",
      message:
        "Import a data erase your existing data, are you sure to proceed..?",
      buttons: ["Yes", "No"],
    })
    .then(async({ response }) => {
      if (response == 0) {
        dialog
          .showOpenDialog(activeWindow, fileOptions)
          .then( async ({ filePaths }) => {
            if (filePaths.length != 0) {
              // console.log('import');

              if (!fs.existsSync(dbPath+'backup')){
                console.log('make');
               fs.mkdirSync(dbPath+'backup');
              }

              fs.renameSync(dbPath + dbName, `${dbPath}backup/backup-${new Date().toDateString()+' - '+Date.now()}.db`, (err) => {
                console.log("err :>> ", err);
              });

              fs.copyFile(filePaths[0], dbPath+dbName, (err)=>{
                if (err) {
                  console.log('err :>> ', err);
                  process.exit();
                return;
                };
              });

              await dialog.showMessageBox(activeWindow, {
                title: 'Warning',
                message: 'Database Successfully imported. restart the application to apply changes. click ok to close the application.',
                buttons: ["Ok"]
              })
              .then(success=>{
                process.exit();
              })

            }
            console.log("filePaths :>> ", filePaths);
          })
          .catch(err=>{
            process.exit();
          })
      }else{
        await dialog.showMessageBox(activeWindow, {
          title: 'Success',
          message: 'Database can not be imported, application needs to restart.',
          buttons: ["Ok"]
        })
        .then(success=>{
          process.exit();
        })
      }
    })
    .catch((err) => {
      console.log("err :>> ", err);
      process.exit();
    });
}

function exitApplication(){
  const activeWindow = BrowserWindow.getFocusedWindow();

  dialog.showMessageBox(activeWindow, {
    title: 'Confirmation',
    message: 'Are you sure to exit from the application..?',
    buttons: ['Yes', 'No']
  })
  .then(({response})=>{
    if(response==0){
      process.exit();
    }
  })
}
