// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const { spawn, exec } = require('child_process');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// XSCALE app initialization

// set the local wiki directory
const wikiDir = '~/dev/Zefram-Cochrane'
const wikiPort = 8000
let wikiProcess = {}
// start ungit in this directory
const ungitPort = 8001
let ungitProces = {}

function init () {
  initWiki()
  initUngit()
  createWindow()
}

function initWiki() {
  const cmd = `tiddlywiki ${wikiDir} --server ${wikiPort}`

  wikiProcess = exec(cmd)

  wikiProcess.stdout.on('data', (data) => {
    console.log(` wiki:  ${data}`)
  })

  wikiProcess.stderr.on('data', (data) => {
    console.log(` wiki stderr: ${data}`)
  })

  wikiProcess.on('close', (code) => {
    console.log(`child process exited with code ${code}`)
  })
}

function initUngit() {
  const ungitOptions = {
    cwd: wikiDir
  }
  const cmd = `./node_modules/ungit/bin/ungit --port ${ungitPort}`
  exec(cmd)
}

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('wiki.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', init)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})
