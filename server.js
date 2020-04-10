import Nuxt from "nuxt"
import logger from "morgan"
import fs from 'fs'
import Express from "express"
import gitBackend from "git-http-backend"
// TODO: once Caddy 2 or something similar is in place, reinstate the
// admin proxy.
//import httpProxy from "http-proxy"
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

//const proxy = httpProxy.createProxyServer({
// target: "http://127.0.0.1:8001/admin/",
// changeOrigin: true
//})

// app.use("/admin/", (req, res) => proxy.web(req, res))

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
