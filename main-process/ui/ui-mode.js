const { app, Menu, BrowserWindow, ipcMain, nativeTheme, Tray } = require('electron')

ipcMain.handle('dark-mode:toggle', () => {
      if (nativeTheme.shouldUseDarkColors) {
        nativeTheme.themeSource = 'light'
      } else {
        nativeTheme.themeSource = 'dark'
      }
      return nativeTheme.shouldUseDarkColors
})
  
ipcMain.handle('dark-mode:system', () => {
      nativeTheme.themeSource = 'system'
})