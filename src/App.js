import React,{ Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link} from "react-router-dom";
import { Redirect } from 'react-router-dom';
//import { Redirect } from 'react-router';
import "bootstrap/dist/css/bootstrap.min.css";

import GalleryPage from "./components/galleryPage.component.jsx";
import LoginPage from "./components/loginPage.component.jsx";
import UploadImage from "./components/uploadImage.component.jsx";
import ImageView from "./components/imageView.component.jsx";
//import logo from './logo.svg';
//<Route path= "/" exact component = {LoginPage}></Route>
//<Route path= "/gallery" exact component = {GalleryPage}></Route>
//<Route path= "/uploadimage" exact component = {uploadImage}></Route>
//const server = "http://localhost:4000/cloudgal/";
const server = "http://192.168.137.1:4000/cloudgal/";

function App() {

  return (
    <Router>          
        
          <Redirect exact from="/" to="login" />
          <Route path= "/login" 
          render={(routeProps) => (
          <LoginPage serverLink = {server} />)} />
          
          <Route path= "/gallery" 
          render={(routeProps) => (
          <GalleryPage serverLink ={server} />)} />

          <Route path= "/uploadimage" 
            render={(routeProps) => (
            <UploadImage serverLink ={server} />)} />
      <Route path= "/imageview" 
            render={(routeProps) => (
            <ImageView serverLink ={server} />)} />
    </Router>
  );
}

export default App;
