const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const cors = require('cors')

app.use(cors())
app.use(bodyParser.json())

app.use('/products',  require('./routes/Products'))
app.use('/inventory', require('./routes/Inventory'))
app.use('/auth',      require('./routes/Auth'))

module.exports = app