#!/usr/bin/env node

const express = require("express")
const bodyParser = require("body-parser")
const { exec } = require("child_process")

const app = express()
const port = process.env.PORT || 3000
const secret = process.env.SECRET || "your-secret"

app.use(bodyParser.json())

app.post("/deploy", (req, res) => {
  const { secret: requestSecret } = req.body

  if (requestSecret !== secret) {
    return res.status(403).send("Forbidden")
  }

  exec(
    "docker compose pull && docker compose up -d",
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`)
        return res.status(500).send("Server error")
      }

      console.log(`stdout: ${stdout}`)
      console.error(`stderr: ${stderr}`)
      res.send("Containers pulled and restarted")
    }
  )
})

app.listen(port, () => {
  console.log(`Service listening at http://localhost:${port}`)
})
