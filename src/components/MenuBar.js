import React, {Component} from 'react';
import {Navbar} from "react-bootstrap";
import navlogo from '../assets/images/navlogo.svg'
class MenuBar extends Component {
    render() {
        return (
            <div>
                <Navbar className="sticky-top" bg="light">
                    <Navbar.Brand ><img className="nav-logo" src={navlogo}/></Navbar.Brand>
                </Navbar>
            </div>
        );
    }
}

export default MenuBar;