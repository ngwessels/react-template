import React, { Component } from "react";
import {
    MDBContainer, MDBCol, MDBRow, MDBCard, MDBCardBody, MDBBtn, MDBNav, MDBNavItem, MDBNavLink, MDBTabPane,
    MDBTabContent, MDBSelect, MDBSelectInput, MDBSelectOption, MDBSelectOptions
} from "mdbreact";
import { Spinner, Accordion, Card, Button, Form, FormControl, Col } from 'react-bootstrap';

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

class Checkout extends React.Component {
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
            orderTotal: 0,
            shipping: 'flex',
            isShipping: true,
            required: true,
            shippingTotal: 0,
            stripeFee: 0,
            tax: 0,
            rates: {},
            rate: null,
            nextStepButtonDisabled: false,
            addAddressButtonDisabled: false,
            shippingId: null,
            defaultActiveKey: '1',
            addressId: null,
            rateId: null,
            initialUpdate: true,
            removedUser: false,
            interval: null,
            totalProducts: 0,
        }
    }

    componentDidUpdate(prevProps) {
        if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
            f.Api(this.props, 'get', 'users/orders/paymentTotal', true, {}, (e) => {
                if (e) {
                    const { stripeFee, total, tax } = e;
                    this.setState({ stripeFee, orderTotal: total, tax: tax, })
                } else {
                    this.closeMenu();
                }
            })
        }
    }

    componentDidMount() {
        let products = {};
        if (this.props.user && this.props.user.cart && this.props.user.cart['current-cart']) products = this.props.user.cart['current-cart'];
        let totalProducts = 0;
        Object.keys(products).forEach(productId => totalProducts++);
        if (totalProducts <= 0) {
            this.closeMenu()
            const errorId = uuid();
            const action2 = {
                type: 'ADD_ERROR',
                errorId,
                results: { message: 'There is nothing in your cart' }
            }
            f.reduxDispatch(this.props, action2)
            return;
        }
        this.getCart('start');
        const interval = setInterval(() => this.getCart('call'), 30000);
        this.setState({ interval })
    }

    componentWillUnmount() {
        if (this.state.interval) clearInterval(this.state.interval)
    }

    getCart = (type) => {
        f.Api(this.props, 'get', `users/console/get`, true, {}, (e) => {
            if (type === 'start') {
                if (!e || !e.cart || !e.cart['current-cart']) {
                    this.closeMenu()
                    const errorId = uuid();
                    const action2 = {
                        type: 'ADD_ERROR',
                        errorId,
                        results: { message: 'It appears products had been removed from your cart. The product that you had in your cart may no longer be available!' }
                    }
                    f.reduxDispatch(this.props, action2)
                } else {
                    f.Api(this.props, 'get', 'users/orders/paymentTotal', true, {}, (e) => {
                        if (e) {
                            const { stripeFee, total, tax } = e;
                            this.setState({ stripeFee, orderTotal: total, tax: tax, })
                        }
                    })
                }
            } else if (type === 'call') {
                if (!e || !e.cart || !e.cart['current-cart']) {
                    const errorId = uuid();
                    const action2 = {
                        type: 'ADD_ERROR',
                        errorId,
                        results: { message: 'It appears your cart is now empty. A product that you had in your cart may no longer be available!' }
                    }
                    f.reduxDispatch(this.props, action2)
                    this.closeMenu()
                }
            }

        });
    }


    submitNewAddress = () => {
        let object = {
            name: `${this.state.fName} ${this.state.lName}`,
            street1: this.state.street,
            street2: this.state.street2,
            city: this.state.city,
            state: this.state.state,
            zip: this.state.zip,
        }
        this.setState({ addAddressButtonDisabled: true });
        f.Api(this.props, 'post', 'users/addresses/create', true, { address: object }, (e) => {
            if (e) {
                this.setState({ defaultActiveKey: e.defaultActiveKey, addressId: e.addressId, street: '', street2: '', city: '', state: '', zip: '', fName: '', lName: '' })
            }
            this.setState({ addAddressButtonDisabled: false })
        });
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
            fName: s.fName,
            lName: s.lName,
            street1: s.street,
            street2: s.street2,
            city: s.city,
            state: s.state,
            zip: s.zip,
            country: 'USA',
        }
        this.setState({ nextStepButtonDisabled: true })
        f.Api(this.props, 'post', `users/orders/pendingOrder/create`, true, { email: firebase.auth()?.currentUser?.email || this.state.email, address, phone: this.state.phone }, (e) => {
            this.setState({ nextStepButtonDisabled: false })
            if (e) {
                const { stripeFee, total, taxes, shipping, discounts } = e;
                // this.setState({ stripeFee, orderTotal: total, shippingTotal: shipping, activePill: '2', tax: taxes, discounts })
                this.setState({ stripeFee, orderTotal: total, shippingTotal: shipping, tax: taxes, discounts })
                // window.scrollTo(0, 0);
                console.log('is called')
                const button = document.getElementById('stripeButton');
                button.click();
            }
            this.setState({ nextStepButtonDisabled: false })
        });
    }




    onToken = (token) => {
        this.setState({ nextStepButtonDisabled: true })
        f.Api(this.props, 'post', 'users/orders/stripePayment', true, { stripeToken: token.id, email: this.state.email }, (e) => {
            this.setState({ nextStepButtonDisabled: false })
        })
    }

    closeMenu = () => {
        const action = {
            type: c.MENU_REMOVE,
        };
        f.reduxDispatch(this.props, action);
    }

    addToCart = (num, productId) => {
        //TODO: Add product and product qty to users cart
        if (num > 0) {
            f.Api(this.props, 'post', `users/cart/product/add/${productId}`, true, { qty: num });
            const action = {
                type: c.USER_CART_ADD_PRODUCT_QTY,
                productId,
                qty: num
            }
            f.reduxDispatch(this.props, action)
        }
        else {
            f.Api(this.props, 'delete', `users/cart/product/remove/${productId}`, true, {}, () => {
                f.Api(this.props, 'get', 'users/orders/paymentTotal', true, {}, (e) => {
                    if (e) {
                        const { stripeFee, total, tax } = e;
                        this.setState({ stripeFee, orderTotal: total, tax: tax, })
                    } else {
                        this.closeMenu();
                    }
                })
            });
            const action = {
                type: c.USER_CART_REMOVE_PRODUCT,
                productId
            }
            f.reduxDispatch(this.props, action)
        }
        this.adjustProductQty()
    }

    adjustProductQty = () => {
        let qty = 0;
        if (this.props.user && this.props.user.cart && this.props.user.cart['current-cart'] && this.props.user.cart['current-cart'].business) {
            const business = this.props.user.cart['current-cart'].business;
            if (business.products) {
                Object.keys(business.products).forEach(key => {
                    const product = business.products[key];
                    qty = qty + product.qty;
                })
            }
        }
        if (qty === 0) { this.closeMenu() };
        const action = {
            type: c.USER_CART_QTY,
            results: qty
        }
        f.reduxDispatch(this.props, action);
    }

    render() {
        let cart = {};
        if (this.props.user?.cart && this.props.user?.cart['current-cart']) cart = this.props.user.cart['current-cart'];
        const { activePill } = this.state;

        let ratesArray = [];
        let rates = {};
        if (this.props.user?.cart?.pendingOrder?.rates) rates = this.props.user.cart.pendingOrder.rates
        Object.keys(rates).forEach(key => {
            let rate = rates[key];
            rate.rateId = key;
            ratesArray.push(rate);
        })
        for (let x = 0; x < ratesArray.length; x++) {
            let current = ratesArray[x];
            for (let i = x + 1; i < ratesArray.length; i++) {
                let forward = ratesArray[i];
                if (forward.amount < current.amount) {
                    ratesArray[x] = forward;
                    ratesArray[i] = current
                    current = forward;
                }
            }
        }
        ratesArray.unshift(null)

        //Determins which api key to use for stripe
        let liveKey = process.env.REACT_APP_stripe_payments_live, testKey = process.env.REACT_APP_stripe_payments;
        let key = liveKey;
        if (applicationStatus !== 'Live') key = testKey;

        //If Email is required
        let emailRequired = true;
        if (firebase.auth()?.currentUser?.email) emailRequired = false;

        let business = cart.business;
        if (!business) business = { products: {} }
        const mainBusiness = this.props.business;

        return (
            <div className={`${this.renderCSS()}`}>
                <div style={{ width: '100%', height: '100%', backgroundColor: 'transparent', zIndex: -1, position: 'absolute' }} onClick={() => this.closeMenu()} />
                <MDBContainer>
                    <MDBRow className="my-2" center>
                        <MDBCard className="w-100 MDBCard">
                            <MDBCardBody className={'MDBCardBody'}>
                                <MDBRow className={'MDBRow'} style={{ marginTop: 20 }}>
                                    <MDBCol lg="8" className="mb-4">
                                        <CloseButton callback={this.closeMenu} />
                                        <MDBNav pills color="primary" className="nav-justified">
                                            <MDBNavItem>
                                                <MDBNavLink to="#" className={activePill === "1" ? "active" : ""} onClick={() => {
                                                    this.togglePills("1")
                                                    this.setState({ shippingTotal: 0, rate: null, shippingId: '' })
                                                }}
                                                >
                                                    <strong>Billing Info</strong>
                                                </MDBNavLink>
                                            </MDBNavItem>
                                        </MDBNav>
                                        <MDBTabContent className="pt-4" activeItem={activePill}>
                                            <MDBTabPane tabId="1" className={'desktop'}>
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
                                                                Place order ${(this.state.orderTotal).toFixed(2)}
                                                            </div>
                                                        </MDBBtn>

                                                    </div>
                                                </form>
                                            </MDBTabPane>
                                            <MDBTabPane tabId="2" className={'desktop'}>
                                                <div className="d-block my-3">
                                                    <StripeCheckout
                                                        token={this.onToken}
                                                        stripeKey={key}
                                                        allowRememberMe={false}
                                                        email={firebase.auth().currentUser.email || this.state.email || ""}
                                                        amount={parseInt((this.state.orderTotal * 100).toFixed(2))}
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
                                                                    Place order ${(this.state.orderTotal).toFixed(2)}
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
                                            <MDBCardBody syle={{ maxHeight: '90vh', overflow: 'scroll' }}>
                                                <h4 className="mb-4 mt-1 h5 text-center font-weight-bold">Summary</h4>
                                                {Object.keys(business.products).map(productId => {
                                                    if (!business?.products || !business.products[productId]) return null
                                                    const product = business.products[productId];
                                                    const mainProduct = mainBusiness.products[productId];
                                                    let array = [];
                                                    let total = product.customerLimit || mainProduct.qty
                                                    if (total > mainProduct.qty) total = mainProduct.qty;
                                                    for (let x = 0; x <= total; x++) {
                                                        array.push(x)
                                                    }
                                                    let disabled = false
                                                    if (this.state.activePill !== '1') {
                                                        disabled = true
                                                    }
                                                    return (
                                                        <div key={`Product-${productId}`}>
                                                            <hr />
                                                            <MDBRow >
                                                                <MDBCol sm="8">{product.name}</MDBCol>
                                                                <MDBCol sm="4">$ {parseFloat((product.price * product.qty).toFixed(2))}</MDBCol>
                                                                <Form.Group as={Col} controlId="formGridState">
                                                                    <Form.Label>Qty:</Form.Label>
                                                                    <Form.Control as="select" value={product.qty} onChange={(e) => {
                                                                        this.addToCart(e.target.value, productId);
                                                                        this.togglePills('1')
                                                                    }} disabled={disabled}>
                                                                        {array.map((item, index) => {
                                                                            return (
                                                                                <option key={`Product-${productId}-qty-${index}`} value={item}>{item}</option>
                                                                            )
                                                                        })}
                                                                    </Form.Control>
                                                                </Form.Group>
                                                            </MDBRow>
                                                        </div>
                                                    )
                                                })}
                                                <hr />
                                                <MDBRow>
                                                    <MDBCol sm="8">
                                                        <strong>Tax</strong>
                                                    </MDBCol>
                                                    <MDBCol sm="4">
                                                        <strong>$ {(this.state.tax).toFixed(2)}</strong>
                                                    </MDBCol>
                                                </MDBRow>
                                                <MDBRow>
                                                    <MDBCol sm="8">
                                                        <strong>Processing Fee</strong>
                                                    </MDBCol>
                                                    <MDBCol sm="4">
                                                        <strong>$ {(this.state.stripeFee).toFixed(2)}</strong>
                                                    </MDBCol>
                                                </MDBRow>
                                                <MDBRow>
                                                    <MDBCol sm="8">
                                                        <strong>Total</strong>
                                                    </MDBCol>
                                                    <MDBCol sm="4">
                                                        <strong>$ {(this.state.orderTotal).toFixed(2)}</strong>
                                                    </MDBCol>
                                                </MDBRow>
                                                <h5 style={{ textAlign: 'center', marginTop: 10 }}>Not Refundable</h5>
                                            </MDBCardBody>
                                        </MDBCard>
                                    </MDBCol>
                                    <MDBCol lg="8" className="mb-4 mobile">
                                        <MDBTabContent className="pt-4" activeItem={activePill}>
                                            <MDBTabPane tabId="1" className={'mobile'}>
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
                                                                Place order ${(this.state.orderTotal).toFixed(2)}
                                                            </div>
                                                        </MDBBtn>

                                                    </div>
                                                </form>
                                            </MDBTabPane>
                                            <MDBTabPane tabId="2" className={'desktop'}>
                                                <div className="d-block my-3">
                                                    <StripeCheckout
                                                        token={this.onToken}
                                                        stripeKey={key}
                                                        allowRememberMe={false}
                                                        email={firebase.auth().currentUser.email || this.state.email || ""}
                                                        amount={parseInt((this.state.orderTotal * 100).toFixed(2))}
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
                                                                    Place order ${(this.state.orderTotal).toFixed(2)}
                                                                </div>
                                                            </MDBBtn>
                                                        </div>
                                                    </StripeCheckout>
                                                </div>
                                            </MDBTabPane>
                                            <h5 style={{ textAlign: 'center', marginTop: 10 }}>Not Refundable</h5>
                                        </MDBTabContent>
                                    </MDBCol>
                                </MDBRow>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBRow>
                </MDBContainer>
                <div style={{ display: 'none' }}>
                    <StripeCheckout
                        token={this.onToken}
                        stripeKey={key}
                        allowRememberMe={false}
                        email={firebase.auth().currentUser.email || this.state.email || ""}
                        amount={parseInt((this.state.orderTotal * 100).toFixed(2))}
                    ><button type={'button'} id={'stripeButton'} style={{ display: 'none' }}></button>
                    </StripeCheckout>
                </div>
            </div>
        );
    }

    renderCSS = () => {
        let nextStepButtonText = 'flex', nextStepButtonAnimation = 'none', addAddressButtonAnimation = 'none', addAddressButtonText = 'flex';
        if (this.state.nextStepButtonDisabled) {
            nextStepButtonText = 'none', nextStepButtonAnimation = 'flex'
        }
        if (this.state.addAddressButtonDisabled) {
            addAddressButtonAnimation = 'flex';
            addAddressButtonText = 'none';
        }
        let nextStepButton = 'flex'

        //If Pickup is Available
        let cart = {};
        if (this.props.user?.cart && this.props.user?.cart['current-cart']) cart = this.props.user.cart['current-cart'];
        let isPickup = 'flex';
        Object.keys(cart).forEach(businessId => {
            if (!cart[businessId]?.stopByLocation) isPickup = 'none';
        })
        const mq = this.props.mq;
        return css({

            [mq[0]]: {
                width: '100%',
                height: '100vh',
                zIndex: 90000000000000000000,
                position: 'fixed',
                overflowY: 'auto',
                '.desktop': {
                    display: 'none'
                },
                '.mobile': {

                },
                '.pickupOption': {
                    display: isPickup
                },
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
                '.savedAddresses': {
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    '.addressContainer': {
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
                        '.addressButtonContainer': {
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
                            '.addressButton': {
                                width: 30,
                                height: 30,
                            },
                        },
                        '.address': {
                            '.bottomAddress': {
                                height: 0,
                                transition: 'opacity 0.5s',
                                display: 'flex',
                                flexDirection: 'row',
                                marginLeft: 20,
                                'h5': {
                                    fontSize: 13,
                                    margin: 0,
                                    marginLeft: 9,
                                    minWidth: 90
                                }
                            },
                            '.topAddress': {
                                display: 'flex',
                                flexDirection: 'row',
                                marginLeft: 20,
                                'h5': {
                                    fontSize: 14,
                                    margin: 0,
                                    marginLeft: 9,
                                    minWidth: 100
                                }
                            }
                        }
                    },
                },

            },
            [mq[1]]: {
                display: 'flex',
                width: '100%',
                // alignItems: 'center',
                justifyContent: 'center',
                position: 'fixed',
                zIndex: 90000000000000000000,
                height: '100vh',
                overflow: 'scroll',
                '.mobile': {
                    display: 'none'
                },
                '.desktop': {

                },
                '.pickupOption': {
                    display: isPickup
                },
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
                '.savedAddresses': {
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    '.addressContainer': {
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
                        '.addressButtonContainer': {
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
                            '.addressButton': {
                                width: 30,
                                height: 30,
                            },
                        },
                        '.address': {
                            '.bottomAddress': {
                                height: 0,
                                transition: 'opacity 0.5s',
                                display: 'flex',
                                flexDirection: 'row',
                                marginLeft: 20,
                                'h5': {
                                    fontSize: 13,
                                    margin: 0,
                                    marginLeft: 9,
                                    minWidth: 90
                                }
                            },
                            '.topAddress': {
                                display: 'flex',
                                flexDirection: 'row',
                                marginLeft: 20,
                                'h5': {
                                    fontSize: 14,
                                    margin: 0,
                                    marginLeft: 9,
                                    minWidth: 100
                                }
                            }
                        }
                    },
                },
                '.shippingContainer': {
                    '.secondContainer': {
                        display: 'flex',
                        flexDirection: 'row',
                        height: '100%',
                        width: '100%',
                        alignItems: 'center'
                    },
                    height: 50,
                    transition: 'height 0.5s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    '.border': {
                        width: '100%',
                        height: 1,
                        backgroundColor: 'lightgrey'
                    },
                    '.shippingButtonContainer': {
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
                        '.shippingButton': {
                            width: 30,
                            height: 30,
                        },
                    },
                    '.shipping': {
                        '.topShipping': {
                            display: 'flex',
                            flexDirection: 'row',
                            'h5': {
                                fontSize: 14,
                                margin: 0,
                                marginLeft: 9,
                                minWidth: 140,
                                textAlign: 'center'
                            }
                        }
                    }
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

export default withRouter(connect(mapStateToProps)(Checkout));