import React from 'react';
import { Redirect } from 'react-router-dom';
//import Background from '../backgrounds/connectwork.png';
import '../App.css';
//import * as Icons from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as Icons from "@fortawesome/free-solid-svg-icons";
import ImagePage from "./imagePage.component.jsx";
import PlacePage from "./placePage.component.jsx";
import AlbumPage from "./albumPage.component.jsx";
import artspace from '../media/artspace.png';

export default class galleryPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {selectedOption:'',
                 sideState:false,
                 uploadClick:false,}
    this.selectionHandler = this.selectionHandler.bind(this);
    this.openSideBar = this.openSideBar.bind(this);
    this.closeSideBar = this.closeSideBar.bind(this);
    this.uploadSelection = this.uploadSelection.bind(this);
    this.logout = this.logout.bind(this);
  }
        
selectionHandler(e){
        e.preventDefault();
        var Options = ['imageOption','albumOption','placeOption'];
        Options.forEach(function(element){
            document.getElementById(element).style.fontWeight = 'normal';
        });
        document.getElementById(e.target.id).style.fontWeight = 'bold';
        this.setState({ selectedOption: e.target.id });
        
    }
    
searchButtonClick(e){
        e.preventDefault();
        var topBar = document.getElementsByClassName("topBar")[0];
        var searchButton = document.getElementsByClassName("searchFa")[0];
        var hamBurger = document.getElementsByClassName("hamFa")[0];
        var hamButton = document.getElementById("hamButton");
        searchButton.style.animation = "barSearch 0.5s ease 0s 1 forwards";
        searchButton.style.backgroundColor = "white";
        document.getElementById("searchButton").style.color = "black";
        hamBurger.style.animation = "barSearch 0.3s ease 0s 1 forwards";
        topBar.style.animation = "barWipe 0.5s ease 0s 1 forwards";
        
        //hamBurger.style.backgroundColor = "ghostwhite";
        hamButton.style.color = "black";
        
}
    
openSideBar(e){
    document.getElementById('sideBar').style.animation = "sideBarOpen 0.3s ease 0s 1 forwards";
    this.setState({ sideState:true });
}
    
closeSideBar(e){
    if((this.state.sideState)&&(e.target.id!=='sideBar')){
        document.getElementById('sideBar').style.animation = "sideBarClose 0.3s ease 0s 1 forwards";
        this.setState({ sideState:false });
    }
    //}
    //if(e.target.id)
}
    
logout(){
    this.setState({logout:true});
}
    
uploadSelection(e){
    this.setState({ uploadClick:true });
}
  render() {

    return (
      <div className="App">
        {this.state.uploadClick?<Redirect to='/uploadimage' />:null}
        <div className="galleryContainer" onClick = {this.closeSideBar}>
            <div className = "sideBar" id="sideBar">
                <div id="sideBarTop">
                    <div className="proPic">
                        <img src = {artspace}
                        style = {{'width':'70px'}}></img>
                    </div>
                    <div id="usernameDisp">ABC</div>
                </div>
                <div id="sideBarOptions">
                    <span className="sideBarElement" onClick = {this.uploadSelection}>
                        <FontAwesomeIcon icon={Icons.faCloudUploadAlt} size="2x" id = "faIcon"
                        className = "sideBarIcon"/>
                        &nbsp;
                        Upload</span>
                    <br />
                    <br />
                    <span className="sideBarElement" onClick = {this.logout}>
                    <FontAwesomeIcon icon={Icons.faSignOutAlt} size="2x" id = "faIcon"
                        className = "sideBarIcon"/>
                        &nbsp;
                        Logout</span>
                </div>
            </div>
            <div className = "galleryCover"></div>
            <div className = "searchContainer">
                <div className = "row" style = {{'marginTop':'0px'}}>
                        <div className = "col-2" style = {{'padding':'0'}}>
                            <div className = "hamFa">
                                <FontAwesomeIcon id="hamButton" icon={Icons.faBars} size="2x" style={{'width':'20px','color':'white'}} 
                                onClick = {this.openSideBar} />
                            </div>
                        </div>
                        <div className = "col-8" style ={{'padding':'0'}}>
                            <div className = "topBar">
                                <input type = "text" style = {{'width':'90%','fontSize':'150%'}}/>
                            </div> 
                        </div>
                        <div className = "col-2" style = {{'padding':'0'}}>
                            <div className = "searchFa">
                                <FontAwesomeIcon id = "searchButton" icon={Icons.faSearch} size="2x" style={{'width':'20px','color':'white'}} 
                                    onClick = {this.searchButtonClick} />
                            </div>                        
                        </div>  
                </div>
            </div>                
            <div className = "menuContainer">
                <br />
                <div className = "row" style = {{'marginTop':'0px'}}>
                    <div className = "col-1" />
                    <div className = "col-2">
                        <button id = "imageOption" className = "buttonOption" onClick = {this.selectionHandler} >
                            Images
                        </button>
                    </div>
                    <div className = "col-2">
                        <button id = "albumOption" className = "buttonOption" onClick = {this.selectionHandler} >
                            Albums
                        </button>
                    </div>
                    <div className = "col-2">
                        <button id = "placeOption" className = "buttonOption" onClick = {this.selectionHandler} >
                            Places
                        </button>
                    </div>
                    <div className = "col-2"></div>
                    <div className = "col-2"></div>
                    <div className = "col-1" />
                </div>
                <br />
            </div>
            <div className = "imageContainer">
                {this.state.selectedOption==='imageOption'?<ImagePage serverLink = {this.props.serverLink}/>:null}
                {this.state.selectedOption==='placeOption'?<PlacePage serverLink = {this.props.serverLink}/>:null}         
                {this.state.selectedOption==='albumOption'?<AlbumPage serverLink = {this.props.serverLink}/>:null}         
                {this.state.logout?<Redirect to='/login' />:null}
            </div>
        </div>
        <div className = "galleryBackground" style = {{'minHeight':'800px'}}></div>
    </div>   
    );
  }
}
