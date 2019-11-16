import { Redirect } from 'react-router-dom';
import React,{ Component } from 'react';
import '../App.css';
import Image from "./image.component.jsx";
import axios from 'axios';

export default class ImageAlbumPage extends Component{
    
    constructor(props,context) {
       super(props,context);
       this.state = {
           imageArr:[],
           fetchComp:false,
       };  
    this.popImg = this.popImg.bind(this);
    this.arrayBufferToBase64 = this.arrayBufferToBase64.bind(this);
    };
    
    componentDidMount() {
        axios.get(this.props.serverLink+'galleryfetchalbum/'+'?ac='+this.props.albumName)
        .then(response => {
                this.setState({imageArr:response.data,fetchComp:true});
                console.log(response.data);
            })
            .catch(function (error) {
            //
            })
    }
    
    arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => binary += String.fromCharCode(b));
    return window.btoa(binary);
    };
    
    popImg() {
    //var imgArr = this.state.imageArr;
    var imgArr = [];
    const dummyImg = 'https://dummyimage.com/600x400/ffffff/ffffff';
    var numImg = this.state.imageArr.length;
    var lastDate = this.state.imageArr[0].timestamp;
    var jumpRow = 0;
    var jump = 0;
    var imgRowArr = [];
    var tempRow = [];
    var ds = new Date(this.state.imageArr[0].timestamp); 
    var dStamp = '';
    var lastStamp = ds.getDate()+':'+ds.getMonth()+':'+ds.getFullYear();
    var sameDate = false;

    var months = {
        1:'Jan',
        2:'Feb',
        3:'March',
        4:'April',
        5:'May',
        6:'June',
        7:'July',
        8:'Aug',
        9:'Sept',
        10:'Oct',
        '11':'Nov',
        '12':'Dec',
    }
    //console.log(lastStamp);
    for(var i=0;i<numImg;i++){
        var curImage = this.state.imageArr[i];
        console.log(curImage);
        ds = new Date(curImage.timestamp);
        dStamp = ds.getDate()+' '+months[ds.getMonth()]+' '+ds.getFullYear();
        if(lastStamp==dStamp){
            jumpRow+=1;
            //console.log(dStamp);
        }else{
            imgRowArr.push(tempRow);
            tempRow = [];
            jumpRow=0;
        }
        if(jumpRow==4){
            imgRowArr.push(tempRow);
            sameDate = true;
            tempRow = [];
            jumpRow = 0;
        }
        
        //console.log(dStamp);
        lastStamp = dStamp;
        
        var obj = { imgData:('data:'+curImage.img.contentType+';base64,' + (this.arrayBufferToBase64(curImage.img.data.data))),timestamp:dStamp,
                  id:curImage._id,sameDate:sameDate}; 
        tempRow.push(obj);
        imgArr.push(obj);
        sameDate = false;
    }
    
    var obj = {imgData:dummyImg,timestamp:curImage.timestamp,id:false};             
    imgRowArr.push(tempRow);
    for(var i =0;i<imgRowArr.length;i++){
        tempRow = imgRowArr[i];
        for(var j = tempRow.length;j<4;j++){
            tempRow.push(obj);
        }
        imgRowArr[i] = tempRow;
    }
    console.log(imgRowArr);
    //console.log(tempRow);

    return imgRowArr.map((curRow,i)=>{
        return(
            <div className = "row" id="dispRow" key = {i}>
                {curRow[0].sameDate==false?<div className="gallerySpacer">{curRow[0].timestamp}</div>:null}
                {curRow[0].id?<Image image = {curRow[0]} serverLink = {this.props.serverLink}/>:<div className = "col-3"/>}
                {curRow[1].id?<Image image = {curRow[1]} serverLink = {this.props.serverLink}/>:<div className = "col-3"/>}
                {curRow[2].id?<Image image = {curRow[2]} serverLink = {this.props.serverLink}/>:<div className = "col-3"/>}
                {curRow[3].id?<Image image = {curRow[3]} serverLink = {this.props.serverLink}/>:<div className = "col-3"/>}
            </div>
        );
    })
    
    }
    
    render(){
    return(
        <div>
            {this.state.imageArr.length>0?this.popImg():null}
        </div>
        );
        }
}