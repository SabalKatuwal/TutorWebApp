const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')
const {check, validationResult} = require('express-validator')

const authController = require('../controllers/auth'); //to go one directory back and go to controller/auth.js
const { render } = require('express/lib/response');
const upload = require('../server')


//intermediate routes for login and register
router.get('/intermediate_register', (req, res)=>{
    if(!req.session.userinfo){
        return res.render('intermediate_register.ejs');
    }
    res.redirect('/')
});
router.get('/intermediate_login', (req, res)=>{
    if(!req.session.userinfo){
        return res.render('intermediate_login.ejs');
    }
    res.redirect('/')
});


router.get('/student_login', (req, res)=>{
    if(!req.session.userinfo){
        return res.render('student_login.ejs');
    }
    res.redirect('/')
    
});
router.get('/tutor_login', (req, res)=>{
    if(!req.session.userinfo){
        return res.render('tutor_login.ejs');
    }
    res.redirect('/')
});

// router.get('/guide_register', (req, res)=>{
//     res.render('guide_register.ejs');
// });

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

router.post('/student_login',authController.login_student)


//for tutor
router.get('/tutor_register', (req, res)=>{
    if(!req.session.userinfo){
        return res.render('tutor_register.ejs');
    }
    res.redirect('/')
});

router.post('/tutor_register', //upload.single("tutorPicture"),
// [
//     check('citizenshipNumber', 'Invalid citizenship number')
//         .exists()
//         .isLength(14),
    // check("passwordConfirm")     
    //     .custom((value,{req}) =>{
    //         if(value !== req.body.password){
    //             throw new Error('Password confirmation does not match with password')
    //         }
    //         return true;
    //     }
    //     ).withMessage("Email already taken"),
    
// ],
authController.tutor_register) 

router.post('/tutor_login',authController.tutor_login)




module.exports = router; 