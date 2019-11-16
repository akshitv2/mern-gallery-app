import React from 'react';
//import { Redirect } from 'react-router-dom';
import poly1 from '../media/poly2.jpg';
import artspace from '../media/artspace.png';
import '../App.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Icons from "@fortawesome/free-regular-svg-icons";
import { Redirect } from 'react-router-dom';
import axios from 'axios';

export default class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        loginSuccess:false,
    }
    this.loginButtonClick = this.loginButtonClick.bind(this);
  }
    
    loginButtonClick(e){
        e.preventDefault();
        var roundButton = document.getElementsByClassName("round")[0];
        roundButton.innerHTML = "&nbsp;";
        roundButton.style.animation = "contractButton 2s ease 0s infinite alternate";
        //if(document.getElementById('inputUsername')=='')
        /*setTimeout(() => {
            this.setState({ loginSuccess:true });
        }, 2000)*/
        
        var username = document.getElementById('inputUsername').value;
        var password = document.getElementById('inputPassword').value;
        var holder = {'username':username,'password':password};
        localStorage.setItem("username", username);
        
        //console.log(this.props);
        axios.post(this.props.serverLink +'login', holder)
            .then(response => {
              var loginResponse = response.data.valid;
              if(loginResponse==true){
                setTimeout(function(){ document.getElementsByClassName('finContainer')[0].style.animation = "swipeAppear 0.5s linear 0s 1 forwards"; }, 3000);
              }
              else{
                document.getElementsByClassName('loginError')[0].style.animation = "loginErrorAnim 0.5s linear 0s forwards";
              }
              
                setTimeout(() => {
                    this.setState({ loginSuccess:response.data.valid });
                    roundButton.style.animation = "";
                    roundButton.innerHTML = "Sign In"
                    //document.getElementsByClassName('loginError')[0].style.animation = "loginErrorAnim 0.5s linear 0s forwards";
                }, 6000)
                //this.setState({ loginSuccess:response.data.valid });
                //if(response.data.valid==false){
                //roundButton.style.animation = "";
                //}
                console.log(response);
            })
            .catch(function (error) {
               console.log(error);
            })
        }

  render() {
    function inputShiftUpUser(e){
      e.preventDefault();
      var emailStamp = document.getElementById('emailStamp');
      emailStamp.style.top = "-35%";
      emailStamp.style.fontSize = "70%";
    }

    function inputShiftUpPass(e){
      e.preventDefault();
      var emailStamp = document.getElementById('passwordStamp');
      emailStamp.style.top = "-35%";
      emailStamp.style.fontSize = "70%";
    }
    
    return (
      <div className="App">
        <img src = {artspace} id = "logo"></img>
        <div className="container">
            <img src={ poly1 } id = "backImg" alt='back'/>    
            <div className = "finContainer">
                <br />
                <div className = "row">
                    <div className = "col-1"></div>
                    <div className = "col-7 signIn">
                        <span>Welcome </span>
                        Back
                    </div>
                    <div className = "col-4"> </div>
                </div>
                <div className = "row" style = {{'padding-top':'10%'}}>
                    <div className = "col-1" />
                    <div className = "col-1">
                        <FontAwesomeIcon icon={Icons.faEnvelope} size="2x" id = "faIcon"/>
                        <br />
                        <br />
                        <br />
                        <FontAwesomeIcon icon={Icons.faEdit} size="2x" id = "faIcon" />
                    </div>
                    <div className = "col-9 loginPage">
                      <div style = {{'position':'relative'}}>
                        <input style = {{'width':'100%'}} id = "inputUsername" onFocus = {inputShiftUpUser} type = "text" />
                        <span id = "emailStamp">Email</span>
                      </div>
                      <br />
                      <br />
                      <div style = {{'position':'relative'}}>
                        <input style = {{'width':'100%'}} id = "inputPassword" onFocus = {inputShiftUpPass} type = "password" />
                        <span id = "passwordStamp">Password</span>
                      </div>
                    </div>
                    <div className = "col-1"></div>
                </div>
                <br />
                <center>
                  <div className = "loginError">
                      Invalid Email or Password
                  </div>
                </center>
                <br />
                <div className = "row">
                    <div className = "col-3" />
                    <div className = "col-6">
                        <center>
                            <button className = "round" onClick = {this.loginButtonClick} >Sign In</button>
                            {this.state.loginSuccess?<Redirect to='/gallery' />:null}
                        </center>
                    </div>
                    <div className = "col-3"> </div>
                    
                </div>
            </div>
        </div>
      </div>        
    );
  }
}
