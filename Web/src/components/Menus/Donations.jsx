import React, { Component } from "react";
import {
    MDBContainer, MDBCol, MDBRow, MDBCard, MDBCardBody, MDBBtn, MDBNav, MDBNavItem, MDBNavLink, MDBTabPane,
    MDBTabContent, MDBSelect, MDBSelectInput, MDBSelectOption, MDBSelectOptions
} from "mdbreact";
import { Spinner, Accordion, Card, Button, Form, FormControl, Col, InputGroup } from 'react-bootstrap';

//Redux
import { connect } from 'react-redux';

//firebase
import firebase from '../../config';


//constants or functions
import c from '../../constants';
import f from '../../functions';

//uuid
import { v4 as uuid } from 'uuid';

//stripe
import StripeCheckout from 'react-stripe-checkout';

//Website Status
const { applicationStatus } = require('../../../server/applicationStatus');

//react-router
import { Switch, Route, withRouter } from 'react-router-dom';
import { css } from "emotion";

//Phone Input
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

//Components
import CloseButton from '../Animations/CloseButton';

class Donations extends React.Component {
    constructor() {
        super();
        this.state = {
            activePill: "1",
            fName: '',
            lName: '',
            email: '',
            phone: '',
            street: '',
            street2: '',
            city: '',
            country: 'US',
            state: '',
            zip: '',
            allStates: ['', 'Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Federated States of Micronesia', 'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Island', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'],
            required: true,
            tax: 0,
            rates: {},
            rate: null,
            nextStepButtonDisabled: false,
            defaultActiveKey: '1',
            removedUser: false,
            donationId: uuid(),
            amount: 0
        }
    }

    componentDidMount() {
    }


    formSwitch = (e) => {
        e.preventDefault();
        if (this.state.defaultActiveKey === '0') {
            //New Address
            this.submitNewAddress();
        } else {
            //Saved Address
            this.orderStepOne();
        }
    }


    togglePills = tab => {
        if (tab === "1") {
            this.setState({ rateId: null })
        }
        if (this.state.activePill !== tab && tab < this.state.activePill) {
            this.setState({
                activePill: tab
            });
        }
        if (tab === "2" && this.props.user?.cart && this.props.user?.cart?.pendingOrder?.type === 'Pickup') {
            this.setState({ activePill: '1' })
        }
    }

    selectNextTab = () => {
        this.setState({
            activePill: (+this.state.activePill + 1).toString()
        });
    }

    orderStepOne = (e) => {
        e.preventDefault();
        const s = this.state;
        const address = {
            name: `${s.fName} ${s.lName}`,
            street1: s.street,
            street2: s.street2,
            city: s.city,
            state: s.state,
            zip: s.zip,
            country: 'USA',
        }
        this.setState({ nextStepButtonDisabled: true })
        f.Api(this.props, 'post', `users/orders/donation/create/`, true, { email: firebase.auth()?.currentUser?.email || this.state.email, address, phone: this.state.phone }, (e) => {
            this.setState({ nextStepButtonDisabled: false })
            if (e) {
                this.setState({ activePill: '3' })
            }
        });
    }




    onToken = (token) => {
        this.setState({ nextStepButtonDisabled: true })
        const s = this.state;
        const address = {
            fName: s.fName,
            lName: s.lName,
            street1: s.street,
            street2: s.street2,
            city: s.city,
            state: s.state,
            zip: s.zip,
            country: 'USA',
        }
        if (this.state.street2) address.street2 = this.state.street2;
        f.Api(this.props, 'post', 'users/orders/donations/stripeDonationPayment', true, { stripeToken: token.id, email: firebase.auth()?.currentUser?.email || this.state.email, address, amount: this.state.amount, phone: this.state.phone }, (e) => {
            if (e) {
                this.closeMenu();
            }
            this.setState({ nextStepButtonDisabled: false })
        })
    }

    closeMenu = () => {
        const action = {
            type: c.MENU_REMOVE,
        };
        f.reduxDispatch(this.props, action);
    }


    render() {
        let cart = {};
        if (this.props.user?.cart && this.props.user?.cart['current-cart']) cart = this.props.user.cart['current-cart'];
        const { activePill } = this.state;


        //Determins which api key to use for stripe
        let liveKey = process.env.REACT_APP_stripe_payments_live, testKey = process.env.REACT_APP_stripe_payments;
        let key = liveKey;
        if (applicationStatus !== 'Live') key = testKey;

        //If Email is required
        let emailRequired = true;
        if (firebase.auth()?.currentUser?.email) emailRequired = false;
        let amounts = [5, 10, 15, 20, 50, 100, NaN];

        return (
            <div className={`${this.renderCSS()}`}>
                <div style={{ width: '100%', height: '100%', backgroundColor: 'transparent', zIndex: -1, position: 'absolute' }} onClick={() => this.closeMenu()} />
                <MDBContainer>
                    <MDBRow className="my-2" center>
                        <MDBCard className="w-100">
                            <MDBCardBody>
                                <MDBRow>
                                    <MDBCol lg="8" className="mb-4">
                                        <CloseButton callback={this.closeMenu} />
                                        <MDBNav pills color="primary" className="nav-justified">
                                            <MDBNavItem>
                                                <MDBNavLink to="#" className={activePill === "1" ? "active" : ""} onClick={() => {
                                                    this.togglePills("1")
                                                    this.setState({ shippingTotal: 0, rate: null, shippingId: '' })
                                                }}
                                                >
                                                    <strong>1. Amount</strong>
                                                </MDBNavLink>
                                            </MDBNavItem>
                                            <MDBNavItem>
                                                <MDBNavLink to="#" className={activePill === "2" ? "active" : ""}
                                                >
                                                    <strong>2. Billing</strong>
                                                </MDBNavLink>
                                            </MDBNavItem>
                                            <MDBNavItem>
                                                <MDBNavLink to="#" className={activePill === "2" ? "active" : ""}
                                                >
                                                    <strong>3. Payment</strong>
                                                </MDBNavLink>
                                            </MDBNavItem>
                                        </MDBNav>
                                        <MDBTabContent className="pt-4" activeItem={activePill}>
                                            <MDBTabPane tabId="1">
                                                <Card>
                                                    <Card.Body>
                                                        <div className={'savedDonations'}>
                                                            {amounts.map((item, index) => {
                                                                let isSelected = 'white';
                                                                if (index === this.state.selected) {
                                                                    isSelected = '#4184F3'
                                                                }
                                                                if (item) {
                                                                    return (
                                                                        <div key={`Donation-${index}`} className={'donationContainer'} onClick={() => this.setState({ selected: index, amount: parseFloat((item).toFixed(2)) })}>
                                                                            <div className={'borderTop'} />
                                                                            <div className={'secondContainer'}>
                                                                                <div className={'donationButtonContainer'}>
                                                                                    <div className={'donationButton'} style={{ backgroundColor: isSelected }} />
                                                                                </div>
                                                                                <div className={'donation'}>
                                                                                    <div className={'topAddress'}>
                                                                                        <h5>${(item).toFixed(2)}</h5>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className={'borderBottom'} />
                                                                        </div>
                                                                    )
                                                                } else {
                                                                    return (
                                                                        <div key={`Donation-${index}`} className={'donationContainer'} onClick={() => this.setState({ selected: index })}>
                                                                            <div className={'borderTop'} />
                                                                            <div className={'secondContainer'}>
                                                                                <div className={'donationButtonContainer'}>
                                                                                    <div className={'donationButton'} style={{ backgroundColor: isSelected }} />
                                                                                </div>
                                                                                <div className={'donation'} style={{ marginTop: 14, marginLeft: 7 }}>
                                                                                    <InputGroup className="mb-3 donation" >
                                                                                        <InputGroup.Prepend>
                                                                                            <InputGroup.Text id="basic-addon1">$</InputGroup.Text>
                                                                                        </InputGroup.Prepend>
                                                                                        <FormControl
                                                                                            placeholder="Custom Amount"
                                                                                            type={'number'}
                                                                                            onChange={(e) => {
                                                                                                let amount = 0;
                                                                                                if (e.target.value) amount = parseFloat(e.target.value);
                                                                                                this.setState({ amount })
                                                                                            }}
                                                                                        />
                                                                                    </InputGroup>
                                                                                </div>
                                                                            </div>
                                                                            <div className={'borderBottom'} />
                                                                        </div>
                                                                    )
                                                                }
                                                            })}
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                                <div className={'nextStepButton'}>
                                                    <MDBBtn style={{ zIndex: 100, width: '100%' }} color="primary" onClick={() => { this.setState({ activePill: '2' }) }} disabled={this.state.nextStepButtonDisabled}>
                                                        <div className={'nextStepButtonAnimation'}>
                                                            <Spinner
                                                                as="span"
                                                                animation="grow"
                                                                size="sm"
                                                                role="status"
                                                                aria-hidden="true"
                                                            />
                                                                Loading...
                                                            </div>
                                                        <div className={'nextStepButtonText'}>
                                                            Next Step
                                                            </div>
                                                    </MDBBtn>

                                                </div>

                                            </MDBTabPane>
                                            <MDBTabPane tabId="2">
                                                <form onSubmit={this.orderStepOne}>
                                                    <MDBRow>
                                                        <MDBCol>
                                                            <label htmlFor="email">Email</label>
                                                            <input type="email" id="email" className="form-control mb-4" placeholder={firebase.auth()?.currentUser?.email || 'youremail@example.com'} required={true} disabled={!emailRequired} onChange={(e) => {
                                                                this.setState({ email: e.target.value })
                                                            }} />
                                                            <label htmlFor="phone">Phone</label>
                                                            <div className={'phone'}>
                                                                <PhoneInput type="tel" id="phone" containerClass={'phone'} required={true}
                                                                    country={'us'}
                                                                    value={this.state.phone}
                                                                    onChange={phone => this.setState({ phone })}
                                                                />
                                                            </div>

                                                            <MDBRow>
                                                                <MDBCol md="6" className="mb-4">
                                                                    <label htmlFor="firstName">First name</label>
                                                                    <input type="fName" id="firstName" className="form-control" value={this.state.fName} placeholder={'John'} required={true} onChange={(e) => {
                                                                        this.setState({ fName: e.target.value })
                                                                    }} />
                                                                </MDBCol>
                                                                <MDBCol md="6" className="mb-2">
                                                                    <label htmlFor="lastName">Last name</label>
                                                                    <input type="lName" id="lastName" className="form-control" value={this.state.lName} placeholder={'Smith'} required={true} onChange={(e) => {
                                                                        this.setState({ lName: e.target.value })
                                                                    }} />
                                                                </MDBCol>
                                                            </MDBRow>

                                                            <label style={{ display: this.state.shipping }} htmlFor="address">Address</label>
                                                            <input style={{ display: this.state.shipping, zIndex: 100 }} type="text" id="address" value={this.state.street} className="form-control mb-4" placeholder="1234 Main St" required={true} onChange={(e) => {
                                                                this.setState({ street: e.target.value })
                                                            }} />
                                                            <label style={{ display: this.state.shipping }} htmlFor="address-2">Address 2 (optional)</label>
                                                            <input style={{ display: this.state.shipping, zIndex: 100 }} type="text" id="address-2" value={this.state.street2} className="form-control mb-4" placeholder="Apartment or suite" onChange={(e) => {
                                                                this.setState({ street2: e.target.value })
                                                            }} />
                                                            <label style={{ display: this.state.shipping }} htmlFor="city">City</label>
                                                            <input style={{ display: this.state.shipping, zIndex: 100 }} type="text" id="city" className="form-control mb-4" value={this.state.city} placeholder="SpringField" required={true} onChange={(e) => {
                                                                this.setState({ city: e.target.value })
                                                            }} />
                                                            <MDBRow style={{ display: this.state.shipping }}>
                                                                <MDBCol lg="4" md="12" className="mb-4">
                                                                    <label htmlFor="country">Country</label>
                                                                    <select className="custom-select d-block w-100" id="country" required={true}>
                                                                        <option>United States</option>
                                                                    </select>
                                                                </MDBCol>
                                                                <MDBCol lg="4" md="6" className="mb-4">
                                                                    <label htmlFor="state">State</label>
                                                                    <select className="custom-select d-block w-100" id="state" value={this.state.state} required={true} onChange={(e) => {
                                                                        this.setState({ state: e.target.value })
                                                                    }}>
                                                                        {this.state.allStates.map((item, index) => {
                                                                            return (
                                                                                <option key={`State-${item} `} value={item}>{item}</option>
                                                                            )
                                                                        })}
                                                                    </select>
                                                                </MDBCol>
                                                                <MDBCol lg="4" md="6" className="mb-4">
                                                                    <label htmlFor="zip">Zip</label>
                                                                    <input type="number" className="form-control" id="zip" value={this.state.zip} required={true} onChange={(e) => {
                                                                        this.setState({ zip: e.target.value })
                                                                    }} />
                                                                    <div className="invalid-feedback">
                                                                        Zip code required.
                                                                </div>
                                                                </MDBCol>
                                                            </MDBRow>
                                                        </MDBCol>
                                                    </MDBRow>
                                                    <hr />
                                                    <div className={'nextStepButton'}>
                                                        <MDBBtn style={{ zIndex: 100, width: '100%' }} color="primary" type={'submit'} disabled={this.state.nextStepButtonDisabled}>
                                                            <div className={'nextStepButtonAnimation'}>
                                                                <Spinner
                                                                    as="span"
                                                                    animation="grow"
                                                                    size="sm"
                                                                    role="status"
                                                                    aria-hidden="true"
                                                                />
                                                                Loading...
                                                            </div>
                                                            <div className={'nextStepButtonText'}>
                                                                Next Step
                                                            </div>
                                                        </MDBBtn>

                                                    </div>
                                                </form>
                                            </MDBTabPane>

                                            <MDBTabPane tabId="3">
                                                <div className="d-block my-3">
                                                    <StripeCheckout
                                                        token={this.onToken}
                                                        stripeKey={key}
                                                    >
                                                        <div className={'nextStepButton'}>
                                                            <MDBBtn style={{ zIndex: 100, width: '100%' }} color="primary" type={'submit'} disabled={this.state.nextStepButtonDisabled}>
                                                                <div className={'nextStepButtonAnimation'}>
                                                                    <Spinner
                                                                        as="span"
                                                                        animation="grow"
                                                                        size="sm"
                                                                        role="status"
                                                                        aria-hidden="true"
                                                                    />
                                                                Loading...
                                                            </div>
                                                                <div className={'nextStepButtonText'}>
                                                                    Donate ${(this.state.amount).toFixed(2)}
                                                                </div>
                                                            </MDBBtn>
                                                        </div>
                                                    </StripeCheckout>
                                                </div>
                                            </MDBTabPane>
                                            <h5 style={{ textAlign: 'center', marginTop: 10 }}>Not Refundable</h5>
                                        </MDBTabContent>
                                    </MDBCol>
                                    <MDBCol lg="4" className="mb-4">
                                        <MDBCard>
                                            <MDBCardBody>
                                                <h4 className="mb-4 mt-1 h5 text-center font-weight-bold">Summary</h4>
                                                <hr />
                                                <MDBRow>
                                                    <MDBCol sm="8">
                                                        <strong>Donation Amount</strong>
                                                    </MDBCol>
                                                    <MDBCol sm="4">
                                                        <strong>$ {(this.state.amount).toFixed(2)}</strong>
                                                    </MDBCol>
                                                </MDBRow>
                                                <h5 style={{ textAlign: 'center', marginTop: 10 }}>Not Refundable</h5>
                                            </MDBCardBody>
                                        </MDBCard>
                                    </MDBCol>
                                </MDBRow>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBRow>
                </MDBContainer>
            </div>
        );
    }

    renderCSS = () => {
        let nextStepButtonText = 'flex', nextStepButtonAnimation = 'none', addAddressButtonAnimation = 'none', addAddressButtonText = 'flex', nextStepButton = 'flex';
        if (this.state.nextStepButtonDisabled) {
            nextStepButtonText = 'none', nextStepButtonAnimation = 'flex'
        }
        if (this.state.amount === 0) {
            nextStepButton = 'none';
        }
        if (this.state.addAddressButtonDisabled) {
            addAddressButtonAnimation = 'flex';
            addAddressButtonText = 'none';
        }
        const mq = this.props.mq;
        return css({
            [mq[0]]: {
                width: '100%',
                height: '100vh',
                zIndex: 3147483639,
                position: 'fixed',
                overflowY: 'auto',
                '.phone': {
                    marginBottom: 20,
                    maxWidth: '100%',
                    'input': {
                        width: '100%'
                    }
                },
                '.nextStepButton': {
                    display: nextStepButton,
                    '.nextStepButtonText': {
                        display: nextStepButtonText,
                        justifyContent: 'center',
                        alignItems: 'center'
                    },
                    '.nextStepButtonAnimation': {
                        display: nextStepButtonAnimation,
                        justifyContent: 'center',
                        alignItems: 'center'
                    },
                },
                '.addAddressAnimation': {
                    display: addAddressButtonAnimation
                },
                '.addAddressText': {
                    display: addAddressButtonText
                },
                '.savedDonations': {
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    '.donationContainer': {
                        '.secondContainer': {
                            display: 'flex',
                            flexDirection: 'row',
                            height: '100%',
                            width: '100%',
                            alignItems: 'center'
                        },
                        height: 70,
                        transition: 'height 0.5s',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        '.closeButton': {
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'flex-end'
                        },
                        '.borderTop': {
                            width: '100%',
                            height: 1,
                            backgroundColor: 'lightgrey'
                        },
                        '.borderBottom': {
                            width: '100%',
                            height: 1,
                            backgroundColor: 'lightgrey'
                        },
                        '.donationButtonContainer': {
                            width: 36,
                            height: 36,
                            minHeight: 36,
                            minWidth: 36,
                            borderRadius: 4,
                            border: '1px solid black',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer',
                            '.donationButton': {
                                width: 30,
                                height: 30,
                            },
                        },
                        '.donation': {
                            'h5': {
                                fontSize: 14,
                                margin: 0,
                                marginLeft: 9,
                                minWidth: 100
                            }
                        }
                    },
                },

            },
            [mq[1]]: {
                display: 'flex',
                width: '100%',
                position: 'fixed',
                zIndex: 100000,
                height: '100vh',
                overflowY: 'auto',
                '.phone': {
                    width: '100%',
                    marginBottom: 20,
                    'input': {
                        width: '100%'
                    }
                },
                '.nextStepButton': {
                    display: nextStepButton,
                    '.nextStepButtonText': {
                        display: nextStepButtonText,
                        justifyContent: 'center',
                        alignItems: 'center'
                    },
                    '.nextStepButtonAnimation': {
                        display: nextStepButtonAnimation,
                        justifyContent: 'center',
                        alignItems: 'center'
                    },
                },
                '.addAddressAnimation': {
                    display: addAddressButtonAnimation
                },
                '.addAddressText': {
                    display: addAddressButtonText
                },
                '.savedDonations': {
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    '.donationContainer': {
                        '.secondContainer': {
                            display: 'flex',
                            flexDirection: 'row',
                            height: '100%',
                            width: '100%',
                            alignItems: 'center'
                        },
                        height: 70,
                        transition: 'height 0.5s',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        '.closeButton': {
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'flex-end'
                        },
                        '.borderTop': {
                            width: '100%',
                            height: 1,
                            backgroundColor: 'lightgrey'
                        },
                        '.borderBottom': {
                            width: '100%',
                            height: 1,
                            backgroundColor: 'lightgrey'
                        },
                        '.donationButtonContainer': {
                            width: 36,
                            height: 36,
                            minHeight: 36,
                            minWidth: 36,
                            borderRadius: 4,
                            border: '1px solid black',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer',
                            '.donationButton': {
                                width: 30,
                                height: 30,
                            },
                        },
                        '.donation': {
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: 12,
                            'h5': {
                                fontSize: 14,
                                margin: 0,
                                marginLeft: 9,
                                minWidth: 100
                            }
                        }
                    },
                },
            }

        })
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
        url: state.url,
        mq: state.mediaQueries,
        business: state.business
    }
}

export default withRouter(connect(mapStateToProps)(Donations));