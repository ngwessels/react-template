import React from "react";

//Redux
import { connect } from 'react-redux';

//Styling
// import { } from 'react-bootstrap';
import { css, keyframes } from 'emotion'; //CSS and Animations
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
//Axios
import axios from 'axios';


//Functions
// import f from '../../functions';
//Constants
// import c from '../../constants'; //Constants used in redux

//components
// import './features.js';



class MyApp extends React.Component {
  constructor() {
    super();
    this.state = {
    }
  }

  UNSAFE_componentWillMount() {
  }

  componentDidMount() {
  }

  // github = () => {
  //     const object = {
  //         method: 'get',
  //         url: 'https://api.github.com/users/ngwessels/repos',
  //     };
  //     axios(object).then(res => {
  //         let projects = {}, languages = {}, languageLength = 0;
  //         if (res?.data) {
  //             for (let x in res.data) {
  //                 const project = res.data[x];
  //                 projects[project.id] = project
  //                 if (languages[project.language]) {
  //                     languages[project.language].push(project.id);
  //                 } else {
  //                     languages[project.language] = [project.id];
  //                     languageLength++;
  //                 }
  //             }
  //             const level1Height = 40 * languageLength;
  //             this.setState({ projects, languages, level1Height })
  //         }
  //     }).catch(err => {

  //     })
  // }


  render() {
    return (
      <div id={'githubNav'} className={`${this.renderCSS()}`}>
        <div className="primary-nav">

          <button href="#" className="hamburger open-panel nav-toggle" onClick={() => {
            document.querySelector('html').classList.toggle('openNav');
            document.querySelector('.nav-toggle').classList.toggle("active");
          }}>
            <span className="screen-reader-text">Menu</span>
          </button>

          <nav role="navigation" className="menu">

            <a href="#" className="logotype">LOGO<span>TYPE</span></a>

            <div className="overflow-container">

              <ul className="menu-dropdown">

                <li><a href="#">Dashboard</a><span className="icon"><i className="fa fa-dashboard"></i></span></li>

                <li className="menu-hasdropdown">
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                  </div>
                  <a href="#">Settings</a><span className="icon"><i className="fa fa-gear"></i></span>

                  <label title="toggle menu" htmlFor="settings">
                    <span className="downarrow" style={{ positon: 'absolute', width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}><div style={{ width: '70%' }} /><FontAwesomeIcon icon={faCaretDown} /></span>
                  </label>
                  <input type="checkbox" className="sub-menu-checkbox" id="settings" />
                  <ul className="sub-menu-dropdown">
                    <li><a href="">Profile</a></li>
                    <li><a href="">Security</a></li>
                    <li><a href="">Account</a></li>
                  </ul>
                </li>

                <li><a href="#">Favourites</a><span className="icon"><i className="fa fa-heart"></i></span></li>

                <li><a href="#">Messages</a><span className="icon"><i className="fa fa-envelope"></i></span></li>

              </ul>

            </div>

          </nav>

        </div>
      </div>
    )
  }

  renderCSS = () => {
    return css({
    })
  }
}

function mapStateToProps(state) { //Redux Props
  return {
  }
}

export default connect(mapStateToProps)(MyApp); //Connects Redux




