const mongoose = require('mongoose');

let loginSchema = new mongoose.Schema({
    username:{
    type: String,
    required: true,
    unique: true,
    lowercase: true},
    password:{
    type: String,
    required: true,
}
})

let imageSchema = new mongoose.Schema({
    img:{
        data: Buffer,
        contentType: String,
    },
    username:{
    type: String,
    required: true,
    },
    timestamp: {
        type: Number,
        required: true,
    },
    location: {
    type: String,
    }
},{
    timestamps: true
});

let albumSchema = new mongoose.Schema({
    albumname:{
    type: String,
    required: true,
    },
    picid: {
    type: String,
    }
});

//var login = mongoose.model('login',loginSchema);
var login = mongoose.model('login',loginSchema);
var image = mongoose.model('image',imageSchema);
var album = mongoose.model('album',albumSchema);

//module.exports = login;
module.exports = {   
    login:login,
    image:image,
    album:album,
};