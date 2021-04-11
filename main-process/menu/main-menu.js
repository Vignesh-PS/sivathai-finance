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
    label: 'Sales',
    submenu: [
      { 
        label: 'New Sale',
        click(item, focusedWindow,event) {
          // let brw=focusedWindow;
          // brw.loadURL('http://localhost:4200/detail');
          // console.log('click','|',brw);
          focusedWindow.webContents.send('switch-ng-page', 'new-sale');
        } 
      },
      { 
        label: 'Sale Return',
        click(item, focusedWindow, event) {
          focusedWindow.webContents.send('switch-ng-page', 'sale-return');
          //event.sender.send('asynchronous-reply', 'async pong');
        } 
      }
    ]
  },
  {
    label: 'Purchase',
    submenu: [
      { 
        label: 'New Purchase',
        click(item, focusedWindow) {
          alert('Purchase');
        } 
      },
      { 
        label: 'Purchase Return',
        click(item, focusedWindow) {
          alert('Purchase Return');
        } 
      }
    ]
  },
  {
    label: 'Data',
    submenu: [
      { 
        label: 'Category',
        click(item, focusedWindow) {
          alert('Purchase');
        } 
      },
      { 
        label: 'Product',
        click(item, focusedWindow) {
          focusedWindow.webContents.send('switch-ng-page', 'product');
        } 
      },
      { 
        label: 'Staff',
        click(item, focusedWindow) {
          focusedWindow.webContents.send('switch-ng-page', 'staff');
        } 
      }
    ]
  },
  {
    label: 'Quick Action',
    submenu: [
      { 
        label: 'Sales Re-Print Invoice',
        click(item, focusedWindow) {
          alert('Purchase');
        } 
      },
      { 
        label: 'Purchase Re-Print Invoice',
        click(item, focusedWindow) {
          alert('Purchase Return');
        } 
      },
      { 
        label: 'Purchase Check Invoice',
        click(item, focusedWindow) {
          alert('Purchase Return');
        } 
      },
      { 
        label: 'Sales Check Invoice',
        click(item, focusedWindow) {
          alert('Purchase Return');
        } 
      }
    ]
  },
  {
    label: 'Stock',
    submenu: [
      { 
        label: 'Manage Stock',
        click(item, focusedWindow) {
          alert('Purchase');
        } 
      }
    ]
  },
  {
    label: 'Reports',
    submenu: [
      { 
        label: 'Sales',
        click(item, focusedWindow) {
          alert('Purchase');
        } 
      },
      { 
        label: 'Purchase',
        click(item, focusedWindow) {
          alert('Purchase Return');
        } 
      },
      { 
        label: 'Stocks',
        click(item, focusedWindow) {
          alert('Purchase Return');
        } 
      }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'About',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://electronjs.org')
        }
      }
      ,{
        label: 'Learn More',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://electronjs.org')
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