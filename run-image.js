import { spawn } from 'child_process'
import chalk from 'chalk'
import open from 'open'

import detectDocker from './detect-docker.js'
import build from './build.js'

let y = chalk.yellow

export default async function runImage (script) {
  let name = await build()
  let args = [
    'run',
    '-v', './dist/:/var/www/',
    '--privileged',
    '--rm',
    '-p', '8000:80',
    '-e', 'PORT=80',
    '-it', name
  ]
  if (script) args.push(script)
  spawn(await detectDocker(), args, { stdio: 'inherit' })
  if (!script) {
    let ctrlC = 'Ctrl+C'
    if (process.platform === 'darwin') ctrlC = 'Cmd + .'
    process.stdout.write(
      `  Website is available to test at ${ y('http://localhost:8000/') }\n` +
      `  Press ${ y(ctrlC) } to stop the server\n`
    )
    open('http://localhost:8000/')
  }
}
