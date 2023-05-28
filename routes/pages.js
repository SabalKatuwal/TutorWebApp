const { decodeBase64 } = require('bcryptjs');
const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pages'); 
const multer  = require('multer')
// const upload = multer({dest:'uploads/'})
const path = require('path')

//stripe payment
// const PUBLISHABLE_KEY = "pk_test_51NCh4OCPNV6NgccbKNjmqXjsvVVuobZ4ShmA31ELK3szw5mzCfjX9cy3rL8o241830wE1WRwfUhP2hdOErakh7WQ00r9G1Qwqa"
// const SECRET_KEY = "sk_test_51NCh4OCPNV6NgccbobXnGEF7JQTvB3492cxUQhFlGgwaJMGJTZDCjkocw2s65aRxfJ3GplppOa4y533wqlyVgM0200l01KdVa2"

// const stripe = require('stripe')(SECRET_KEY)


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'../public/my_uploads'))
    },
    filename: function (req, file, cb) {
        console.log('file = ',file);
        const extension = file.mimetype.split('/')[1];
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + `.${extension}`)
    }
  })
  
  const upload = multer({ storage: storage })

router.get('/', pageController.index//(req, res)=>{
    //console.log(req.session.username);
    //res.render('index');
//}
);

router.get('/place_upload', (req, res)=>{
    res.render('place_upload');
});


    
router.get('/return_places', pageController.return_places);
// router.get('/return_coordinates', pageController.return_coordinates);

router.get('/about_us', (req, res)=>{
    return res.render("about")
});

router.get('/contact_us', (req, res)=>{
    res.render('contact');
});

router.get('/search_result', (req,res)=>{
  return res.render('search_result')
});


router.get('/detail/:id', pageController.detail_view);  //id is tutor ko id

router.post('/payment/:tutorId', pageController.payment);

router.post('/place_upload',upload.array('picture',12),pageController.place_upload) 

router.post('/contact_us', pageController.contact_us);





router.post("/search_result",pageController.search_result)
  

  
//payment process route
// router.get('/payment', (req, res) =>{
//   res.render('payment',{ key:PUBLISHABLE_KEY })
// }); 


module.exports = router;