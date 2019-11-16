const express = require('express');
const app = express();
//var file = require('file-system');
var fs = require('fs');
const axios = require('axios');

const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const cloudGal = express.Router();

const path = require("path");
const multer = require("multer");
var compress_images = require('compress-images');

mongoose.set('useCreateIndex', true);
let login = require('./cloudgal.model').login;
let imageObject = require('./cloudgal.model').image;
let albumObj = require('./cloudgal.model').album;

const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/cloudgal', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

cloudGal.route('/placearray').get(function(req, res) {
    imageObject.distinct('location',function(err, loc) {
        if (err) console.log(err);
        res.contentType('json');
        res.send(loc);
    });
    //res.json({'rep':'hello'});
});

cloudGal.route('/albumarray').get(function(req, res) {
    
    albumObj.distinct('albumname',function(err, album) {
        if (err) console.log(err);
        res.contentType('json');
        //console.log(album);
        res.send(album);
        //console.log(img.data);
    });/*--*/
});

cloudGal.route('/imagereturn').get(function(req, res) {
    console.log('hello');
    imageObject.findOne({},'img createdAt',function(err, img) {
        if (err) console.log(err);
        res.contentType('json');
        res.send(img);
        //console.log(img.data);
    }).sort({ createdAt: 'desc' });
    //res.json({'rep':'hello'});
});

cloudGal.route('/galleryfetch').get(function(req, res) {
    console.log('GalleryFetchInvoked');
    imageObject.find({},'img timestamp location',function(err, img) {
        if (err) console.log(err);
        res.contentType('json');
        res.send(img);
        //console.log(img.data);
    }).sort({ timestamp: 'desc' });
    //res.json({'rep':'hello'});
});

cloudGal.route('/galleryfetchplace').get(function(req, res) {
    //console.log('GalleryFetchInvoked');
    console.log(req.query.pc);
    imageObject.find({location:req.query.pc},'img timestamp',function(err, img) {
        if (err) console.log(err);
        res.contentType('json');
        res.send(img);
        //console.log(img.data);
    }).sort({ timestamp: 'desc' });
    //res.json({'rep':'hello'});
});

cloudGal.route('/delimage').get(function(req, res) {
    //console.log('GalleryFetchInvoked');    
    imageObject.deleteOne({ _id:req.query.id }, function (err) {
    if (err) return handleError(err);
    });
    albumObj.deleteMany({ picid:req.query.id }, function (err) {
    if (err) return handleError(err);
    });
});

cloudGal.route('/galleryfetchalbum').get(function(req, res) {
    console.log('GalleryFetchInvoked');
    console.log(req.query.ac);
    var picArr = []
    albumObj.find({albumname:req.query.ac},'picid',function(err, alb) {
        if (err) console.log(err);
        for(var i=0;i<alb.length;i++){
            picArr.push(alb[i].picid);}
        console.log(picArr);
        /*picArr = alb;
        console.log(picArr.length);
        var picStr = '';
    
        for(var i=0;i<picArr.length;i++){
            picStr = picStr.concat(picArr[i].picid,',');}
        console.log(picStr);
        picStr = picStr.substr(0,picStr.length-1);*/
        imageObject.find({_id:{$in:picArr}},'img timestamp',function(err, img) {
            if (err) console.log(err);
            //console.log(picArr);
            res.contentType('json');
            res.send(img);
        //console.log(img.data);
        }).sort({ timestamp: 'desc' });
    });
});

cloudGal.route('/imageaddalbum').get(function(req, res) {
    var picArr = []
    console.log(req);
    let albumObjx = new albumObj;
    albumObjx.albumname = req.query.ap;
    albumObjx.picid = req.query.picid;
    albumObjx.save();
});


cloudGal.route('/').get(function(req, res) {
    console.log('hello');
    res.json({'rep':'hello'});
});

cloudGal.route('/login').post(function(req, res) {
    /*let Login = new login;Login.username = 'abc';Login.password = 'abc';Login.save();*/    
    login.find(req.body,function(err,Rec){
    if (err) {
        console.log(err);
    } else {
        if(Rec.length==1){
            res.status(200).json({'valid':true});
        }
        else{
            res.status(200).json({'valid':false});
        }
    }
  });
});

const storage = multer.diskStorage({
   destination: "./public/uploads/",
   filename: function(req, file, cb){
      cb(null,"IMAGE-" + Date.now() + path.extname(file.originalname));
   }
});

const upload = multer({
   storage: storage,
   limits:{fileSize: 100000000},
}).single("myImage");

/*
   upload(req, res, err => {
      console.log("Request ---", req.body);
      console.log("Request file ---", req.file);//Here you get file.
      
      if(!err)
         return res.send(200).end();
   });
};);*/

function MyFun(path){
        compress_images('./public/uploads/'+path, './public/uploads/min/', {compress_force: false, statistic: true, autoupdate: true}, false,
                                                    {jpg: {engine: 'mozjpeg', command: ['-quality', '5']}},
                                                    {png: {engine: 'pngquant', command: ['--quality=20-50']}},
                                                    {svg: {engine: 'svgo', command: '--multipass'}},
                                                    {gif: {engine: 'gifsicle', command: ['--colors', '64', '--use-col=web']}}, function(err, completed){
                if(completed === true){
                    // Doing something.
                    console.log('Compressed');
                    //return('public/uploads/min/'+path);
                }                                    
        });
}

cloudGal.route('/upload').post(function(req, res) {
    upload(req, res, (err) => {
        console.log("Request ---", req.body);
        console.log("Request file ---", req.file.mimetype);//Here you get file.
        
        let imageObj = new imageObject;
        var path= "./public/uploads/";
        var imgOrigSource = fs.readFileSync(req.file.path);
        console.log(req.file.filename);
        imageObj.img.data = imgOrigSource;
        imageObj.img.contentType = req.file.mimetype;
        console.log(req.file.mimetype);
        imageObj.username = req.body.user;
        imageObj.timestamp = req.body.unix;
        console.log(req.body.latitude);
        console.log(req.body.longitude);     
        
        //console.log(req.file.path);
        //console.log('public/uploads/min/'+req.file.filename);
        
        geo_URL = 'https://open.mapquestapi.com/geocoding/v1/reverse?&key=49HmIbQxUkATORROGd5N8E8pLA9l1iMD&location='+req.body.latitude+','+req.body.longitude+'&includeRoadMetadata=false&includeNearestIntersection=false';
        //axios.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
        
        axios.get(geo_URL,{withCredentials: true})
          .then(response => {
            //console.log("\n#######\n"+response.data.results[0].locations[0].adminArea5);
            imageObj.location = response.data.results[0].locations[0].adminArea5;
            imageObj.save();
            //console.log(response.data.explanation);
          })
          .catch(error => {
            console.log(error);
        });    
        //imageObj.save();
      /*Now do where ever you want to do*/
        if(!err)
         return res.sendStatus(200).end();
   });
});
/*
cloudGal.get('/', function(request, response){
    response.sendFile('absolutePathToYour/htmlPage.html');
});*/



app.use('/cloudgal', cloudGal);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});