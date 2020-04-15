import Nuxt from "nuxt"
import logger from "morgan"
import fs from 'fs'
import Express from "express"
import gitBackend from "git-http-backend"
import cloudcmd from "cloudcmd"
import io from 'socket.io'
const spawn = require("child_process").spawn

const app = new Express()

app.use(logger("dev"))
const server = require("http").createServer(app)
const host = process.env.HOST || "127.0.0.1"
const port = process.env.PORT || "8000"

app.set("port", port)

app.get("/publicId", (req, res) => {
  const sessionId = req.headers["x-sandstorm-session-id"]
  let allData = ""
  // TODO: figure out why Cap'n Proto keeps crashing when
  // getPublicId exits so we can get rid of this weird
  // memoization hack I had to do!
  const file = `/var/publicid-${sessionId}`

  const handleResult = () => {
    const lines = allData.split("\n")
    const publicId = lines[0]
    const hostname = lines[1]
    const domain = publicId+"."+hostname
    const url = lines[2]
    const isDemo = lines[3] == "true"
    res.json({publicId, hostname, domain, url, isDemo})
  }

  try {
    allData = fs.readFileSync(file, 'utf8').toString()
  } catch (e) {
    // nothing
  }

  const lines = allData.split("\n")
  if (lines.length >= 4) {
    handleResult()
  } else {
    const gpId = spawn('getPublicId', [sessionId])
    allData = ""

    gpId.stdout.on('data', (data) => {
      fs.appendFileSync(file, data)
      allData += data
    })

    gpId.on('error', (err) => {
      return res.send(err)
    })

    gpId.on('close', (code) => {
      if (code !== 0) {
        return res.send(code)
      }

      handleResult()
    })
  }
})

app.use("/git", (req, res) => {
  req.pipe(gitBackend(req.url, (err, service) => {
    if(err)
      return res.end(err+"\n")
    res.setHeader("content-type", service.type)
    console.log("cmd", service.cmd)
    const ps = spawn(service.cmd, service.args.concat("/var/git"))
    ps.stdout.pipe(service.createStream()).pipe(ps.stdin)
  })).pipe(res)
})

const runCommand = (cmd, ...args) => {
  return new Promise((resolve, reject) => {
    const spawnCmd = spawn(cmd, args)

    spawnCmd.stdout.on('data', (data) => {
      console.log(data.toString())
    })

    spawnCmd.on('error', (err) => {
      res.send(err)

      reject(err)
    })

    spawnCmd.on('close', (code) => {
      if (code === 0) {
        resolve(true)
        return true
      } else {
        reject(new Error(code))
      }
    })
  })
}

app.get('/dirty', async (req, res) => {
  const currentDir = process.cwd()

  process.chdir('/var/git')

  const spawnCmd = spawn('git', ['diff', '--exit-code'])

  spawnCmd.on('close', (code) => {
    res.json({ dirty: code !== 0 })
  })

  process.chdir(currentDir)
})

app.use('/commit', async (req, res) => {
  const currentDir = process.cwd()

  try {
    process.chdir('/var/git')
    await runCommand('git', 'add', '.')
    await runCommand('git', 'commit', '-m', 'From admin')
    process.chdir(currentDir)
    await runCommand('/opt/app/post-receive')

    res.json({ok: true})
  } catch (e) {
    res.send({error: e.msg})
  } finally {
    process.chdir(currentDir)
  }
})

app.use('/reset-local', async (req, res) => {
  const currentDir = process.cwd()

  try {
    process.chdir('/var/git')
    await runCommand('git', 'reset', '--hard')
    process.chdir(currentDir)

    res.json({ok: true})
  } catch (e) {
    res.send({error: e.msg})
  } finally {
    process.chdir(currentDir)
  }
})

const { createConfigManager, configPath } = cloudcmd

const socket = io.listen(server, { path: "/admin/socket.io"})

const cloudConfig = {
  name: "Hugo admin",
  root: "/var/git",
  open: false,
  prefix: "/admin",
  console: false,
  terminal: false,
  oneFilePanel: true,
  configDialog: false,
  configAuth: false,
  keysPanel: true,
}

const filePicker = {
  data: { FilePicker: { key: 'key' } }
}

const cloudModules = { filePicker }

const configManager = createConfigManager({ configPath })

app.use("/admin", cloudcmd({
  socket,
  config: cloudConfig
}))

// Import and Set Nuxt.js options
let config = require("./nuxt.config.js")
config.dev = !(process.env.NODE_ENV === "production")

// Init Nuxt.js
const nuxt = new Nuxt(config)
app.use(nuxt.render)

// Build only in dev mode
if (config.dev) {
  nuxt.build()
  .catch((error) => {
    console.error(error) // eslint-disable-line no-console
    process.exit(1)
  })
}

server.listen(port, host, () => console.log(`Server listening on ${host}:${port}`))
