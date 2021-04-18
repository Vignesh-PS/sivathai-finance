const { app, Menu, BrowserWindow, ipcMain, nativeTheme, Tray, nativeImage  } = require('electron')
const path = require('path')
const glob = require('glob')
const url = require('url');

let tray = null

app.whenReady().then(()=>{
    let imgPath=path.join(__dirname, '../../src/assets/img/icon.png')
    tray = new Tray(nativeImage.createFromPath(imgPath))
    const contextMenu = Menu.buildFromTemplate([
      { label: 'Item1', type: 'radio' },
      { label: 'Item2', type: 'radio' },
      { label: 'Item3', type: 'radio', checked: true },
      { label: 'Item4', type: 'radio' }
    ])
    tray.setToolTip('This is my application.')
    tray.setContextMenu(contextMenu)
})
