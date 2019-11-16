import { Redirect } from 'react-router-dom';
import React,{ Component } from 'react';
import '../App.css';
import ImagePlacePage from "./imagePlacePage.component.jsx";
import axios from 'axios';
import ImageAlbumPage from "./imageAlbumPage.component.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Icons from "@fortawesome/free-solid-svg-icons";

export default class AlbumPage extends Component{
    constructor(props,context) {
       super(props,context);
       this.state = {
           albumFetch : false,
           albumList  : [],
           selectAlbum: false,
           album:"",
       }; 
        this.popAlbum = this.popAlbum.bind(this);
        this.selectAlbumHandler = this.selectAlbumHandler.bind(this);
    };
    
    componentDidMount(){
        axios.get(this.props.serverLink+'albumarray')
                .then(response => {
                    console.log(response.data);
                    this.setState({albumFetch:true});
                    this.setState({albumList:response.data});
                })
                .catch(function (error) {  
            });
    }
    
    selectAlbumHandler=(e)=>{
        console.log(e.target.innerHTML);
        this.setState({albumFetch:false,selectAlbum:true,album:e.target.innerHTML})
    }
    
    albumBack= () => {
        this.setState({albumFetch:true,selectAlbum:false,album:""});
    }
    
    popAlbum(){
        return this.state.albumList.map((curRow,i)=>{        
            return(<div className = "menuItem" key = {i} onClick = {this.selectAlbumHandler} >
                        <center>
                            {curRow}
                        </center>
                    </div>)
        });
    }
    
    render(){
    return(
        <div>
            {this.state.albumFetch==true?this.popAlbum():null}         
            {this.state.selectAlbum==true?<ImageAlbumPage albumName = {this.state.album} serverLink ={this.props.serverLink} />:null}
            {this.state.selectAlbum==true?<div className = "backButton" onClick = {this.albumBack}>
                <FontAwesomeIcon icon={Icons.faChevronCircleLeft} size="4x" className = "imgBarIcon"/>
                </div>:null}
        </div>
        );
        }
}
