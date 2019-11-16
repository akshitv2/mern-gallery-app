import React from 'react';
//import { Redirect } from 'react-router-dom';
import '../App.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Icons from "@fortawesome/free-regular-svg-icons";
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import EXIF from 'exif-js';

//const server = "http://localhost:4000/cloudgal/";

export default class uploadImage extends React.Component {
  constructor(props) {
        super(props);
        this.state ={
            file: null
        };
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
  }
    
    onFormSubmit(e){
        e.preventDefault();
        var imageInput = document.getElementById('imageInput');
        if (imageInput.files && imageInput.files[0]){
            var img = document.getElementById("imgPreview");
            
            var dateTime,latitude,longitude;
            EXIF.getData(img, function() {
                dateTime = EXIF.getTag(this, "DateTime");
                var latArr = EXIF.getTag(this, "GPSLatitude");
                latitude = (latArr==undefined?'0':(latArr[0]+latArr[1]/60+latArr[2]/3600).toFixed(6));
                var longArr = EXIF.getTag(this, "GPSLongitude");
                longitude = (longArr==undefined?'0':(longArr[0]+longArr[1]/60+longArr[2]/3600).toFixed(6));
                console.log(EXIF.pretty(this));
                //console.log('lat:',latitude,'long:',longitude,'dt',dateTime);
            });        
            console.log('lat:',latitude,'long:',longitude,'dt',dateTime);
            var unix_seconds;
            var dt = dateTime;
            
            if(dt==undefined){
                dt = new Date();
                unix_seconds = Date.parse(dt);
            }
            else{              
                unix_seconds = (Date.parse(dt.substr(0,4)+'.'+dt.substr(5,2)+'.'+dt.substr(8,)))/1;
                console.log(unix_seconds);
            }
            
            const formData = new FormData();
            formData.append('myImage',this.state.file);
            formData.append('user','abc');
            formData.append('latitude',latitude);
            formData.append('longitude',longitude);
            formData.append('unix',unix_seconds);
            console.log(localStorage.getItem("username"));
            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            };
            //var holder = {'user':'abc','password':'pass'};
            
            axios.post(this.props.serverLink+"/upload",formData,config)
                .then((response) => {
                    this.setState({uploadSuccess:true});
                }).catch((error) => {
            });
        }
        else{
            alert('Please Select File')
        }
    }
    
    onChange(e) {
        this.setState({file:e.target.files[0]});
        //console.log(e.target.files[0]);
        //document.getElementById('imgPreview').src=e.target.result;
        if (e.target.files && e.target.files[0]){
            var reader = new FileReader();
            reader.onload = function (e) {
            document.getElementById('imgPreview').src=e.target.result;
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    }
    
    render() {
        return (
            <div>
                <form onSubmit={this.onFormSubmit}>
                    <h1>File Upload</h1>
                    <input type="file" name="myImage" id="imageInput" onChange= {this.onChange} />
                    <button type="submit">Upload</button>
                </form>
                <img id="imgPreview" src = "https://dummyimage.com/600x400/fff/fff" style={{'width':'100%'}}></img>
                {this.state.uploadSuccess?<Redirect to='/gallery' />:null}
            </div>
            
        )
    }
}
