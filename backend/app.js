const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const app = express()
const userServicesRouter = require('./routers/userServices')


dotenv.config()
//connect db
mongoose.connect(process.env.DB_CONNECT, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}, () => console.log('Veritabanına bağlantı sağlandı.'))

//middleware
app.use(bodyParser.json())
app.use('/api/userservices/', userServicesRouter)

app.listen(process.env.PORT_NAME,process.env.HOST_NAME, () => console.log(`Server Çalışıyor, http://${process.env.HOST_NAME}:${process.env.PORT_NAME}/`))