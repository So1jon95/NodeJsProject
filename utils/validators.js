const {body} = require('express-validator/check')
const User = require('../models/user')

exports.registerValidators = [
    body('email')
    .isEmail().withMessage('Введите коррекный email')
    .custom( async (value, {req}) =>{
        try{ 
            const user = await User.findOne({email: value})
            if(user){
                return Promise.reject("Такой email уже занят")
            }
        }catch(e){
            console.log(e);
        }

    })
    .normalizeEmail(),
    body('password' ,'Пароль должен быть минимум 4 символов')
    .isLength({min:4, max:56})
    .isAlphanumeric()
    .trim(),
    body('confirm').custom((value, {req})=>{
        if(value !== req.body.password){
            throw new Error('Пароли должны совподать')

        }
        return true
    })
    .trim(),
    body('name').isLength({min:2}).withMessage('Имя должно быть минимум 2 символа').trim()
]



exports.courseValidators =[
    body('title').isLength({min:3}).withMessage('Минимальная длина названия 3 символа').trim(),
    body('price').isNumeric().withMessage('Введите корректню цену'),
    body('img', 'Введите корректный URL картинки').isURL()
]