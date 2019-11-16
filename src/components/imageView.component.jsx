import React from 'react';
import '../App.css';
import axios from 'axios';


export default class ImageView extends React.Component {
  constructor(props) {
        super(props);
        this.state ={
            file: null,
            img: "https://dummyimage.com/600x400/000/fff",
        };
      
  }
    arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => binary += String.fromCharCode(b));
    return window.btoa(binary);
    };
    
    componentDidMount() {
        console.log('Teddy');
        axios.get(this.props.serverLink+'/imagereturn')
            .then(response => {
                var data = response.data;
                var contentType = data.img.contentType;
                var base64Flag = 'data:'+contentType+';base64,';
                var imageStr = this.arrayBufferToBase64(data.img.data.data);
                this.setState({img: base64Flag + imageStr});
            })
            .catch(function (error) {
               //console.log(error);
            })
    }
    
    render() {
        return (
            <div>
                <img id="imgReturnPreview" src = {this.state.img} style={{'width':'100%'}}></img>
            </div>
            
        )
    }
}
