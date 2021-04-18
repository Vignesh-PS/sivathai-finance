const { app, Menu, BrowserWindow, ipcMain, nativeTheme, Tray } = require('electron')

ipcMain.on('show-context-menu', (event) => {
    const template = [
      {
        label: 'Menu Item 1',
        click: () => { event.sender.send('context-menu-command', 'menu-item-1') }
      },
      { type: 'separator' },
      { label: 'Menu Item 2', type: 'checkbox', checked: true }
    ]
    const menu = Menu.buildFromTemplate(template)
    menu.popup(BrowserWindow.fromWebContents(event.sender))
})

let testVariable = 100;
