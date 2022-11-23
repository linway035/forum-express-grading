const path = require('path') // node.js 的原生模組，不用特別去install
const express = require('express')
const handlebars = require('express-handlebars')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('./config/passport')
const handlebarsHelpers = require('./helpers/handlebars-helpers') // 引入自定義的 handlebars-helpers
const { getUser } = require('./helpers/auth-helpers') // 引入自定義的 auth-helpers
const routes = require('./routes')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
// console.log(process.env.IMGUR_CLIENT_ID); 檢查是否有讀到

const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = 'secret'

// 註冊 Handlebars 樣板引擎，並指定副檔名為 .hbs，及使用helpers
app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelpers }))
// 設定使用 Handlebars 做為樣板引擎
app.set('view engine', 'hbs')
// 使用body-parser，表示所有的請求都會先被 body-parser進行處理
app.use(express.urlencoded({ extended: true }))
// 設定寫法為_method，form那邊根據這的寫法
app.use(methodOverride('_method'))
/// upload這路徑下，當前這檔案(app.js)的資料夾的絕對路徑 C:\Users\Wa\ACe\forum-express-grading，join upload
app.use('/upload', express.static(path.join(__dirname, 'upload')))

// session後接passport & flash
app.use(
  session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false })
)

app.use(passport.initialize()) // 初始化 Passport
app.use(passport.session()) // 啟動 session 功能

app.use(flash()) // 掛載套件
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages') // 設定 success_msg 訊息
  res.locals.error_messages = req.flash('error_messages') // 設定 warning_msg 訊息
  res.locals.user = getUser(req) // 加入user變數供view用
  next()
})

// 每個路由發送進來的請求，都會先經過 app.use() 的處理
app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
