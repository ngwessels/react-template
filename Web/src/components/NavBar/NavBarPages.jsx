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

import arrow from './../../assets/imgs/arrow.png';

//images
// import nateW from './../assets/img/natewessels.png';
// import nw from './../assets/img/nw.png';

//components


class NavBarTabs extends React.Component {

  constructor() {
    super();
    this.state = {
      languages: [],
      currentLanguage: '',
      currentButton: 0,
      currentProject: '',
      betweenProjects: [0, 8],
      hoverProjects: '#616161',
      perPage: 9,
      rightArrow: '#616161',
      leftArrow: '#616161',
    }
  }

  componentDidMount() {
    fetch('https://api.github.com/users/ngwessels/repos?per_page=1000')
      .then(response => response.json())
      .then(data => {
        let { dispatch } = this.props
        let action = {
          type: c.PROJECTS,
          results: data
        }
        dispatch(action)
        const length = data.length
        for (let x = 0; x < length; x++) {
          const currentLanguages = this.state.languages.length;
          let isNewLanguage = true
          for (let i = 0; i < currentLanguages; i++) {
            if (data[x].language == this.state.languages[i].value) {
              isNewLanguage = false;
            }
          }
          if (isNewLanguage == true) {
            let languages = this.state.languages;
            languages.push({ value: data[x].language, label: data[x].language })
            this.setState(prevState => ({
              languages: languages
            }))
          }
        }
      });
  }

  buttonColor = (e) => {
    if (e.label == this.state.currentLanguage) {
      return '#129BE9';
    } else {
      return '#616161'
    }
  }

  projectColor = (e) => {
    if (e == this.state.currentProject.name) {
      return '#129BE9';
    } else {
      return '#616161';
    }
  }

  adjustBetween = (e) => {
    this.setState({ currentProject: '' })
    if (e == 'decrease') {
      let min = this.state.betweenProjects[0] - (this.state.perPage);
      let max = this.state.betweenProjects[1] - (this.state.perPage);
      if (min <= 1) {
        min = 1;
        max = this.state.perPage
      }
      this.setState({ betweenProjects: [min, max] })
    } else {
      let min = this.state.betweenProjects[0] + this.state.perPage;
      let max = this.state.betweenProjects[1] + this.state.perPage;
      this.setState({ betweenProjects: [min, max] })
    }
  }

  displayArrow = (e) => {
    let length = 0;
    let x = 0;
    const projects = this.props.projects;
    const cLanguage = this.state.currentLanguage;
    for (x in projects) {
      if (cLanguage == projects[x].language) {
        length++;
      }
    }
    const min = this.state.betweenProjects[0];
    const max = this.state.betweenProjects[1];
    if (e == 'increase') {
      if (this.state.perPage + min > length) {
        return 'none'
      } else {
        return 'block'
      }
    } else if (e == 'decrease') {
      if (min == 1) {
        return 'none'
      } else {
        return 'block'
      }
    }
  }


  spacerHeight = () => {
    const cLanguage = this.state.currentLanguage;
    const projects = this.props.projects;
    let length = 0;
    let x = 0;
    for (x in projects) {
      if (cLanguage == projects[x].language) {
        length++;
      }
    }
    const spaceHeight = this.state.currentButton * 37;
    if (length <= this.state.perPage) {
      return <div style={{ width: '100%', height: spaceHeight }} />
    } else {
      return (
        <div style={{ width: '100%', height: spaceHeight, backgroundColor: 'transparent', display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: spaceHeight - 45 }} />
          <div style={{ width: '100%', height: 45, backgroundColor: '#616161', position: 'absolute', marginLeft: 100, zIndex: -1 }} />
          <div style={{ width: '100%', height: '45px', display: 'flex', flexDirection: 'row', zIndex: 1000 }}>
            <button onMouseOver={() => this.setState({ leftArrow: '#129BE9' })}
              onMouseLeave={() => this.setState({ leftArrow: '#616161' })}
              style={{ backgroundColor: this.state.leftArrow, display: this.displayArrow('decrease'), zIndex: 1000, float: 'left', width: '50%' }} onClick={() => this.adjustBetween('decrease')}><img style={{ width: '30px', height: '20px', marginTop: '12px', backgroundColor: 'transparent' }} src={arrow} />
            </button>
            <button onMouseOver={() => this.setState({ rightArrow: '#129BE9' })}
              onMouseLeave={() => this.setState({ rightArrow: '#616161' })}
              style={{ display: this.displayArrow('increase'), backgroundColor: this.state.rightArrow, zIndex: 1000, float: 'right', width: '50%' }} onClick={() => this.adjustBetween('increase')}><img style={{ width: '30px', height: '20px', marginTop: '12px', transform: 'rotate(180deg)', backgroundColor: 'transparent' }} src={arrow} />
            </button>
          </div>
        </div>
      )
    }
  }


  hasLivePage = () => {
    if (this.state.currentProject.has_pages == true) {
      const cLanguage = this.state.currentLanguage;
      const projects = this.props.projects;
      let height = this.state.currentButton * 37;
      let x = 0;
      let length = 0;
      let totalPages = 0;
      for (x in this.props.projects) {
        if (cLanguage == projects[x].language) {
          if (this.props.projects[x].name == this.state.currentProject.name) {
            const pages = (this.state.betweenProjects[0] / this.state.perPage) * (37 * (this.state.perPage + 1))
            height = height + (length * 37)
            break;
          }
          length++;
          if (length == this.state.perPage) {
            length = 0;
            totalPages++;
          }
        }
      }
      return (
        <div>
          <div style={{ width: '200px', height: `${height}px` }} />
          <button onClick={() => this.openNewWindow(this.state.currentProject.name)} className={'projects-livecontent-button'}><h3>Visit Website</h3></button>
        </div>
      )
    } else {
      return null;
    }
  }


  openNewWindow = (e) => {
    window.open(
      `https://ngwessels.github.io/${e}/`,
      '_blank'
    );
  }

  openGithubProject = (e) => {
    window.open(
      `${e}`,
      '_blank'
    );
  }

  render() {
    let projectsInfo = [];
    let isLong = false
    return (
      <div className={`${this.renderCSS()}`}>
        <div className={'dropdown'} onMouseOver={() => this.setState({ hoverProjects: '#129BE9' })} onMouseLeave={() => this.setState({ hoverProjects: '#616161' })}><button onMouseOver={() => this.setState({ currentLanguage: '', currentProject: '' })} style={{ width: '200px', height: '45px', backgroundColor: this.state.hoverProjects, borderWidth: '0px' }}><h2 style={{ color: 'white' }}>Projects</h2></button>
          <div className={'dropdown-content'}>
            {this.state.languages.map((item, index) => {
              return (
                <div className={'languages'} key={'Languages' + index} onMouseOver={() => { this.setState({ currentLanguage: item.value, currentButton: index, betweenProjects: [1, this.state.perPage], currentProject: '' }) }}>
                  <button className={'button-languages'} title={item.label}
                    style={{ backgroundColor: this.buttonColor(item) }}
                  ><h3 style={{ fontColor: 'white' }}>{item.label}</h3></button>
                </div>
              )
            })}
            <div className={'projects-content'}>
              {this.spacerHeight()}
              {this.props.projects.map((item, index) => {
                if (item.language == this.state.currentLanguage) {
                  projectsInfo.push({ name: item.name, language: item.language })
                  if (projectsInfo.length >= this.state.betweenProjects[0] && projectsInfo.length <= this.state.betweenProjects[1]) {
                    isLong = true;
                    return (
                      <button className={'project-links'} style={{ backgroundColor: this.projectColor(item.name) }} onMouseOver={() => this.setState({ currentProject: item })}
                        onClick={() => {
                          this.openGithubProject(item.html_url)
                        }
                        }
                        key={'Projects' + index}><h3>{item.name}</h3></button>
                    )
                  }
                }
              })}
            </div>
            <div className={'projects-livecontent'}>
              {this.hasLivePage()}
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderCSS = () => {
    const animation = keyframes({
      from: {
        top: 46,
        marginTop: 100
      },
      to: {
        top: 46,
        marginTop: 0
      }
    })

    const buttonAnimation = keyframes({
      from: {
        width: '100%',
        height: 0,
      },
      to: {
        width: '100%',
        height: 0,
      }
    })

    const textAnimation = keyframes({
      from: {
        color: 'transparent'
      },
      to: {
        color: 'white'
      }
    })

    const liveContent = keyframes({
      from: {
        marginLeft: 200,
      },
      to: {
        marginLeft: 0
      }
    })

    const projectContent = keyframes({
      from: {
        marginLeft: 300,
        width: '100%',
        height: 0,
      },
      to: {
        marginLeft: 100,
        width: '100%',
        height: 0,
      }
    })

    return css({
      '.dropdown-content': {
        display: 'none',
        minWidth: 200,
        height: 0,
        zIndex: 10000000,
      },
      '.dropdown': {
        display: 'inline-block',
        zIndex: 1,
        minWidth: 200,
      },
      '.dropdown:hover': {
        zIndex: 1,
        minWidth: 200,
        '.dropdown-content': {
          display: 'flex',
          flexDirection: 'column',
          animation: `${animation} 0.7s`,
          '.languages': {
            animation: `${buttonAnimation} 0.7s forwards`,
            minHeight: 37,
            '.button-languages': {
              minHeight: 37
            },

            'button': {
              animation: `${buttonAnimation} 0.7s forwards`,
              'h3': {
                animationDelay: '1s',
                animation: `${textAnimation} 1s forwards`,
              }
            }
          }
        }
      },
      '.languages:hover': {
        minWidth: 200,
      },
      '.projects-livecontent-button': {
        width: 200,
        height: 37,
        cursor: 'pointer',
        animation: `${liveContent} 0.6s forwards`,
        backgroundColor: '#616161',
        color: 'white',
      },
      '.projects-livecontent-button:hover': {
        backgroundColor: '#129BE9',
      },
      '.projects-livecontent': {
        position: 'absolute',
        width: 200,
        height: 45,
        marginLeft: 400,
      },
      '.projects-content': {
        position: 'absolute',
        marginLeft: 200,
        maxWidth: 200,
        animation: `${projectContent} 0.7s forwards`,
        '.project-links': {
          minHeight: 37
        },
        'button': {
          cursor: 'pointer',
          width: '100%',
          animation: `${projectContent} 0.7s forwards`,
          'h3': {
            animationDelay: `1s`,
            animation: `${textAnimation} 1s forwards`,
          }
        }
      },
      'h3': {
        // fontFamily: "'Shadows Into Light Two', cursive",
      }
    })
  }
}
function mapStateToProps(state) {
  return {
    projects: state.projects,
  }
}


export default connect(mapStateToProps)(NavBarTabs)
