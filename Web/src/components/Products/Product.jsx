import React from "react";
import { MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, MDBTooltip, MDBCardFooter, MDBBtn, MDBIcon } from "mdbreact";

//react-router
import { Switch, Route, withRouter } from 'react-router-dom';

//Lazy Load
import LazyLoad, { lazyload } from 'react-lazyload';

//Redux
import { connect } from 'react-redux';

//Styling
import { Button, Form, } from 'react-bootstrap';
import { css, keyframes } from 'emotion';

import InfiniteLoader from "react-window-infinite-loader";

import ImgsViewer from 'react-images-viewer'

//Functions
import f from './../../functions';
//Constants
import c from './../../constants';

//components








class Product extends React.Component {
    constructor() {
        super();
        this.state = {
            buttonText: 'Add to Cart',
            photo: '',
            qtyArray: [],
            displayButton: 'flex',
            displayQty: 'none',
            qty: 0,
            displayImage: false,
            currImg: 0,
        };
    }

    addToCart = (num) => {
        const productId = this.props.product.productId;
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
            f.Api(this.props, 'delete', `users/cart/product/remove/${productId}`, true);
            const action = {
                type: c.USER_CART_REMOVE_PRODUCT,
                productId
            }
            f.reduxDispatch(this.props, action)
        }
        if (this.state.qty === 0 && num !== 0) this.animate();
        if (num === 0) this.setState({ displayButton: 'flex', displayQty: 'none', qty: num });
        else this.setState({ displayButton: 'none', displayQty: 'flex', qty: num })
        this.adjustProductQty()


    }

    adjustProductQty = () => {
        setTimeout(() => {
            let qty = 0;
            if (this.props.user && this.props.user.cart && this.props.user.cart['current-cart'] && this.props.user.cart['current-cart'].business) {
                const business = this.props.user.cart['current-cart'].business;
                if (business.products) {
                    Object.keys(business.products).forEach(key => {
                        const product = business.products[key];
                        qty += product.qty;
                    })
                }
            }
            const action = {
                type: c.USER_CART_QTY,
                results: qty
            }
            f.reduxDispatch(this.props, action);
        }, 400)
    }


    componentDidMount() {
        if (this.props.userInterface === 'business') this.setState({ buttonText: 'Update Product' })
        if (this.props.userInterface === 'user' && this.props.product.onlinePurchasing === false) this.setState({ displayButton: 'none' })
        if (this.props.userInterface === 'store') {
            const stores = this.props.myBusiness.stores;
            let buttonText = 'Select'
            if (stores[this.props.storeId]?.products[this.props.productId]) {
                buttonText = 'Un-Select'
            }
            this.setState({ buttonText })
        }
        if (this.props.product?.photoOrder && this.props.product?.photos) {
            let photo = this.props.product.photos[this.props.product.photoOrder[0]];
            this.setState({ photo })
        }
        if (this.props.userInterface == 'user' && this.props.product.qty) {

            let total = this.props.product?.customerLimit || this.props.product.qty;
            const array = Array.from(Array(total), (x, index) => index + 1);
            this.setState({ qtyArray: array })
        }
        if (this.props.userInterface == 'user' && this.props.user.cart && this.props.user.cart['current-cart'] && this.props.user.cart['current-cart'][this.props.businessId] && this.props.user.cart['current-cart'][this.props.businessId].products && this.props.user.cart['current-cart'][this.props.businessId].products[this.props.productId] && this.props.user.cart['current-cart'][this.props.businessId].products[this.props.productId].qty) {
            this.setState({ qty: this.props.user.cart['current-cart'][this.props.businessId].products[this.props.productId].qty, displayButton: 'none', displayQty: 'flex' })
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.product?.qty !== this.props.product?.qty) {
            if (this.props.userInterface == 'user' && this.props.product.qty) {
                let total = this.props.product?.customerLimit || this.props.product.qty;
                const array = Array.from(Array(total), (x, index) => index + 1);
                this.setState({ qtyArray: array })
            }
        }
    }

    animate = () => {
        const cart = document.querySelector('.b-cart');
        const img = document.querySelector(`.b-items__item__img_${this.props.product.productId}`)
        const item = document.querySelector(`.b-item-${this.props.product.productId}`);
        let disLeft = item.offsetLeft;
        let disTop = item.clientTop + 300;
        let cartleft = cart.offsetLeft;
        let carttop = cart.offsetTop
        let image = img.cloneNode(true);
        image.style = 'z-index: 1111; width: 100px;opacity:0.8; position:fixed; top:' + disTop + 'px;left:' + disLeft + 'px;transition: left 1.2s, top 1.2s, width 1.2s, opacity 1s cubic-bezier(1, 1, 1, 1)';
        const rechange = document.body.appendChild(image)
        setTimeout(() => {
            image.style.left = cartleft + 'px';
            image.style.top = carttop + 'px';
            image.style.width = '40px';
            image.style.opacity = '0';
        }, 1);
        setTimeout(() => {
            rechange.parentNode.removeChild(rechange);
        }, 1300);

    }

    closeViewer = () => {
        this.setState({ displayImage: false })
    }

    openViewer = () => {
        if (this.props.userInterface !== 'user') return;
        this.setState({ displayImage: true })
    }

    imageViewer = () => {
        if (!this.state.displayImage || this.props.userInterface !== 'user') return null;
        else {
            let array = [];
            for (let x in this.props.product.photoOrder) {
                array.push({ src: this.props.product.photos[this.props.product.photoOrder[x]] })
            }
            return (
                <ImgsViewer
                    imgs={array}
                    currImg={this.state.currImg}
                    isOpen={this.state.displayImage}
                    onClose={this.closeViewer}
                    onClickPrev={() => {
                        this.setState({ currImg: this.state.currImg - 1 })
                    }}
                    onClickNext={() => {
                        this.setState({ currImg: this.state.currImg + 1 })
                    }}
                    closeBtnTitle={'Close'}
                />
            )
        }
    }

    render() {
        const product = this.props.product;
        let displayQty = 'none';
        let displayButton = 'flex';
        let qty = 0;
        if (this.props.userInterface == 'user' && this.props.user.cart && this.props.user.cart['current-cart'] && this.props.user.cart['current-cart'].business && this.props.user.cart['current-cart'].business.products && this.props.user.cart['current-cart'].business.products[this.props.product.productId] && this.props.user.cart['current-cart'].business.products[this.props.product.productId].qty) {
            qty = this.props.user.cart['current-cart'].business.products[this.props.product.productId].qty
        }

        return (
            <div className={`${this.renderCSS()}`}>
                {this.imageViewer()}
                <MDBCard className={`m-2 b-item-${this.props.product.productId}`} cascade ecommerce>
                    <div onClick={this.openViewer}>
                        <LazyLoad height={200}>
                            <MDBCardImage className={`b-items__item__img_${this.props.product.productId} productImage`} cascade top src={this.state.photo} waves />
                        </LazyLoad>
                    </div>
                    <MDBCardBody cascade className="text-center">
                        <MDBCardTitle tag="h5" className={'productType'}>
                            {product.type}
                        </MDBCardTitle>
                        <MDBCardTitle >
                            <strong className={'productName'}>{product.name}</strong>
                        </MDBCardTitle>
                        <MDBCardText>
                            <strong className={'description'}>{product.description}</strong>
                        </MDBCardText>
                        <MDBCardText>
                            <strong className={'customerLimit'}>Limit Per Customer: {product.customerLimit}</strong>
                        </MDBCardText>
                    </MDBCardBody>
                    <MDBCardFooter className={'footer'}>
                        <span className="float-left productPrice">${(product.price).toFixed(2)}</span>
                        <span className="float-right">
                            <Button className={'addToCart'} style={{}} onClick={() => {
                                if (this.props.updateProduct) this.props.updateProduct(this.props.productId)
                                if (this.props.userInterface === 'user') this.addToCart(1)
                                if (this.props.userInterface === 'store') this.addToCart(-1)
                            }} variant="primary">{this.state.buttonText}</Button>
                            <Form className={'displayQty'}>
                                <Form.Group controlId="exampleForm.SelectCustom">
                                    <Form.Label style={{ margin: 0 }}>Select Amount</Form.Label>
                                    <LazyLoad>
                                        <Form.Control as="select" className={'select'} custom value={qty} onChange={(e) => {
                                            const num = parseInt(e.target.value);
                                            if (num === 0) this.setState({ displayButton: 'flex', displayQty: 'none', qty: 0 })
                                            else this.setState({ qty: num });
                                            this.addToCart(num)
                                        }}>
                                            <option value={0}>0</option>
                                            {this.state.qtyArray.map((item, index) => {
                                                return (
                                                    <option key={`${this.props.product.productId}-${index}`} value={item}>{item}</option>
                                                )
                                            })}
                                        </Form.Control>
                                    </LazyLoad>
                                </Form.Group>
                            </Form>
                            <Button variant={'dark'} className={'soldOut'} disabled={true}>Sold Out</Button>
                            <div className={'adminSales'}>
                                <Form.Label style={{ margin: 0 }}>Available: {this.props.product.qty || 0}</Form.Label>
                                <Form.Label style={{ margin: 0 }}>Sold: {this.props.product.sold || 0}</Form.Label>
                            </div>
                        </span>
                    </MDBCardFooter>
                </MDBCard>
            </div>

        );
    }

    renderCSS = () => {
        let displayQty = 'none';
        let displayButton = 'flex';
        let displaySoldOut = 'none';
        let displayCustomerLimit = 'none';
        let displayAdminSales = 'none';
        if (this.props.product?.customerLimit) {
            displayCustomerLimit = 'flex';
        }
        if (this.props.userInterface == 'user' && this.props.user.cart && this.props.user.cart['current-cart'] && this.props.user.cart['current-cart'].business && this.props.user.cart['current-cart'].business.products && this.props.user.cart['current-cart'].business.products[this.props.product.productId] && this.props.user.cart['current-cart'].business.products[this.props.product.productId].qty) {
            displayQty = 'flex', displayButton = 'none';
        }
        if (this.props.product && !this.props.product.onlinePurchasing && this.props.userInterface == 'user') {
            displayQty = 'none', displayButton = 'none';
        }
        if (this.props.product?.qty <= 0 && this.props.userInterface === 'user') displayQty = 'none', displayButton = 'none', displaySoldOut = 'flex';
        if (this.props.userInterface === 'adminSales') {
            displayQty = 'none';
            displaySoldOut = 'none';
            displayButton = 'none';
            displayCustomerLimit = 'none';
            displayAdminSales = 'flex';
        }
        if (this.props.userInterface === 'user' && this.props.hideButton === true) {
            displayQty = 'none';
            displaySoldOut = 'none';
            displayButton = 'none';
            displayCustomerLimit = 'none';
            displayAdminSales = 'none';
        }
        return css({

            '.m-2': {
                marginRight: '2vw',
                marginLeft: '2vw',
                marginBottom: 20,
            },
            '.footer': {
                height: 50,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 15
            },
            '.addToCart': {
                margin: 0,
                display: displayButton
            },
            '.displayQty': {
                display: displayQty
            },
            '.soldOut': {
                display: displaySoldOut,
                backgroundColor: 'grey'
            },
            '.adminSales': {
                display: displayAdminSales,
                flexDirection: 'column'
            },

            '.Ripple-parent': {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            },
            '.productType': {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            },
            '.customerLimit': {
                justifyContent: 'center',
                alignItems: 'center'
            },
            [this.props.mq[0]]: {
                height: 580,
                marginRight: '2vw',
                marginLeft: '2vw',
                marginTop: 20,
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                '.productImage': {
                    maxHeight: 270,
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: 0,
                    'img': {
                        margin: 0
                    }
                },
                '.m-2': {
                    width: '90%',
                    height: 580,
                    maxWidth: '90%'
                },
                '.productType': {
                    fontSize: '1em',
                    textAlign: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                },
                '.productName': {
                    fontSize: '1em'
                },
                '.description': {
                    fontSize: '1em'
                },
                '.productPrice': {
                    fontSize: '1em'
                },
                '.footer': {
                    height: 75
                },
                '.addToCart': {
                    fontSize: '0.8em'
                },
                '.select': {
                    fontSize: '1em'
                },
                '.customerLimit': {
                    display: displayCustomerLimit,
                    fontSize: '0.75em',
                }
            },
            [this.props.mq[1]]: {
                height: 650,
                marginRight: '1.5vw',
                marginLeft: '1.5vw',
                marginTop: '3vh',

                '.productImage': {
                    maxHeight: 370,
                    width: 'auto',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: 0,
                    'img': {
                        margin: 0
                    }
                },
                '.m-2': {
                    height: 650,
                    width: '23rem',
                    maxWidth: 800
                },
                '.productType': {
                    fontSize: '1em',
                    textAlign: 'center',
                },
                '.productName': {
                    fontSize: '1em'
                },
                '.description': {
                    fontSize: '1em'
                },
                '.productPrice': {
                    fontSize: '1em'
                },
                '.footer': {
                    height: 50
                },
                '.addToCart': {
                    fontSize: '1em'
                },
                '.select': {
                    fontSize: '1em'
                },
                '.customerLimit': {
                    display: displayCustomerLimit,
                    fontSize: '0.75em',
                }
            }

        })
    }

}

function mapStateToProps(state) {
    return {
        myBusiness: state.myBusiness,
        url: state.url,
        mq: state.mediaQueries,
        user: state.user
    }
}

export default withRouter(connect(mapStateToProps)(Product));