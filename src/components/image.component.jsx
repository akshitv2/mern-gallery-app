//import { Redirect } from 'react-router-dom';
import React,{ Component } from 'react';
import '../App.css';
import PinchToZoom from 'react-pinch-and-zoom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Icons from "@fortawesome/free-solid-svg-icons";
import EXIF from 'exif-js';
import axios from 'axios';

export default class Image extends Component{
    
    constructor(props,context) {
       super(props,context);
       this.state = {
           showModal : false,
           showDelModal: false,
           showAddAlbumModal:false,
           showInfoModal:false,
           scrollLevel:0,
           infoImg:[],
           albumFetch:false,
           albumList:[],
       }; 
    this.showModalToggle = this.showModalToggle.bind(this);
    this.showBarAddAlbum = this.showBarAddAlbum.bind(this);
    this.showBarDelete = this.showBarDelete.bind(this);
    this.showBarInfo = this.showBarInfo.bind(this);
    this.promptClick = this.promptClick.bind(this);
    this.albumListRet = this.albumListRet.bind(this);
    this.albumSelected = this.albumSelected.bind(this);
    this.newAlbum = this.newAlbum.bind(this);
    };
    
    showModalToggle(e){        
        var stateModal;
        var imageContainer = document.getElementsByClassName('imageContainer')[0];
        //console.log(imageContainer.scrollLeft, imageContainer.scrollTop);
        imageContainer.scrollTop = 0;
        var clickClass = ['imageModal','imageBar','imgBarIcon','col-2','col-6',"adder","dndbutton"]
        //stateModal = ((e.target.className!='imageModal')?!(this.state.showModal):(this.state.showModal));
        stateModal = ((!clickClass.includes(e.target.className))?!(this.state.showModal):(this.state.showModal));
        //console.log(this.state.showModal);
        this.setState({ showModal:stateModal });
    }
    
    showBarAddAlbum(){
        console.log("ADD");
        document.getElementsByClassName('promptAlbum')[0].style.display="block";
        axios.get(this.props.serverLink+'albumarray')
                .then(response => {
                    console.log(response.data);
                    this.setState({albumFetch:true});
                    this.setState({albumList:response.data});
                })
                .catch(function (error) {  
            });
    }
    showBarDelete(){
        console.log("DELETE");
        document.getElementsByClassName('promptDelete')[0].style.display="block";
    }
    showBarInfo(){
        console.log("INFO");
        var imgData = {};
        EXIF.getData(document.getElementById("mainImg"), function() {
            //this.setState({infoImg:EXIF.pretty(this)});
            imgData.cam = EXIF.getTag(this, "Model");
            imgData.h = EXIF.getTag(this, "ImageHeight");
            imgData.w = EXIF.getTag(this, "ImageWidth");
            imgData.foc = EXIF.getTag(this, "FocalLength");
            imgData.shutter = EXIF.getTag(this, "ShutterSpeedValue");
        });
        this.setState({infoImg:imgData});
        document.getElementsByClassName('promptInfo')[0].style.display="block";
    }
    
    promptClick(e){
        var btnClicked = e.target.id;
        if(btnClicked=='okButton'){
            document.getElementsByClassName('promptInfo')[0].style.display="none";
        }else if(btnClicked=='yesDel'){
            console.log(e.target.id);       
            document.getElementsByClassName('promptDelete')[0].style.display="none";
            
            axios.get(this.props.serverLink+'delimage?&id='+this.props.image.id)
                .then(response => {
                    console.log(response.data);
                })
                .catch(function (error) {  
            });
        }else if(btnClicked=='noDel'){
            document.getElementsByClassName('promptDelete')[0].style.display="none";
        }      
    }
    
    albumListRet(){
        return this.state.albumList.map((curAlbum,i)=>{
            return (<div className = "row" key = {i}>
                        <div className = "col-3" />
                            <div className = "col-6" onClick = {this.albumSelected} >{curAlbum}</div>
                        <div className = "col-3" />
                    </div>);
        });
    }
    
    albumSelected(e){
        console.log(e.target.innerHTML);
        console.log(this.props.image.id);
        axios.get(this.props.serverLink+'imageaddalbum?&ap='+e.target.innerHTML+'&picid='+this.props.image.id)
                .then(response => {
                    console.log(response.data);
                })
                .catch(function (error) {  
            });
        document.getElementsByClassName("promptAlbum")[0].style.display="none";
    }
    
    newAlbum(){
        var alName = document.getElementById("albumNameAdder").value;
        console.log(alName);
        console.log(this.props.image.id);
        if(alName.length>2){
            axios.get(this.props.serverLink+'imageaddalbum?&ap='+alName+'&picid='+this.props.image.id)
                .then(response => {
                    console.log(response.data);
                })
                .catch(function (error) {  
            });
        }
        document.getElementsByClassName("promptAlbum")[0].style.display="none";
        
            
    }
    
    
    render(){
        const thumbStyle = {'paddingLeft':'0px','paddingRight':'0px'};
    return(
        <div className = "col-3 thumbnailHolder" style ={thumbStyle} >
                <img className = "thumbnail" onClick = {this.showModalToggle}
                    src = {this.props.image.imgData} />
            {this.state.showModal?
            <div className = "imageModalContainer" onClick = {this.showModalToggle}>
                    <div className="imageBar">
                        <div className = "row" style = {{'marginTop':'0px'}}>
                            <div className = "col-2" />
                            <div className = "col-2" onClick = {this.showBarAddAlbum}>
                                <FontAwesomeIcon  icon={Icons.faImages} size="2x" id = "faIconAddAlbum" className = "imgBarIcon"/>
                            </div>
                            <div className = "col-1" />
                            <div className = "col-2" onClick = {this.showBarDelete}>
                                <FontAwesomeIcon  icon={Icons.faTrash} size="2x" id = "faIconTrash" className = "imgBarIcon"/>
                            </div>
                            <div className = "col-1" />
                            <div className = "col-2" onClick = {this.showBarInfo}>
                                <FontAwesomeIcon  icon={Icons.faInfoCircle} size="2x" id = "faIconInfo" className = "imgBarIcon"/>
                            </div>
                            <div className = "col-2" />
                        </div> 
                    </div>
                    <br />
                    <div className = "promptDelete">
                        <br />
                        <div className = "row" style = {{'marginTop':'0px'}}>
                            <div className = "col-2" />
                            <div className = "col-8" >
                                Are you sure you want to delete this?
                            </div>
                            <div className = "col-2" />
                        </div>
                        <br />
                        <div className = "row" style = {{'marginTop':'0px'}}>
                            <div className = "col-2" />
                            <div className = "col-2" id="yesDel" onClick = {this.promptClick}>
                                Yes
                            </div>
                            <div className = "col-4" />
                            <div className = "col-2" id="noDel" onClick = {this.promptClick}>
                                No
                            </div>
                            <div className = "col-2" />
                        </div>
                        <br />
                    </div>
                    <div className = "promptInfo">
                        <br />
                        <div className = "row" style = {{'marginTop':'0px'}}>
                            <div className = "col-1" />
                            <div className = "col-4">
                                Date Taken:
                            </div>
                            <div className = "col-6">
                                {this.props.image.timestamp}
                            </div>
                            <div className = "col-1" />
                        </div>
                        <div className = "row" style = {{'marginTop':'0px'}}>
                            <div className = "col-1" />
                            <div className = "col-4">
                                Location:
                            </div>
                            <div className = "col-6">
                                {this.props.image.location}
                            </div>
                            <div className = "col-1" />
                        </div>
                        <div className = "row" style = {{'marginTop':'0px'}}>
                            <div className = "col-1" />
                            <div className = "col-4">
                                Camera:
                            </div>
                            <div className = "col-6">
                                {this.state.infoImg.cam} 
                            </div>
                            <div className = "col-1" />
                        </div>
                        <div className = "row" style = {{'marginTop':'0px'}}>
                            <div className = "col-1" />
                            <div className = "col-4">
                                Height:
                            </div>
                            <div className = "col-6">
                                {this.state.infoImg.h}
                            </div>
                            <div className = "col-1" />
                        </div>
                        <div className = "row" style = {{'marginTop':'0px'}}>
                            <div className = "col-1" />
                            <div className = "col-4">
                                Width:
                            </div>
                            <div className = "col-6">
                                {this.state.infoImg.w}
                            </div>
                            <div className = "col-1" />
                        </div>
                        <div className = "row" style = {{'marginTop':'0px'}}>
                            <div className = "col-1" />
                            <div className = "col-4">
                                Focal Length:
                            </div>
                            <div className = "col-6">
                                {this.state.infoImg.h}
                            </div>
                            <div className = "col-1" />
                        </div>
                        <br />
                        <div className = "row" style = {{'marginTop':'0px'}}>
                            <div className = "col-5" />
                            <div className = "col-2" id="okButton" onClick = {this.promptClick} >
                                Ok
                            </div>
                            <div className = "col-5" />
                        </div>
                        <br />
                    </div>
                    <div className = "promptAlbum">
                        <br />
                        <div className = "row" style = {{'marginTop':'0px'}}>
                            <div className = "col-2" />
                            <div className = "col-8" >
                                Select Album
                            </div>
                            <div className = "col-2" />
                        </div>
                        <br />
                        {this.state.albumFetch?this.albumListRet():null}
                        <br />
                        <div className = "row" style = {{'marginTop':'0px'}}>
                            <div className = "col-1" />
                            <div className = "col-8">
                                <input width = "10" className = "adder" type = "text" placeholder="album name" id = "albumNameAdder"></input>
                            </div>
                            <div className = "col-2">
                                <button className = "dndbutton" onClick ={this.newAlbum}>+</button>
                            </div>
                            <div className = "col-1" />
                            
                        </div>
                        
                        <br />
                    </div>
                    <div className="container">
                        <PinchToZoom>
                            <img  className = "imageModal" id="mainImg" src = {this.props.image.imgData} />
                        </PinchToZoom>
                    </div>
                            
                </div>:null}
            
        </div>
        );
        }
}

