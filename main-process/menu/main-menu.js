const { app, Menu, BrowserWindow, ipcMain, nativeTheme, Tray, dialog } = require('electron')

const isMac = process.platform === 'darwin'

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
      }
    ]
  },
  {
    label: 'Quick Action',
    submenu: [
      {
        label: 'Pendings',
        click(item, focusedWindow) {
          focusedWindow.webContents.send('switch-ng-page', 'no-service');
        }
      },
      {
        label: 'All People',
        click(item, focusedWindow) {
          focusedWindow.webContents.send('switch-ng-page', 'no-service');
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
      // {
      //   label: 'Toggle Developer Tools',
      //   accelerator: process.platform === 'darwin' ? 'Alt+A' : 'Alt+A',
      //   click(item, focusedWindow) {
      //     if (focusedWindow) focusedWindow.webContents.toggleDevTools()
      //   }
      // },
    ]
  }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

ipcMain.on('open-error-dialog', (event) => {
  dialog.showErrorBox('An Error Message', 'Demonstrating an error message.')
})
