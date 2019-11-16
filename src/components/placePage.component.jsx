import { Redirect } from 'react-router-dom';
import React,{ Component } from 'react';
import '../App.css';
import ImagePlacePage from "./imagePlacePage.component.jsx";
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Icons from "@fortawesome/free-solid-svg-icons";

export default class PlacePage extends Component{
    constructor(props,context) {
       super(props,context);
       this.state = {
           showPlaces : false,
           placeSelect:false,
           placeDict:[],
           place:"",
       }; 
        this.popPlace = this.popPlace.bind(this);
        this.selectPlaceHandler = this.selectPlaceHandler.bind(this);
    };
    
    componentDidMount(){
        axios.get(this.props.serverLink+'placearray/')
        .then(response => {
                console.log(response.data);
                this.setState({showPlaces:true,placeDict:response.data});
            })
            .catch(function (error) {
            //
            })
    }
    
    selectPlaceHandler=(e)=>{
        console.log(e.target.innerHTML);
        this.setState({showPlaces:false,placeSelect:true,place:e.target.innerHTML})
    }
    
    placeBack= () => {
        this.setState({showPlaces:true,placeSelect:false,place:''})
    }
    
    popPlace(){
        return this.state.placeDict.map((curRow,i)=>{
            return (<div className = "menuItem" key = {i} onClick = {this.selectPlaceHandler} >
                        <center>
                            {curRow}
                        </center>
                    </div>);
        });
    }
    
    render(){
    return(
        <div>
            {this.state.showPlaces==true?this.popPlace():null}         
            {this.state.placeSelect==true?<ImagePlacePage placeName = {this.state.place} serverLink = {this.props.serverLink} />:null}
            {this.state.placeSelect==true?<div className = "backButton" onClick = {this.placeBack}>
                <FontAwesomeIcon icon={Icons.faChevronCircleLeft} size="4x" className = "imgBarIcon"/>
                </div>:null}
        </div>
        );
        }
}
