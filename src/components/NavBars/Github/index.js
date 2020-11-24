import React from "react";

//Redux
import { connect } from 'react-redux';

//Styling
import { } from 'react-bootstrap';
import { css, keyframes } from 'emotion'; //CSS and Animations

//Axios
import axios from 'axios';

import Dropdown from './File/index';

//Functions
// import f from '../../functions';
//Constants
// import c from '../../constants'; //Constants used in redux

//components



class MyApp extends React.Component {
    constructor() {
        super();
        this.state = {
            projects: {},
            languages: {},
            level1: 'none',
            level1Height: 0,
            level2: 'none',
        }
    }

    UNSAFE_componentWillMount() {
        this.github();
    }

    componentDidMount() {
    }

    github = () => {
        const object = {
            method: 'get',
            url: 'https://api.github.com/users/ngwessels/repos',
        };
        axios(object).then(res => {
            let projects = {}, languages = {}, languageLength = 0;
            if (res?.data) {
                for (let x in res.data) {
                    const project = res.data[x];
                    projects[project.id] = project
                    if (languages[project.language]) {
                        languages[project.language].push(project.id);
                    } else {
                        languages[project.language] = [project.id];
                        languageLength++;
                    }
                }
                const level1Height = 40 * languageLength;
                this.setState({ projects, languages, level1Height })
            }
        }).catch(err => {

        })
    }


    render() {
        return (
            <div id={'githubNav'} className={`${this.renderCSS()}`}>
                <Dropdown
                    title='Projects'
                    position={'left'}
                    buttonClassName={'buttonStyle'}
                >
                    {Object.keys(this.state.languages).map(language => {
                        return (
                            <div key={`Language-${language}`}>
                                <Dropdown.Item className={'language'}>
                                    {language}
                                    <Dropdown.Submenu>
                                        {this.state.languages[language].map((item, index) => {
                                            const project = this.state.projects[item];
                                            const openGithubRepo = () => {
                                                window.open(project.svn_url, "_blank");
                                            }
                                            const openGithubPages = () => {
                                                window.open(`https://ngwessels.github.io/${project.name}/`, "_blank");
                                            }
                                            if (project.has_pages) {
                                                return (
                                                    <div key={`Language-${language}-Project-${item}`} style={{ cursor: 'pointer' }}>
                                                        <Dropdown.Item onClick={openGithubRepo}>
                                                            {project.name}
                                                            <Dropdown.Submenu>
                                                                <Dropdown.Item onClick={openGithubPages}>View Live Example</Dropdown.Item>
                                                            </Dropdown.Submenu>
                                                        </Dropdown.Item>
                                                    </div>

                                                )
                                            } else {
                                                return (
                                                    <div style={{ cursor: 'pointer' }} key={`Language-${language}-Project-${item}`}>
                                                        <Dropdown.Item onClick={openGithubRepo}>{project.name}</Dropdown.Item>
                                                    </div>

                                                )
                                            }

                                        })}
                                    </Dropdown.Submenu>
                                </Dropdown.Item>
                            </div>

                        )
                    })}
                    {/* <Dropdown.Item onClick={() => alert('is called')}>Item 1</Dropdown.Item>
                    <Dropdown.Item>
                        Item 2
                        <Dropdown.Submenu>
                            <Dropdown.Item>Subitem 1</Dropdown.Item>
                            <Dropdown.Item>Subitem 2</Dropdown.Item>
                        </Dropdown.Submenu>
                    </Dropdown.Item>
                    <Dropdown.Item>Item 3</Dropdown.Item> */}
                </Dropdown>
            </div>
        )
    }

    renderCSS = () => {
        return css({
            marginLeft: 400,
            '.buttonStyle': {
                backgroundColor: 'red'
            }
        })
    }
}

function mapStateToProps(state) { //Redux Props
    return {
    }
}

export default connect(mapStateToProps)(MyApp); //Connects Redux