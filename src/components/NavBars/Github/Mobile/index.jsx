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

//jQuery
import $ from "jquery";


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
    function extend(a, b) {
      for (var key in b) {
        if (b.hasOwnProperty(key)) {
          a[key] = b[key];
        }
      }
      return a;
    }

    toggleNav("nav", ".hamburger");
    //toggleLevels("nav");
    //backNav();
    //checkNavLevel();

    var nav = $("nav");
    var main = $("#main")
    var navTranslate = 40;
    var mainPosition = $("nav").width();
    var navPosition = 0;



    function backNav() {
      $(".back").on("click", function () {
        //var submenu = $(this).closest("div.submenu");
        //var navOverlay = $(this).closest(".nav-overlay.nav-covered");

        //navOverlay.toggleClass("nav-overlay nav-covered")

        //mainPosition = mainPosition - navTranslate;
        //navPosition  = navPosition - navTranslate;

        //$(main).css("transform", 'translate3d(-' + mainPosition + 'px,0,0)');
        //$(nav).css("transform", 'translate3d(-' + navPosition + 'px,0,0)');

        //(submenu.hasClass('open')) ? submenu.toggleClass("open") : console.log("");
      });
    }
    function toggleNav(navClass, hamburgerClass) {

      $(hamburgerClass).on("click", function () {
        //$(this).toggleClass("is-active");
        $(navClass).toggleClass("open");

        if (!$(navClass).hasClass('open')) {
          $(navClass).css("transform", 'translateX(300px)');
          $("#main").css("transform", 'translateX(0)');
          resetNav();
        } else {
          $(navClass).css("transform", 'translateX(0)');
          $("#main").css("transform", 'translateX(-300px)');
        }
        $("#main").toggleClass("nav-open")
      })
    }
    function toggleLevels(nav) {

      $(nav).on('click', function (event) {
        var $target = event.target;

        if (!isNaN($($target).data('level'))) {
          console.log(navPosition)
          if ($($target).data('level') === 1) {
            navPosition = 40;

            $($target).toggleClass('nav-overlay nav-covered');
            $($target).find("div.submenu").toggleClass('open');

            $(nav).css("transform", 'translate3d(0px,0,0)');
            $(main).css("transform", 'translateX(-300px)');

            resetNav();

          } else {
            navPosition = navPosition - navTranslate;
            mainPosition = mainPosition - navTranslate;
            $(nav).css("transform", 'translate3d(-' + navPosition + 'px,0,0)');
            $(main).css("transform", 'translate3d(-' + mainPosition + 'px,0,0)');

            $($target).toggleClass('nav-overlay nav-covered');
            $($target).find("div.submenu").toggleClass('open');
          }


        };

      })

    }
    function resetNav() {
      mainPosition = $('nav').width();
      navPosition = 0;
      $(".nav-overlay").removeClass("nav-overlay");
      $(".submenu").removeClass("open");
    };
    function checkNavLevel() {
      $("a[href$='#']").on("click", function () {

        var navLevel = $(this).closest("div.nav-level");

        if ($(this).next().hasClass("submenu")) {
          $(this).next().toggleClass("open");

          navLevel.toggleClass("nav-overlay nav-covered");

          mainPosition = mainPosition + navTranslate;
          navPosition = navPosition + navTranslate;

          $(main).css("transform", 'translate3d(-' + mainPosition + 'px,0,0)');
          $(nav).css("transform", 'translate3d(-' + navPosition + 'px,0,0)');
        }

      });
    }

    function sideMenu(el, main, trigger, options) {
      this.el = el;
      this.main = main;
      this.trigger = trigger;
      this.options = extend(this.defaults, options);
      this._init();
    }

    sideMenu.prototype = {
      defaults: {
        backClass: '.back',
        navLevel: '.nav-level'
      },
      _init: function () {
        var self = this;
        this.level = 1;
        this.menuOpen = false;
        this.navTranslate = 40;
        this.navPosition = 0;
        this.navWidth = $(this.el).width();

        this._openMenu();
        this._toggleLevels();
        this._toggleBack();
        this._setLevels(this.defaults.navLevel);

      },
      _toggleLevels: function () {
        let self = this;

        $("a[href$='#']").on("click", function () {
          let navLevel = $(this).closest("div.nav-level");

          if ($(this).next().hasClass("submenu")) {

            $(this).next().toggleClass("open");

            navLevel.toggleClass("nav-overlay nav-covered");

            self.navWidth = self.navWidth + self.navTranslate;
            self.navPosition = self.navPosition + self.navTranslate;

            self._transform(self.navWidth, self.main);
            self._transform(self.navPosition, self.el);

          }
        });
      },
      _toggleBack: function () {

        let self = this,
          back = $(self.defaults.backClass);

        back.on("click", function () {
          let navLevel = $(this).closest(self.defaults.navLevel),
            navOverlay = $(this).closest(".nav-overlay.nav-covered");
          navOverlay.toggleClass("nav-overlay nav-covered");

          self.navWidth = self.navWidth - self.navTranslate;
          self.navPosition = self.navPosition - self.navTranslate;

          self._transform(self.navWidth, self.main);
          self._transform(self.navPosition, self.el);

          (navLevel.hasClass('open')) ? navLevel.toggleClass("open") : null;

        });
      },
      _transform: function (value, selector) {
        $(selector).css("transform", 'translate3d(-' + value + 'px,0,0)');
      },
      _openMenu: function () {
        var self = this;
        $(self.trigger).on("click", function () {
          $(self.trigger).toggleClass("is-active");

          if ($(self.trigger).hasClass("is-active")) {
            self.menuOpen = true;
            self._resetMenu();
          } else {
            self.menuOpen = false;
            self.level = 0;
          };
        });
      },
      _resetMenu: function () {

        this.navWidth = $(this.el).width();
        this.navPosition = 0;
        $(".nav-overlay").removeClass("nav-overlay");
        $(".submenu").removeClass("open");

      },
      _setLevels: function (navLevel) {
        $(navLevel).each(function (i) {
          $(this).attr("data-level", (i + 1));
        });
      }
    }

    new sideMenu("nav", "#main", ".hamburger");
  }


  render() {
    return (
      <div>
        <nav>
          <div className="nav-level">
            <div className="nav-header">
              <h3></h3>
            </div>
            <ul>
              <li>
                <a href="#" className={'back-icon'}>Projects</a>
                <div className="submenu nav-level">
                  <div className="nav-header">
                    <h3>Projects</h3>
                  </div>
                  <ul>
                    {Object.keys(this.props.languages).map(language => {
                      const list = this.props.languages[language];
                      return (
                        <li key={language}>
                          <a href="#" className="back-icon">{language}</a>
                          <div className="submenu nav-level">
                            <div className="nav-header">
                              <h3>{language}</h3>
                            </div>
                            <ul>
                              {list.map((item, index) => {
                                const project = this.props.projects[item];
                                const openGithubRepo = () => {
                                  window.open(project.svn_url, "_blank");
                                }
                                const openGithubPages = () => {
                                  window.open(`https://ngwessels.github.io/${project.name}/`, "_blank");
                                }
                                if (project.has_pages) {
                                  return (
                                    <li key={item}>
                                      <a href="#" className="back-icon" style={{ margin: 0, marginTop: 10, display: 'flex', alignItems: 'center', textAlign: 'left' }}>{project.name}</a>
                                      <div className="submenu nav-level">
                                        <div className="nav-header">
                                        </div>
                                        <ul>
                                          <li onClick={openGithubRepo} style={{ margin: 0, marginTop: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><a href="#" style={{ margin: 0, display: 'flex', width: '100%' }}><p style={{ margin: 0, textAlign: 'left' }}>View Github Repo</p></a></li>
                                          <li onClick={openGithubPages} style={{ margin: 0, marginTop: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><a href="#" style={{ margin: 0, display: 'flex', width: '100%' }}><p style={{ margin: 0, textAlign: 'left' }}>View Live Example</p></a></li>
                                        </ul>
                                        <div className="back back-icon">Back</div>
                                      </div>
                                    </li>
                                  )
                                } else {
                                  return (
                                    <li key={item} style={{ margin: 0, marginTop: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={openGithubRepo}><a href="#" className="back-icon" style={{ margin: 0, display: 'flex', width: '100%' }}><p style={{ margin: 0, textAlign: 'left' }}>{project.name}</p></a></li>
                                  )
                                }
                              })}
                            </ul>
                            <div className="back back-icon">Back</div>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                  <div className="back back-icon">Back</div>
                </div>
              </li>
            </ul>
          </div>
        </nav>

        <div className="hamburger hamburger--squeeze" type="button" id="hamburger">
          <span className="hamburger-box">
            <span className="hamburger-inner"></span>
          </span>
        </div>
        <div id="main">
          <section>
            <div className="row">
              <div className="col s6">
                <div className="logo">
                  <a className="logo-brand" href="#"></a>
                </div>
              </div>
              <div className="col s6">

              </div>
            </div>
          </section>
          <section>
            <div className="hero-view">
              <div className="hero-view__content">
                <h1>Multi Level Side Menu</h1>
              </div>
              <div className="hero-view__image"></div>
              <div className="hero-view__overlay"></div>

            </div>
          </section>


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




