const {app, BrowserWindow} = require('electron')
const { spawn, exec } = require('child_process');

let windows = {}

// XSCALE App configuration
const wikiDir = '~/dev/Zefram-Cochrane'
const wikiPort = 8000
let wikiProcess = {}
const repoUngitUrl = url = 'repository?path=%2FUsers%2Fmarijn%2Fdev%2FZefram-Cochrane'
const ungitPort = 8001
const fullRepoUrl = `http://localhost:${ungitPort}/#/${repoUngitUrl}`
let ungitProcess = {}

function init () {
  initWiki()
  initUngit()
  createWindow('collaborate.html')
  createWindow('wiki.html')
}

function initWiki() {
  const cmd = `tiddlywiki ${wikiDir} --server ${wikiPort}`

  wikiProcess = exec(cmd)
  hookProcess(wikiProcess, 'wiki')
}

function initUngit() {
  const cmd = `./node_modules/ungit/bin/ungit --no-launchBrowser --port ${ungitPort}`
  console.log(`To browse ungit, go to ${fullRepoUrl}`)
  ungitProcess = exec(cmd)
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
