const express = require('express');
const mysql = require('mysql');
//const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 
const { name } = require('ejs');

const {check, validationResult} = require('express-validator');
const req = require('express/lib/request');
const { render } = require('express/lib/response');

const hashit= (passsword)=>bcrypt.hash(passsword,8);


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DATABASE,
    database: 'TutorWebApp'
});

// exports.tourist_register = (req,res)=> {
//     console.log(req.body);

//     const {username, firstname, lastname, email, password, passwordConfirm } = req.body;

//     //one person with one email can register one time & if passsword and passwordConfirm matches
//     db.query('SELECT email FROM user WHERE email = ?',[email], async (error, results)=>{
//         if(error){
//             console.log(error);
//         }
        
//         if (results.length > 0 ){
//             return res.render('tourist_register',{
//                 message:'Email already used'
//             });
//         } 
//         else if(password !== passwordConfirm) {
//             return res.render('tourist_register',{
//                 message:'Password do not match'
//             });
//         };

//         let hashedPassword = await bcrypt.hash(password, 8); //8 round to incript pw
        

//         db.query('INSERT INTO user SET ?',{username: username,firstname: firstname, lastname: lastname, email: email, passwords: hashedPassword }, (error, results)=>{
//             if(error){
//                 console.log(error);
//             }
//             else{
//                 return res.render('index',{
//                     message: 'User Registered'
//                 });
//             }
//         })

//     });

//     // res.redirect('/');
// }



// exports.student_register = (req,res)=> {
//     console.log(req.body);

//     const {username, firstname, lastname, email, password, passwordConfirm } = req.body;
//     var message = [];
//     const errors = validationResult(req)
//     //one person with one email can register one time & if passsword and passwordConfirm matches
//     db.query('SELECT email FROM student WHERE email = ?',[email], async (error, results)=>{
//         if(error){
//             console.log(error);
//         }
        
//         if (results.length > 0 ){
//             message.push('Email already used')
//             return res.render('student_register',{message});
//         } 
//         else if(password !== passwordConfirm) {
//             message.push('password donot match')
//             console.log("thisIs" + message)
//             return res.render('student_register',{message});
//         }

        
//         // if(!errors.isEmpty()) {
//         //     // return res.status(422).jsonp(errors.array())
//         //     const alert = errors.array()
//         //     res.render('student_register', {alert})
//         // }
//         else{
//             let hashedPassword = await hashit(password);//bcrypt.hash(password, 8); //8 round to incript pw

//             db.query('INSERT INTO student SET ?',{username: username,firstname: firstname, lastname: lastname, email: email, passwords: hashedPassword }, (error, results)=>{
//                 if(error){
//                     console.log(error);
//                 }
//                 else{
//                     message.push('User Registered')
//                     console.log("this" + message)
//                     return res.render('student_login',{message});
//                 }
//             })
//         }        
        
//     });
    

//     // res.redirect('/');
// }



exports.student_register = (req, res) => {
    const message = [];
     // Declare message as an array
    console.log(req.body);
  
    const { username, firstname, lastname, email, password, passwordConfirm } = req.body;
    
  
    const errors = validationResult(req);
  
    db.query('SELECT username FROM student WHERE username = ?', [username], async (error, results) => {
      if (error) {
        console.log(error);
      }
  
      if (results.length > 0) {
        message.push('Username already used');
        return res.render('student_register', { message: message }); // Pass message to the template
      } else if (password !== passwordConfirm) {
        message.push('Passwords do not match');
        console.log("thisIs", message);
        return res.render('student_register', { message: message }); // Pass message to the template
      }
  
      // If there are validation errors, you can also pass them to the template
      if (!errors.isEmpty()) {
        const alert = errors.array();
        return res.render('student_register', { message: message, alert: alert }); // Pass message and alert to the template
      }
  
      
      let hashedPassword = await hashit(password);//bcrypt.hash(password, 8); //8 round to incript pw
      db.query('INSERT INTO student SET ?', { username: username, firstname: firstname, lastname: lastname, email: email, passwords: hashedPassword }, (error, results) => {
        if (error) {
          console.log(error);
        } else {
          message.push('User Registered');
          console.log("this", message);
          return res.render('student_login', { message: message }); // Pass message to the template
        }
      });
    });
  };

// <% if(message) { %>
//     <div class="alert alert-danger" role="alert"><%= message %></div>
//     <% } %>


exports.login_student = (req, res)=>{
    const mess = []
    const {username, password } = req.body;
    (
        async function(){
            try{
                let formula
                const hashedPassword = await hashit(password);
                db.query('SELECT * FROM student WHERE username = ?',[username], async (error, results)=>{
                    formula = results[0]
                    if(error){
                        mess.push("Username not found")
                        console.log("thisIsThe" + error);
                    }
                    console.log('results',results,results.length);

                    if(results.length>0){
                        bcrypt.compare(req.body.password,results[0].passwords,(error,results)=>{
                            if(error){
                                console.log(error)
                            }
                            console.log('results = ',results)
                            if(results){
                                
                                req.session.userinfo = formula
                                console.log("results=",formula)
                                console.log("session= ",req.session.userinfo)
                                return res.redirect('/')
                            }
                            else{
                                mess.push("Password donot match")
                                return res.render('student_login', {mess:mess})
                            }
                            
                        })
                    }else{
                        mess.push("username not found")
                        return res.render('student_login', { mess:mess })
                  }
                        // if(results.password == hashedPassword){
                        //     //req.session.username = results.username
                        //     return res.render('index',)
                        // } 
                    
                    
                })
            }
            catch(err){
                console.log(err);
            }
        }
    )()

}
  

exports.logout = (req, res)=>{
    if (req.session) {
        req.session.destroy(err => {
          if (err) {
            console.log(err)
          } 
          else {
            console.log('Logout successful')
            return res.redirect('/')
          }
        });
      } else {
        res.end()
      }
}



/*
for guide
*/

exports.tutor_register = (req,res)=> {
    const {username, firstname,lastname, middlename, grpGender, email, password, passwordConfirm, address, contactNumber, tutorPicture, subject, bio, educationLevel, collegegrade, collegegradesheet, citizenshipName, citizenshipNumber, licenseName, licenseNumber, availability, monthlyFee, experience } = req.body;
    var message = [];
    const errors = validationResult(req)
    //one person with one email can register one time & if passsword and passwordConfirm matches
    db.query('SELECT username FROM tutor WHERE username = ?',[username], async (error, results)=>{
        if(error){
            console.log(error);
        }
        
        if (results.length > 0 ){
            message.push('username already used')
            return res.render('tutor_register',{message});
        } 
        else if(password !== passwordConfirm) {
            message.push('password donot match')
            return res.render('tutor_register',{message});
        };

        
        if(!errors.isEmpty()) {
            // return res.status(422).jsonp(errors.array())
            const alert = errors.array()
            res.render('tutor_register', {alert})
        }
        else{
            let hashedPassword = await hashit(password); //bcrypt.hash(password, 8);  //8 round to incript pw

            db.query('INSERT INTO tutor SET ?',{username: username,firstname: firstname, lastname: lastname, middlename:middlename, grpGender:grpGender, email: email, passwords: hashedPassword, address: address, contactNumber:contactNumber, tutorPicture:tutorPicture, subject:subject, bio:bio,educationLevel:educationLevel, collegegrade:collegegrade, collegegradesheet:collegegradesheet,citizenshipName:citizenshipName, citizenshipNumber:citizenshipNumber, licenseName:licenseName, licenseNumber:licenseNumber, availability:availability, monthlyFee:monthlyFee, experience:experience }, (error, results)=>{
                // db.query('INSERT INTO tutor_subject SET ?', {subject: subject}, (subject, error1)=>{
                    if(error){
                        console.log(error);
                    }
                    else{
                        console.log("HereisHero")
                        message.push('Tutor Registered')
                        return res.render('tutor_login',{message});
                        // return res.redirect('/tutor_login');
                    }

                // })
                
            })
        }        
        
    });        
}

// exports.tutor_login = (req, res)=>{
//     const {username, password } = req.body;  
//     //const hashedPassword = await hashit(password);
//     db.query('SELECT * FROM tutor WHERE username = ?',[username], async (error, results)=>{
//         if(error){
//             console.log(error);
//         }

//         if(results.length>0){
//             bcrypt.compare(req.body.password,results[0].passwords,(error,results)=>{
//                 if(error){
//                     console.log(error)
//                 }
//                 if(results){
//                     req.session.userinfo = username
//                     console.log(req.session.userinfo)
//                     return res.redirect('/')
//                 }
//                 else{
//                     return res.redirect('/tutor_login')
//                 }
                
//             })
//         }else{
//             return res.redirect('/tutor_login')
//     }
//     })
// }
            

exports.tutor_login = (req, res)=>{
    msg = []
    const {username, password } = req.body;
    (
        async function(){
            try{
                let formula;
                const hashedPassword = await hashit(password);
                db.query('SELECT * FROM tutor WHERE username = ?',[username], async (error, results)=>{
                    formula = results[0]
                    if(error){
                        console.log(error);
                    }
                    console.log('results',results,results.length);

                    // if(results.length>0){
                    //     bcrypt.compare(req.body.password,results[0].passwords,(error,results)=>{
                    //         if(error){
                    //             console.log(error)
                    //         }
                    //         console.log('results = ',results)
                    //         if(results){
                                
                    //             req.session.userinfo = formula
                    //             console.log("results=",formula)
                    //             console.log("session= ",req.session.userinfo)
                    //             return res.redirect('/')
                    //         }
                    //         else{
                    //             return res.render('tutor_login')
                    //         }
                            
                    //     })
                    // }else{

                        if(results.length>0){
                            bcrypt.compare(req.body.password,results[0].passwords,(error,results)=>{
                                if(error){
                                    console.log(error)
                                }
                                console.log("check" + results)
                                if(results){
                                    req.session.userinfo = formula
                                    console.log(req.session.userinfo)
                                    return res.redirect('/')
                                }
                                else{
                                    msg.push("Password donot match")
                                    console.log("ERROR-1")
                                    return res.render('tutor_login', {msg: msg})
                                }
                                
                            })
                        }else{
                            msg.push("Username not found")
                            return res.render('tutor_login', {msg:msg})
                         }
                        // if(results.password == hashedPassword){
                        //     //req.session.username = results.username
                        //     return res.render('index',)
                        // } 
                    
                    
                })
            }
            catch(err){
                console.log(err);
            }
        }
    )()

}



exports.profile = (req,res)=> {
    console.log(req.session)
    if(req.session.userinfo){
        let isguide = req.session.userinfo.isGuide
        if(isguide){
            db.query("select * from guide where userID = ?",[req.session.userinfo.user_id],(error, guideinfo)=>{
                // console.log(combined)
                return res.render('user_profile',{session:req.session.userinfo, guideinfo:guideinfo[0]})
            })
        }
        else{
            
            return res.render('tourist_profile',{session:req.session.userinfo})
        }
    }
    else{
        res.redirect("/auth/login")
        console.log("not registered")
    }
      
}

