const path = require('path');
const url = require('url');
const customTitlebar = require('custom-electron-titlebar');
const { ipcRenderer } = require('electron')

process.once('loaded', () => {
  window.addEventListener('DOMContentLoaded', () => {
    // let MyTitleBar = new customTitlebar.Titlebar({
    //   backgroundColor: customTitlebar.Color.fromHex('#2f3241'),
    //   icon: url.format(path.join(__dirname, 'src/assets/img', '/logo.png')),
    // });

    const replaceText = (selector, text) => {
      const element = document.getElementById(selector)
      if (element) element.innerText = text
    }

    for (const type of ['chrome', 'node', 'electron']) {
      replaceText(`${type}-version`, process.versions[type])
    }

    document.getElementById('toggle-dark-mode').addEventListener('click', async () => {
      const isDarkMode = await ipcRenderer.invoke('dark-mode:toggle')
      document.getElementById('theme-source').innerHTML = isDarkMode ? 'Dark' : 'Light'
      console.log('clicked', isDarkMode);
    })

    document.getElementById('reset-to-system').addEventListener('click', async () => {
      await ipcRenderer.invoke('dark-mode:system')
      document.getElementById('theme-source').innerHTML = 'System'
    })

    window.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      ipcRenderer.send('show-context-menu')
    })

    ipcRenderer.on('context-menu-command', (e, command) => {
      // ...
    })
  });
});
