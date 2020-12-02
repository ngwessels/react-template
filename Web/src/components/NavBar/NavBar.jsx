//react
import React from 'react';

//Redux
import { connect } from 'react-redux';

//firebase
import firebase from '../../config';

//constants or functions
import c from '../../constants';
import f from '../../functions';

//Styling
import { css, keyframes } from 'emotion';

//images
// import nateW from './../assets/img/natewessels.png';
// import nw from './../assets/img/nw.png';

//components
import NavBarTabs from './NavBarPages';




class NavBar extends React.Component {

  constructor({ match }) {
    super();
    this.state = {
      // activeImage: nw,
      contactButtonColor: '#616161'
    }
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }


  handleScroll = (e) => {
    const { pageYOffset } = window;
    const { active } = this.state;

    if (pageYOffset >= 500 && active === 0) {
      // this.setState({ activeImage: nw });
    } else if (pageYOffset < 500 && active === 1) {
      // this.setState({ activeImage: nw });
    }
  }

  render() {
    return (
      <div className={`${this.renderCSS()}`}>
        <div style={{ display: 'flex', justifyContent: 'center' }} >
        </div>
        <div className={'buttons'} >
          <div style={{ width: '10px', display: 'flex', alignItems: 'center' }}>
            {/* <img src={this.state.activeImage} style={{height: '40px', marginLeft: '30px'}}/> */}
          </div>
          <div className={'centerButtons'} >
            <NavBarTabs />
            <div style={{ width: '200px', height: '45px' }}><button onMouseOver={() => this.setState({ contactButtonColor: '#129BE9' })} onMouseLeave={() => this.setState({ contactButtonColor: '#616161' })}
              style={{ width: '100%', height: '100%', backgroundColor: this.state.contactButtonColor, color: 'white', borderWidth: '0px', cursor: 'pointer' }}><h2>Contact Me</h2></button></div>

          </div>
        </div>
      </div>
    )
  }

  renderCSS = () => {
    return css({
      '.buttons': {
        width: '100%',
        maxHeight: '45px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#616161',
      },

      '.centerButtons': {
        width: '90%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        height: '100%',
      }
    })
  }
}
function mapStateToProps(state) {
  return {
    projects: state.projects,
  }
}


export default connect(mapStateToProps)(NavBar)
const styles = {

}
