import React, {Component,Fragment} from 'react';
import {Col, Container, Row} from "react-bootstrap";
import imagePlaceholder from '../assets/images/imagePlaceholder.svg';
import * as faceapi from 'face-api.js';
import Loader from "./Loader";
import {Animated} from "react-animated-css";
import { CircularProgressbar  } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

class FaceMatching extends Component {

    constructor(props) {
        super(props);
        this.state = {
            FirstPhoto:imagePlaceholder,
            SecondPhoto:imagePlaceholder,
            FirstPhotoDes:[],
            SecondPhotoDes:[],
            similar:0,
            distance:0,
            loader:'d-none',
            fresult:''
        }
    }

    SecondPhotoClick=()=>{
        this.SecondPhoto.click();
    }

    FirstPhotoClick=()=>{
        this.FirstPhoto.click();
    }

    onFirstPhoto=()=>{
        let firstphoto = this.FirstPhoto.files[0];
        let reader = new FileReader();
        reader.onload = (e)=>{
            this.setState({FirstPhoto:e.target.result})
        }

        reader.readAsDataURL(firstphoto);
        this.onFirstPhotoDes()
    }

    onSecondPhoto=()=>{
        let secondphoto = this.SecondPhoto.files[0];
        let reader = new FileReader();
        reader.onload = (e)=>{
            this.setState({SecondPhoto:e.target.result})
        }

        reader.readAsDataURL(secondphoto);
        this.onSecondPhotoDes()
    }

    onFirstPhotoDes=()=>{
        (async ()=>{
            this.setState({loader:''})
            await faceapi.loadSsdMobilenetv1Model('models/');
            await faceapi.loadFaceLandmarkModel('models/');
            await faceapi.loadFaceRecognitionModel('models/');
            let firstimage=document.getElementById('FirstImage');
            let firstPhotoDes = await faceapi.detectSingleFace(firstimage).withFaceLandmarks().withFaceDescriptor();
            let calfirstPhoto = firstPhotoDes['descriptor']
            this.setState({FirstPhotoDes:calfirstPhoto})
            this.setState({loader:'d-none'})
            console.log(firstPhotoDes)
        })()
    }

    onSecondPhotoDes=()=>{
        (async ()=>{
            this.setState({loader:''})
            await faceapi.loadSsdMobilenetv1Model('models/');
            await faceapi.loadFaceLandmarkModel('models/');
            await faceapi.loadFaceRecognitionModel('models/');
            let secondimage=document.getElementById('SecondImage');
            let secondPhotoDes = await faceapi.detectSingleFace(secondimage).withFaceLandmarks().withFaceDescriptor();
            let calsecondPhoto = secondPhotoDes['descriptor']
            this.setState({SecondPhotoDes:calsecondPhoto})
            this.setState({loader:'d-none'})
            console.log(secondPhotoDes)
        })()
    }

    FaceMatchingResult=()=>{
        let firstPhotoDes = this.state.FirstPhotoDes;
        let secondPhotoDes = this.state.SecondPhotoDes;
        let distance = faceapi.euclideanDistance(firstPhotoDes,secondPhotoDes);
        this.setState({distance:distance})
        let similar = 1-distance;
        this.setState({similar:similar})

        if(similar>0.50)
        {
            this.setState({similar:similar})
            this.setState({fresult:'Pass'})
        }
        else {
            this.setState({distance:distance})
            this.setState({fresult:'Fail'})
        }
    }

    render() {
        return (
            <Fragment>
                <Container>
                    <Row className='shadow-sm p-3 mt-3 text-center'>
                            <Col md={4} lg={4} sm={4} className='bg-dark shadow-sm ml-3'>
                                <img id='FirstImage' src={this.state.FirstPhoto} alt='image' className='img-fluid'/>
                                <div className='bg-white mb-2 d-none'>
                                    <input onChange={this.onFirstPhoto} type='file' ref={(input)=>this.FirstPhoto=input}/>
                                </div>
                                <button onClick={this.FirstPhotoClick} className='btn btn-warning mb-2 btn-block'>Select image One</button>
                            </Col>

                            <Col md={4} lg={4} sm={4} className='bg-dark shadow-sm ml-3'>
                                <img id='SecondImage' src={this.state.SecondPhoto} alt='image' className='img-fluid'/>
                               <div className='bg-white mb-2 d-none'>
                                   <input onChange={this.onSecondPhoto} type='file' ref={(input)=>this.SecondPhoto=input}/>
                               </div>
                                <button onClick={this.SecondPhotoClick} className='btn btn-warning mb-2 btn-block'>Select image Two</button>
                            </Col>

                            <Col md={3} lg={3} sm={3} className='mt-5 pt-4'>
                                <div>
                                    <CircularProgressbar
                                        value={this.state.similar}
                                        text={`${(this.state.similar*100).toFixed(2)}%`}
                                        maxValue={1}
                                        styles={{
                                            path:{
                                                stroke:'#008000'
                                            }
                                        }}
                                    />
                                    <CircularProgressbar
                                        className='ml-2'
                                        value={this.state.distance}
                                        text={`${(this.state.distance*100).toFixed(2)}%`}
                                        maxValue={1}
                                        styles={{
                                            path:{
                                                stroke:'#FF0000'
                                            }
                                        }}
                                    />
                                </div>

                                <h5>Result: <strong>{this.state.fresult}</strong></h5>

                                <button onClick={this.FaceMatchingResult} className='btn btn-danger btn-outline-danger text-light mt-3'>Matching Ratio</button>
                            </Col>
                    </Row>
                </Container>
                <div className={this.state.loader}>
                    <Loader/>
                </div>
            </Fragment>
        );
    }
}

export default FaceMatching;