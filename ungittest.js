// this script shows that ungit is gracefully stopped
// however, similar code in main.js leaves ungit running

const { spawn, exec } = require('child_process')

const cmd = './node_modules/ungit/bin/ungit'

let ungitProcess = spawn(cmd, ['--no-launchBrowser', '--port', 8001])

hookProcess(ungitProcess, 'ungit')

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
