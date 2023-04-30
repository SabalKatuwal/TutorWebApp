const express = require('express');
const mysql = require('mysql');
const {check, validationResult} = require('express-validator');
const e = require('express');


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DATABASE,
    database: 'Travewire'
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
    db.query('SELECT * FROM site', (error, siteinfo)=>{
        if(error){
            console.log(error);
        }
        else{
            // console.log(siteinfo)
            // console.log(req.session.userinfo);
            const data = [];
            siteinfo.forEach(site => {
                //console.log('inside for')
                let siteData = {}
                siteData.site = site;

                db.query('SELECT * FROM site_images where siteID = ?',[site.site_id], (error, images)=>{
                    //console.log('getting images')
                    
                })             
                //console.log('pushing site data to data');
                data.push(siteData)
                
            })
            // console.log('data = ',data);
            return res.render('index', {siteinfo, user:req.session.userinfo})
        }
                 
    })
};


exports.detail_view = (req,res)=> {
    const id = req.params.site_id
    console.log('req.params',req.params)
    db.query("select * from site where site_id = ?", [id],(error, site)=>{
        if(error){
            console.log(error)
        }
        else{
            console.log('site',site)
            // console.log(site[0].district)
            db.query('select * from accomodation where district = ?',[site[0].district],(err,accomodations) => {
                if(err){
                    console.log(err)
                }
                else{
                    console.log("site=", site)
                    db.query('select * from guide where guide_id = ?',[site[0].guideID],(err,guide) => {
                        // console.log("guide=", guide)
                        db.query('select * from user where user_id = ?',[guide[0].userID],(err,user) => {
                            
                            db.query('select * from site_images where siteID = ?',[site[0].site_id],(err,images) => {
                                console.log('images = ',images)
                                return res.render('site_detail', {
                                                                    site:site[0], 
                                                                    accomodations, 
                                                                    guide:guide[0],
                                                                    user:user[0],
                                                                    images:images
                                                                })
                            })
                            
                        })
                    })
                }
            })
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
    const {name, email, message} = req.body
    db.query('INSERT INTO contact_us SET ?',{name: name, email:email, message:message}, (error, results)=>{
        if(error){
            console.log(error);
        }
        else{
            console.log('your response is registered')
            return res.redirect('/');
        }
    })
};

exports.search_result = (req,res)=> {
    const {body} = req.body
    console.log(req.body)
    db.query("SELECT * FROM site WHERE name LIKE '%"+ body + "%'",(error, result)=>{
        if(error){
            console.log(error)
        }
        else{
            console.log(result[0].site_id)
            db.query("SELECT * FROM site where site_id = ?",[result[0].site_id],(error, id)=>{
                res.render("search_result", {site:result,id:id[0]});
            })
        }
    })
}