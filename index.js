const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const compression = require('compression')
const exphbs = require('express-handlebars')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const flash = require('connect-flash')

const homeRouter =  require('./routes/home')
const cadRouter = require('./routes/card')
const addRouter = require('./routes/add')
const ordersRouter = require('./routes/orders')
const coursesRouter = require('./routes/courses')
const profileRouter = require('./routes/profile')
const authRouter = require('./routes/auth')
const varMiddleware = require('./middleware/variables')
const auth = require('./middleware/auth')
const userMiddleware = require('./middleware/user')
const errorHendler = require('./middleware/error')
const keys = require('./keys')

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    runtimeOptions:{
        allowProtoMethodsByDefault:true,
        allowProtoPropertiesByDefault:true
    }
})
const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGODB_URI

})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')


app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))

app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}))

app.use(flash())
app.use(compression())



app.use(varMiddleware)
app.use(userMiddleware)

app.use('/', homeRouter)
app.use('/add', auth, addRouter)
app.use('/courses', coursesRouter)
app.use('/card', auth, cadRouter)
app.use('/orders', auth, ordersRouter)
app.use('/auth', authRouter)
app.use('/profile', auth, profileRouter)

app.use(errorHendler)

const PORT = process.env.PORT || 3000;


async function start (){
    try{
        await mongoose.connect(keys.MONGODB_URI, {
            useNewUrlParser: true,

        })
        app.listen(PORT, () => {
            console.log(`Server is running on  ${PORT} port`);
        })
    }catch (err){
        console.log(err);

    }
  
}
start()



