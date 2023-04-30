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



exports.student_register = (req,res)=> {
    console.log(req.body);

    const {username, firstname, lastname, email, password, passwordConfirm } = req.body;
    var message = [];
    const errors = validationResult(req)
    //one person with one email can register one time & if passsword and passwordConfirm matches
    db.query('SELECT email FROM student WHERE email = ?',[email], async (error, results)=>{
        if(error){
            console.log(error);
        }
        
        if (results.length > 0 ){
            message.push('Email already used')
            return res.render('student_register',{message});
        } 
        else if(password !== passwordConfirm) {
            message.push('password donot match')
            return res.render('student_register',{message});
        };

        
        if(!errors.isEmpty()) {
            // return res.status(422).jsonp(errors.array())
            const alert = errors.array()
            res.render('student_register', {alert})
        }
        else{
            let hashedPassword = await hashit(password);//bcrypt.hash(password, 8); //8 round to incript pw

            db.query('INSERT INTO student SET ?',{username: username,firstname: firstname, lastname: lastname, email: email, passwords: hashedPassword }, (error, results)=>{
                if(error){
                    console.log(error);
                }
                else{
                    message.push('User Registered')
                    return res.render('login',{message});
                }
            })
        }        
        
    });
    

    // res.redirect('/');
}

// <% if(message) { %>
//     <div class="alert alert-danger" role="alert"><%= message %></div>
//     <% } %>


exports.login = (req, res)=>{
    const {username, password } = req.body;
    (
        async function(){
            try{
                let formula
                const hashedPassword = await hashit(password);
                db.query('SELECT * FROM student WHERE username = ?',[username], async (error, results)=>{
                    formula = results[0]
                    if(error){
                        console.log(error);
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
                                return res.render('login')
                            }
                            
                        })
                    }else{
                        return res.render('login')
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

exports.guide_register = (req,res)=> {
    const id = req.session.userinfo.user_id
    console.log(id)
    const { citizenshipName, citizenshipNumber, contactNumber, guidePicture, address, isguide , district} = req.body;
    const errors = validationResult(req)
    console.log(req.body)
        
    if(!errors.isEmpty()) {
        // return res.status(422).jsonp(errors.array())
        const alert = errors.array()
        res.render('guide_register', {alert})
    }
    else{
        db.query('INSERT INTO guide SET ?',{userID:id ,address:address, contactNumber:contactNumber, guidePicture:guidePicture, citizenshipName:citizenshipName, citizenshipNumber:citizenshipNumber, isguide:isguide , district:district}, (error, results)=>{
            if(error){
                console.log(error);
            }
            else{
                console.log('guide registered in database')
                return res.redirect('/');  
            }
        })
    }        
}

exports.guide_login = (req, res)=>{
    const {username, password } = req.body;  
    //const hashedPassword = await hashit(password);
    db.query('SELECT * FROM guide WHERE username = ?',[username], async (error, results)=>{
        if(error){
            console.log(error);
        }

        if(results.length>0){
            bcrypt.compare(req.body.password,results[0].passwords,(error,results)=>{
                if(error){
                    console.log(error)
                }
                if(results){
                    req.session.userinfo = username
                    console.log(req.session.userinfo)
                    return res.redirect('/')
                }
                else{
                    return res.redirect('/guide_login')
                }
                
            })
        }else{
            return res.redirect('/guide_login')
    }
    })
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

