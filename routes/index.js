// 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

var express = require('express');
var router = express.Router();
const path = require('path');
const fs = require('fs');
var multer  = require('multer');
const Jimp = require("jimp");
// var colorThief = require('color-thief-jimp');
var ColorThief = require('color-thief');
const directory = path.join(__dirname, '../public/uploads/');

colorThief     = new ColorThief();
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

var upload = multer({ storage: storage })

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{result:""})
});
var prod=[]
var pathp;
var dbImgData=[]
var resultMap = new Map();
var n=[]


/*Jimp.read(imageUrl='public/images/shirt/', function (err, image='dark_blue_dot.png') {
     var rgb = colorThief.getColor(image);
     console.log(rgb); // Works!
});*/


router.post('/upload',upload.single('photo'),function(req,res){

    if(req.body.cat=='/shirt'){pathp='public/images/shirt/'}
    if(req.body.cat=='/watch'){pathp='public/images/watch/'}
    if(req.body.cat=='/shoe'){pathp='public/images/shoe/'}
    if(req.body.cat=='/phone'){pathp='public/images/phone/'}
    const directoryPath = path.join(__dirname,"../"+pathp);
    fs.readdir(directoryPath, function (err, files) {
      //handling error
      if (err) {
          return console.log('Unable to scan directory: ' + err);
      }
      //listing all files using forEach
      for(var i=0;i<files.length;i++){
          prod[i]=files[i];
          console.log('products in dir -->'+prod[i])
      }
      console.log('hi '+pathp)
      console.log('---> file ---> '+req.file.filename)
      for(var i=0;i<prod.length;i++)
      {
        var image0 = fs.readFileSync("public/uploads/"+req.file.filename);
        var image00 = fs.readFileSync(pathp+prod[i]);  
        var rgb0 = colorThief.getColor(image0);
        var rgb00 = colorThief.getColor(image00);
        // console.log('-------------------> '+pathp+prod[i])
        // console.log('-------------------> '+rgb0)
        // console.log('-------------------> '+rgb00)
        var sub1=Math.abs(rgb00[0]-rgb0[0])
        var sub2=Math.abs(rgb00[1]-rgb0[1])
        var sub3=Math.abs(rgb00[2]-rgb0[2]);

        if(sub1<=30&&sub2<=30&&sub3<=30)
        {
          console.log('matched r diff--> '+sub1+'--> '+prod[i])
          console.log('matched g diff--> '+sub2+'--> '+prod[i])
          console.log('matched b diff--> '+sub3+'--> '+prod[i])
          resultMap.set(prod[i],sub1)
          n[i]=prod[i];
        }
        console.log('notmatched r diff--> '+sub1+'--> '+prod[i])
        console.log('notmatched g diff--> '+sub2+'--> '+prod[i])
        console.log('notmatched b diff--> '+sub3+'--> '+prod[i])
   
       
      }
      var mapAsc = new Map([...resultMap.entries()].sort());
      var sortMap=new Map([...resultMap.entries()].sort((a, b) => a[1] - b[1]));
      resultMap.clear()
      prod=[]
      p=pathp.slice(7)
      ///deleting upload file
      fs.readdir(directory, (err, files) => {
          if (err) throw err;
       
          for (const file of files) {
            fs.unlink(path.join(directory, file), err => {
              if (err) throw err;
              //console.log('deleted')
            });
          }
      });

      console.log("slice "+p)
      console.log(sortMap)
      res.render('index',{'result':sortMap,'path':p})
    })          
})

module.exports = router;