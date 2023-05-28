const express = require('express');
const mysql = require('mysql');
const {check, validationResult} = require('express-validator');
const e = require('express');
// const { default: Stripe } = require('stripe');


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DATABASE,
    database: 'TutorWebApp'
});

exports.place_upload = (req,res)=> {
    console.log(req.files,req.body);
    var message = []
    const {site_name, description, picture, district } = req.body;
    //const errors = validationResult(req)
    db.query('INSERT INTO site SET ?',{name: site_name,description: description, district:district,guideID:req.session.userinfo.user_id, lat:req.body.lat, lng:req.body.lng}, (error, results)=>{
        console.log(results)
        if(error){
            console.log(error);
        }
        else
        {
            db.query("select * from site where site_id = ?", [results.insertId],(error, site)=>{
                req.files.forEach(file=>{
                    db.query('INSERT INTO site_images SET ?',{siteID:site[0].site_id, path:file.path}, (error, results)=>{
                        console.log(results)
                        if(error){
                            console.log(error);
                        }
                        else{
                            console.log('image saved')
                            // return res.redirect('/');
                        }
                    })
                })
                console.log('registered travel site')
                return res.json({success : 1});
                // return res.redirect('/')
            })

            
        }
    
    })
                  
};

exports.index = (req,res)=> {
    // db.query('SELECT * FROM site', (error, siteinfo)=>{
    //     if(error){
    //         console.log(error);
    //     }
    //     else{
    //         // console.log(siteinfo)
    //         // console.log(req.session.userinfo);
    //         const data = [];
    //         siteinfo.forEach(site => {
    //             //console.log('inside for')
    //             let siteData = {}
    //             siteData.site = site;

    //             db.query('SELECT * FROM site_images where siteID = ?',[site.site_id], (error, images)=>{
    //                 //console.log('getting images')
                    
    //             })             
    //             //console.log('pushing site data to data');
    //             data.push(siteData)
                
    //         })
    //         // console.log('data = ',data);
    //         return res.render('index', {siteinfo, user:req.session.userinfo})
    //     }
                 
    // })
    console.log(req.session.userinfo)
    return res.render('index', {user:req.session.userinfo})
};

//payment
const PUBLISHABLE_KEY = "pk_test_51NCh4OCPNV6NgccbKNjmqXjsvVVuobZ4ShmA31ELK3szw5mzCfjX9cy3rL8o241830wE1WRwfUhP2hdOErakh7WQ00r9G1Qwqa"
const SECRET_KEY = "sk_test_51NCh4OCPNV6NgccbobXnGEF7JQTvB3492cxUQhFlGgwaJMGJTZDCjkocw2s65aRxfJ3GplppOa4y533wqlyVgM0200l01KdVa2"
const stripe = require('stripe')(SECRET_KEY)

exports.detail_view = (req,res)=> {
    const id = req.params.id
    db.query("select * from tutor where id = ?", [id],(error, tutor)=>{
        if(error){
            console.log(error)
        }
        else{
            
            return res.render('tutor_detail', {
                tutor:tutor[0], 
                key:PUBLISHABLE_KEY 
                // accomodations, 
                // guide:guide[0],
                // user:user[0],
                // images:images
            })
            // console.log(site[0].district)
            // db.query('select * from accomodation where district = ?',[site[0].district],(err,accomodations) => {
            //     if(err){
            //         console.log(err)
            //     }
            //     else{
            //         console.log("tutor=", tu)
            //         db.query('select * from guide where guide_id = ?',[site[0].guideID],(err,guide) => {
            //             // console.log("guide=", guide)
            //             db.query('select * from user where user_id = ?',[guide[0].userID],(err,user) => {
                            
            //                 db.query('select * from site_images where siteID = ?',[site[0].site_id],(err,images) => {
            //                     console.log('images = ',images)
            //                     return res.render('site_detail', {
            //                                                         site:site[0], 
            //                                                         accomodations, 
            //                                                         guide:guide[0],
            //                                                         user:user[0],
            //                                                         images:images
            //                                                     })
            //                 })
                            
            //             })
            //         })
            //     }
            // })

        }
    })
};


exports.return_places = (req,res)=> {
    db.query("select name from site",(error, results)=>{
        if(error){
            console.log(error)
        }
        else{
            
            return res.json(results)
            

        }
    })
};

// exports.return_coordinates = (req,res)=> {
    // console.log(req.body)
    // db.query("select * from site where site_id = ?",[req.body.site_id],(error, results)=>{
    //     if(error){
    //         console.log(error)
    //     }
    //     else{
            
    //         return res.json(results)
            

    //     }
    // })
// };

exports.contact_us = (req,res)=> {
    const msg = []
    const {name, email, message} = req.body
    db.query('INSERT INTO contactUs SET ?',{name: name, email:email, message:message}, (error, results)=>{
        if(error){
            console.log(error);
        }
        else{
            msg.push('your response is registered')
            return res.render('contact', {msg: msg});
        }
    })
};

// exports.search_result = (req,res)=> {
//     const {body} = req.body
//     console.log(req.body)
//     db.query("SELECT * FROM site WHERE name LIKE '%"+ body + "%'",(error, result)=>{
//         if(error){
//             console.log(error)
//         }
//         else{
//             console.log(result[0].site_id)
//             db.query("SELECT * FROM site where site_id = ?",[result[0].site_id],(error, id)=>{
//                 res.render("search_result", {site:result,id:id[0]});
//             })
//         }
//     })
// }

exports.search_result = (req,res)=> {
    const {body} = req.body
    console.log(req.body)
    db.query(
        "SELECT * FROM tutor WHERE username LIKE '%" + body + "%' OR subject LIKE '%" + body + "%'",
        (error, result) => {
        if(error){
            console.log(error)
        }
        else{

            if (result.length > 0){
                db.query("SELECT * FROM tutor where id = ?",[result[0].id],(error, id)=>{
                    console.log(id[0])
                    res.render("search_result", {tutor:result,id:id[0], noResults: false});
    
                    
                });
            } else {
                //no result found
                res.render("search_result", { tutor: [], id: null, noResults: true });
            }
            
            
            
        }
        
    })
}


exports.payment = (req, res) => {
    
    const { stripeEmail, stripeToken } = req.body;
    const username = req.session.userinfo.username;
    const studentId = req.session.userinfo.id;
    const tutorId = req.params.tutorId;
    console.log(tutorId)
    stripe.customers.create({
        email:req.body.stripeEmail,
        source: req.body.stripeToken,
        name: req.session.userinfo.username,
        address:{
            line1: 'addresshere',
            postal_code: '123',
            city: 'KTM',
            state: 'Bagmati',
            country: 'Nepal'
        }
    })
    .then((customer)=> {
        return stripe.charges.create({
            amount:1000,
            description:'Web site tutor fees ',
            currency:'USD',
            customer:customer.id
        })
    })
    .then((charge)=>{
        console.log(charge)
        const amount = charge.amount;
        const method = charge.payment_method_details.card.brand
        console.log("amount" + amount)
        console.log("method" + method)
        db.query(
            'INSERT INTO payments (tutorId, studentId, paymentBy, email, payment_info, amount, method) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [tutorId, studentId, username, stripeEmail, JSON.stringify(charge), amount, method],
            (error, result) => {
              if (error) {

                console.log(error);
                res.send(error);
              } else {
                console.log('Payment data inserted successfully');
                res.redirect('/');
              }
            }
          );
    })
    .catch((err) => {
        res.send(err)
    })
}