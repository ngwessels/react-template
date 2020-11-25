//React
import React from "react";

//Redux
import { connect } from 'react-redux';

//Styling
import { } from 'react-bootstrap';
import { css, keyframes } from 'emotion'; //CSS and Animations

//Functions
import f from '../functions';
//Constants
import c from '../constants'; //Constants used in redux

//components


class index extends React.Component {
  constructor() {
    super();
    this.state = {
    }
  }

  render() {
    return (
      <div>
        {this.props.ssrWorking ? (
          <div>
            {/* <h2> Deployment Successful of Nextjs Application with SSR on Firebase.</h2> */}
          </div>
        ) : (
            <h2>SSR not working</h2>
          )}
      </div>
    );
  }
}


const mapStateToProps = state => ({
});


export default connect(mapStateToProps)(index);

export async function getServerSideProps() {
  return { props: { ssrWorking: true } };
}

