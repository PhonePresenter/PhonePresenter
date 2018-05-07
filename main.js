const {Menu} = require('electron')
const {ipcMain} = require('electron')
var menubar = require('menubar')
var os = require('os')
var ip = require('ip')
var mb = menubar({
  preloadWindow: true,
  height: 500,
  width: 330,
  icon: __dirname + '/resources/icons/icon_22x22.png'
})

const shouldQuit = mb.app.makeSingleInstance((commandLine, workingDirectory) => {
  if (mb.window) {
    mb.showWindow()
  }
})

if (shouldQuit) {
  mb.app.quit()
}

mb.app.commandLine.appendSwitch('disable-renderer-backgrounding')

mb.on('ready', function ready () {

  const contextMenu = Menu.buildFromTemplate([
    {label: 'Open', click () {
      mb.showWindow()
    }},
    {label: 'Quit', click () {
      mb.app.quit()
    }}
  ])
  mb.tray.setContextMenu(contextMenu)
  // mb.window.webContents.openDevTools()
  mb.window.setResizable(false)
})

mb.on('show', function () {
  mb.window.setResizable(false)
  mb.window.webContents.executeJavaScript('updateInterfaces()')
})

ipcMain.on('show-window', function (event, arg) {
  mb.showWindow()
})

ipcMain.on('hide-window', function (event, arg) {
  mb.hideWindow()
})
