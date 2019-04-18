const { app, BrowserWindow } = require('electron')
const { spawn, exec } = require('child_process')
const settings = require('electron-settings')
const fs = require('fs')

let windows = {}

// XSCALE App configuration
let config = {}
let wikiProcess = {}
let repoUngitUrl = ''
let fullRepoUrl = ''
let ungitProcess = {}

function init () {
  initSettings()
  initWiki()
  initUngit()
  createWindow('collaborate.html')
  createWindow('wiki.html')
}

function initSettings() {
  if(!fs.existsSync(settings.file())){
    console.log("no settings file found, initializing with default values")
    settings.setAll({
      wikiDir: '/Users/marijn/xscale-wiki',
      wikiPort: 8000,
      ungitPort: 8001
    })
  }
  console.log(`loading settings from ${settings.file()}`)
  config = settings.getAll()
  repoUngitUrl = 'repository?path=%2FUsers%2Fmarijn%2Fdev%2FZefram-Cochrane'
  fullRepoUrl = `http://localhost:${config.ungitPort}/#/${repoUngitUrl}`
}

function initWiki() {
  wikiProcess = spawn('tiddlywiki', [config.wikiDir, '--server', config.wikiPort])
  hookProcess(wikiProcess, 'wiki')
}

function initUngit() {
  const cmd = './node_modules/ungit/bin/ungit'
  console.log(`To browse ungit, go to ${fullRepoUrl}`)
  ungitProcess = spawn(cmd, ['--no-launchBrowser', '--port', config.ungitPort])
  hookProcess(ungitProcess, 'ungit')
}

function hookProcess(theProcess, label) {

  theProcess.stdout.on('data', (data) => {
    console.log(` ${label}:  ${data}`)
  })

  theProcess.stderr.on('data', (data) => {
    console.log(` ${label} stderr: ${data}`)
  })

  theProcess.on('close', (code) => {
    console.log(`child process "${label}" exited with code ${code}`)
  })  
}

function createWindow (page) {
  // Create the browser window.
  w = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  w.loadFile(page)

  // Open the DevTools.
  // w.webContents.openDevTools()

  windows[page] = w

  // Emitted when the window is closed.
  w.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    windows[page] = null
  })
}

app.on('ready', init)

app.on('window-all-closed', function () {
  app.quit()
})

app.on('activate', function () {
})

app.on('will-quit', function(){
  wikiProcess.kill('SIGTERM');
  ungitProcess.kill('SIGTERM');
})
