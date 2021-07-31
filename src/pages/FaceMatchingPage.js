import React, {Component} from 'react';
import MenuBar from "../components/MenuBar";
import FaceMatching from "../components/FaceMatching";

class FaceMatchingPage extends Component {
    render() {
        return (
            <div>
                <MenuBar/>
                <FaceMatching/>
            </div>
        );
    }
}

export default FaceMatchingPage;