const {Router} = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const {validationResult} = require('express-validator/check')
const {registerValidators} = require('../utils/validators')
const router = Router()


router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Авторизация',
        isLogin: true,
        loginError: req.flash('loginError'),
        registerError: req.flash('registerError')
    })

})
router.get('/logout', async (req, res) => {
    req.session.destroy(()=>{
    res.redirect('/auth/login#login')

    })

})

router.post('/login', async (req, res) =>{
    try{
        const {email, password} = req.body
        const condidate = await User.findOne({email})
        
        if(condidate){
            const areSame = await bcrypt.compare(password, condidate.password)

        if(areSame){
        req.session.user = condidate
        req.session.isAuthenticated = true
        req.session.save(err => {
        if (err){
            throw err
        }
        res.redirect('/')
        })
        }else{
            req.flash('loginError' , 'Неверный пароль')
            res.redirect('/auth/login#login')

        }
        } else{
            req.flash('loginError' , 'Такого ползователя не сушествует')
         res.redirect('/auth/login#login')
        }

    }catch(e){
        console.log(e);

    }
   
})

router.post('/register', registerValidators, async (req, res) => {
    try{
       const {email, password, name} = req.body

       const errors = validationResult(req)
       if(! errors.isEmpty()) {
           req.flash('registerError', errors.array()[0].msg)
           return res.status(422).redirect('/auth/login#register')
       }

      
        const hashPassword = await bcrypt.hash(password,10)
        const user = new User ({
            email, name, password: hashPassword, cart:{items:[]}
        })
            await user.save()
            res.redirect('/auth/login#login')
       }
      
    catch (e){
        console.log(e);

    }
} )



module.exports = router