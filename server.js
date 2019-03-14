const express = require('express')
const app = express()
const port = process.env.PORT || 8080

app.use('/static', express.static('static'))

app.get('/', (req, res) =>
  res.sendFile('./views/index.html', { root: __dirname })
)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
