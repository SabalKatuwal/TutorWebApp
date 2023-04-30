const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')
const {check, validationResult} = require('express-validator')

const authController = require('../controllers/auth'); //to go one directory back and go to controller/auth.js
const { render } = require('express/lib/response');




router.get('/login', (req, res)=>{
    if(!req.session.userinfo){
        return res.render('login.ejs');
    }
    res.redirect('/')
    
});
router.get('/guide_login', (req, res)=>{
    res.render('guide_login.ejs');
});

router.get('/guide_register', (req, res)=>{
    res.render('guide_register.ejs');
});

router.get('/student_register', (req, res)=>{
    if(!req.session.userinfo){
        return res.render('student_register');
    }
    res.redirect('/')
});


router.get('/logout', authController.logout)


router.get('/profile',authController.profile)

/*
    POST Method here
*/

router.post('/student_register',[
    check('username', 'This username must me 3+ characters long')
        .exists()
        .isLength({ min: 3 }),
    check('email', 'Email is not valid')
        .isEmail()
        .normalizeEmail()
],authController.student_register)   

router.post('/login',authController.login)


//for guide

router.post('/guide_register',[
    check('citizenshipNumber', 'Invalid citizenship number')
        .exists()
        .isLength(14),
    // check("passwordConfirm")     
    //     .custom((value,{req}) =>{
    //         if(value !== req.body.password){
    //             throw new Error('Password confirmation does not match with password')
    //         }
    //         return true;
    //     }
    //     ).withMessage("Email already taken"),
    
],authController.guide_register) 

router.post('/guide_login',authController.guide_login)




module.exports = router; 