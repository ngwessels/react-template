//react
import React from 'react';

//react-router
import { Switch, Route, withRouter } from 'react-router-dom';

//Redux
import { connect } from 'react-redux';

//firebase
import firebase from '../../config';

//constants or functions
import c from '../../constants';
import f from '../../functions';

//dropzone
import Dropzone from 'react-dropzone';

//Image Compression
import imageCompression from 'browser-image-compression';

//Images
import stripeConnect from './../../assets/imgs/stripe.png';

//Styling
import { css, keyframes } from 'emotion';
import { Button, InputGroup, Form, Col, Accordion, Card } from 'react-bootstrap';

//uuid
import { v4 as uuid } from 'uuid';

//images
import photoUpload from './../../assets/imgs/photoUpload.png';



class ViewOrder extends React.Component {

    constructor() {
        super();
        this.state = {
        }
    }

    componentWillMount() {

    }

    sendOrderInfoToCustomer = () => {
        let res = prompt('Are you sure? (y or n)')
        if (res !== 'y') return null;
        let order = this.props.order;
        console.log(order)
        f.Api(this.props, 'post', 'admin/order/send/customer/confirmationEmail', true, { orderId: order.orderId });
    }

    sendMeOrderInfo = () => {
        let res = prompt('Are you sure? (y or n)')
        if (res !== 'y') return null;
        let order = this.props.order;
        f.Api(this.props, 'post', 'admin/order/send/admin/confirmationEmail', true, { orderId: order.orderId });
    }



    pickedUp = (type) => {
        let order = this.props.order;
        f.Api(this.props, 'post', `scanner/set/pickup/${order.orderId}/${order.userId}/${type}`)
        order.business.types[type].pickupTimeStamp = Date.now();
        order.business.types[type].status = 'Picked Up';
        this.props.callback(order, this.props.index, this.props.refIndex)
        setTimeout(() => {
            this.forceUpdate();
        }, 300)
    }

    handleChange = async (event, type) => { //Set Product Photo
        const options = {
            maxSizeMB: 0.4,
            maxWidthOrHeight: 800,
            useWebWorker: true,
        }
        let formData = new FormData();
        for (let x in event) {
            let compressedFile = await imageCompression(event[parseInt(x)], options);
            compressedFile.lastModifiedDate = new Date();
            compressedFile.name = event[parseInt(x)].name;
            const file = URL.createObjectURL(compressedFile);
            formData.append(`file`, compressedFile, `image-${uuid()}`);
        }

        f.Api(this.props, 'put', `admin/order/photos/${this.props.order.orderId}/${type}`, false, formData, (e) => {
            let order = this.props.order;
            order.business.types[type].photos = { ...order.business.types[type].photos, ...e.business.types[type].photos };
            this.props.callback(order, this.props.index, this.props.refIndex)
            setTimeout(() => {
                this.forceUpdate();
            }, 300)
        });
    }

    returnOrderTypes = () => {
        const order = this.props.order;
        const address = order.addressTo;
        const d = new Date(order.timeStamp);
        const date = d.toDateString();
        let ampm = 'am';
        let hour = d.getHours(), minute = d.getMinutes(), second = d.getSeconds();
        if (hour === 0) hour = 12, ampm = 'am'
        else if (hour === 12) hour = 12, ampm = 'pm'
        else if (hour > 12) hour = hour - 12, ampm = 'pm'
        if (minute < 10) minute = `0${minute}`
        if (second < 10) second = `0${second}`
        const time = `${date} at ${hour}:${minute}:${second} ${ampm}`
        return (
            <div style={{ width: '100%' }}>
                <div className={'top'} style={{ left: 0 }}>
                    <div className={'orderInfo'}>
                        <div className={'orderDetails'}>
                            <h4>Order Id: {order.orderId}</h4>
                            <h4>{time}</h4>
                            <Form.Group controlId="formGridName">
                                <Form.Label>Customer Name</Form.Label>
                                <Form.Control placeholder="Customer Name" value={`${address.fName} ${address.lName}`} disabled={true} />
                            </Form.Group>
                            <Form.Group controlId="formGridAddress1">
                                <Form.Label>Address</Form.Label>
                                <Form.Control placeholder="1234 Main St" value={address.street1} disabled={true} />
                            </Form.Group>

                            <Form.Group controlId="formGridAddress2">
                                <Form.Label>Address 2</Form.Label>
                                <Form.Control placeholder="Apartment, studio, or floor" value={address.street2} disabled={true} />
                            </Form.Group>

                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridCity">
                                    <Form.Label>City</Form.Label>
                                    <Form.Control value={address.city} disabled={true} />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridState">
                                    <Form.Label>State</Form.Label>
                                    <Form.Control placeholder="State" value={address.state} disabled={true} />
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridZip">
                                    <Form.Label>Zip</Form.Label>
                                    <Form.Control value={address.zip} disabled={true} />
                                </Form.Group>
                                <Form.Group as={Col} controlId="formGridZip">
                                    <Form.Label>Country</Form.Label>
                                    <Form.Control value={address.country} disabled={true} />
                                </Form.Group>
                            </Form.Row>
                        </div>
                        <div className={'orderDetails'}>
                            <Form.Group controlId="formGridName">
                                <Form.Label>Customer Email</Form.Label>
                                <Form.Control placeholder="Customer Email" value={order.email} disabled={true} />
                            </Form.Group>
                            <Form.Group controlId="formGridName">
                                <Form.Label>Customer Phone</Form.Label>
                                <Form.Control placeholder="Customer Email" value={order.phone} disabled={true} />
                            </Form.Group>
                            <Button variant={'primary'} onClick={this.sendOrderInfoToCustomer}>Re-Send Email</Button>
                            <Button variant={'primary'} onClick={this.sendMeOrderInfo}>Email Me Order</Button>
                        </div>
                    </div>
                </div>
                {Object.keys(order.business.types).map(typeId => {
                    const type = order.business.types[typeId];
                    let types = {};
                    if (type.photos) types = type.photos;
                    return (
                        <div key={`Type-${typeId}-Order-${order.orderId}`} className={'parcels'} style={{ width: '100%' }}>
                            <div className={'parcel'} style={{ width: '80%' }}>
                                <div className={'parcelTop'} >
                                    <h4>{typeId}</h4>
                                    <h4>{type.status}</h4>
                                </div>
                                <div className={'parcelContents'}>
                                    <div className={'parcelRow'}>
                                        <h4 className={'photo'}>Photo</h4>
                                        <h4 className={'name'}>Product Name</h4>
                                        <h4 className={'qty'}>Qty</h4>
                                        <h4 className={'price'}>Price</h4>
                                    </div>
                                    {Object.keys(type.products).map(productId => {
                                        const product = order.business.products[productId];
                                        let photo;
                                        let businessProduct = this.props.myBusiness.products[productId];
                                        if (businessProduct?.photos && businessProduct?.photoOrder[0]) photo = businessProduct.photos[businessProduct.photoOrder[0]];
                                        return (
                                            <div key={`Product-${productId}`} className={'parcelRow'}>
                                                <img className={'photo'} src={photo} />
                                                <h4 className={'name'}>{product.name}</h4>
                                                <h4 className={'qty'}>{product.qty}</h4>
                                                <h4 className={'price'}>${product.price}</h4>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className={`${this.typeCSS(typeId)}`}>
                                    <Button variant={'success'} onClick={() => this.pickedUp(typeId)}>Mark as Picked Up</Button>
                                </div>
                                <div className={`${this.signatureInfoCSS(typeId)}`}>
                                    <Accordion style={{ width: '100%', marginTop: 20 }}>
                                        <Card className={'showPhotos'}>
                                            <Card.Header>
                                                <Accordion.Toggle as={Button} variant="info" eventKey="0">
                                                    Photos
                                            </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="0">
                                                <Card.Body style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    {Object.keys(types).map(photoId => {
                                                        if (photoId === 'totalImages') return null;
                                                        return (
                                                            <img key={`OrderId-${order.orderId}-Type-${typeId}-photoId-${photoId}`} src={types[photoId]} className={'iframe-label'} title={'Photos'} />
                                                        )
                                                    })}

                                                </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>
                                        <Card className={'getPhotos'}>
                                            <Card.Header>
                                                <Accordion.Toggle as={Button} variant="info" eventKey="1">
                                                    Upload Photos
                                            </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="1">
                                                <Card.Body style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    <Dropzone accept="image/png, image/gif, image/jpeg" onDrop={(e) => this.handleChange(e, typeId)} multiple={true}>
                                                        {({ getRootProps, getInputProps }) => (
                                                            <div {...getRootProps()}
                                                                className={'fileDrop'} >
                                                                <input {...getInputProps()} name={"foo"} type={"file"} multiple={true} />
                                                                <img src={photoUpload} />
                                                                <h3>Drag and Drop or press to upload photo</h3>
                                                            </div>
                                                        )}
                                                    </Dropzone>
                                                </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>
                                    </Accordion>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }



    render() {
        const order = this.props.order;
        const address = order.addressTo?.address;
        const latlng = order.addressTo?.latlng;
        return (
            <div className={`${this.renderCSS()}`}>
                {this.returnOrderTypes()}
            </div>
        );
    }

    signatureInfoCSS = (type) => {
        let displaySignature = 'none'
        if (this.props.order?.business?.types[type]?.photos) displaySignature = 'flex'
        return css({
            display: 'flex',
            flexDirection: 'row',
            '.getPhotos': {
                display: 'flex'
            },
            '.showPhotos': {
                display: displaySignature,
            },
            '.iframe-label': {
                width: '50%',
                transform: 'rotate(180deg)'
            }
        })
    }

    typeCSS = (type) => {
        let order = this.props.order;
        let displayPickup = 'flex';
        if (order.business?.types[type]?.pickupTimeStamp) displayPickup = 'none'
        return css({
            display: displayPickup,
            flexDirection: 'row',
            justifyContent: 'center'
        })
    }

    renderCSS = () => {
        const mq = this.props.mq;

        return css({
            [mq[0]]: {
                width: '90%',
                maxWidth: 1000,
                minHeight: 200,
                boxShadow: '3px 3px 5px 6px #ccc',
                borderRadius: 3,
                display: 'flex',
                flexDirection: 'column',
                marginTop: 35,
                justifyContent: 'center',
                alignItems: 'center',
                '.fileDrop': {
                    width: '80%',
                    maxWidth: 900,
                    height: 300,
                    minHeight: 300,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    boxShadow: '3px 3px 5px 6px #ccc',
                    cursor: 'pointer',
                    'img': {
                        height: 200,
                        overflowY: 'hidden'
                    },
                    'h3': {
                        display: 'flex',
                        textAlign: 'center',
                        justifyContent: 'center',
                        alignItems: 'center'
                    },
                    overflowY: 'hidden'
                },
                '.top': {
                    display: 'flex',
                    flexDirection: 'column',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    width: '100%',
                    alignItems: 'center',
                    '.orderInfo': {
                        '.orderDetails': {
                            display: 'flex',
                            flexDirection: 'column',
                            marginLeft: 9,
                            marginRight: 9
                        },
                        '.orderMap': {
                            height: 400,
                            width: 400,
                            marginLeft: 9,
                            marginRight: 20
                        },
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-around',
                        marginLeft: 9,
                        marginTop: 25,
                        width: '100%',
                        'h4': {
                            fontSize: 16
                        },
                    }
                },
                '.parcels': {
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: 19,
                    marginBottom: 20,
                    alignItems: 'center',
                    flexDirection: 'column',
                    '.parcel': {
                        width: '80%',
                        borderRadius: 2,
                        minHeight: 200,
                        marginTop: 16,
                        boxShadow: '2px 2px 4px 5px #ccc',
                        transition: 'box-shadow 0.4s',

                        '.parcelTop': {
                            width: '100%',
                            borderRadius: '2px 2px 0px 0px',
                            backgroundColor: '#d1cfce',
                            height: 35,
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            'h4': {
                                fontSize: 16,
                                margin: 0,
                                marginLeft: 19,
                                marginRight: 19,
                            },
                        },
                        '.parcelContents': {
                            display: 'flex',
                            flexDirection: 'column',
                            '.parcelRow': {
                                display: 'flex',
                                flexDirection: 'row',
                                width: '100%',
                                justifyContent: 'space-around',
                                alignItems: 'center',
                                marginTop: 9,
                                flexWrap: 'wrap',
                                'h4': {
                                    fontSize: 14,
                                    textAlign: 'center'
                                },
                                '.photo': {
                                    width: 75
                                },
                                '.name': {
                                    width: 90
                                }
                            }
                        }
                    },
                    '.parcel:hover': {
                        boxShadow: '3px 3px 5px 6px #ccc',
                    }

                }
            },
            [mq[1]]: {
                width: '75%',
                maxWidth: 800,
                minHeight: 200,
                boxShadow: '3px 3px 5px 6px #ccc',
                borderRadius: 3,
                display: 'flex',
                flexDirection: 'column',
                marginTop: 35,
                justifyContent: 'center',
                alignItems: 'center',
                '.fileDrop': {
                    width: '80%',
                    maxWidth: 900,
                    height: 300,
                    minHeight: 300,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    boxShadow: '3px 3px 5px 6px #ccc',
                    cursor: 'pointer',
                    'img': {
                        height: 200,
                        overflowY: 'hidden'
                    },
                    'h3': {
                        display: 'flex',
                        textAlign: 'center',
                        justifyContent: 'center',
                        alignItems: 'center'
                    },
                    overflowY: 'hidden'
                },
                '.top': {
                    display: 'flex',
                    flexDirection: 'column',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    width: '100%',
                    alignItems: 'center',
                    '.orderInfo': {
                        '.orderDetails': {
                            display: 'flex',
                            flexDirection: 'column',
                            marginLeft: 9,
                            marginRight: 9
                        },
                        '.orderMap': {
                            height: 400,
                            width: 400,
                            marginLeft: 9,
                            marginRight: 20
                        },
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        marginLeft: 9,
                        marginTop: 25,
                        width: '100%',
                        'h4': {
                            fontSize: 16
                        },
                    }
                },
                '.parcels': {
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: 19,
                    marginBottom: 20,
                    alignItems: 'center',
                    flexDirection: 'column',
                    '.parcel': {
                        width: '80%',
                        borderRadius: 2,
                        minHeight: 200,
                        marginTop: 16,
                        boxShadow: '2px 2px 4px 5px #ccc',
                        transition: 'box-shadow 0.4s',

                        '.parcelTop': {
                            width: '100%',
                            borderRadius: '2px 2px 0px 0px',
                            backgroundColor: '#d1cfce',
                            height: 35,
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            'h4': {
                                fontSize: 16,
                                margin: 0,
                                marginLeft: 19,
                                marginRight: 19,
                            },
                        },
                        '.parcelContents': {
                            display: 'flex',
                            flexDirection: 'column',
                            '.parcelRow': {
                                display: 'flex',
                                flexDirection: 'row',
                                width: '100%',
                                justifyContent: 'space-around',
                                alignItems: 'center',
                                marginTop: 9,
                                flexWrap: 'wrap',
                                'h4': {
                                    fontSize: 14,
                                    textAlign: 'center'
                                },
                                '.photo': {
                                    width: 75
                                },
                                '.name': {
                                    width: 90
                                }
                            }
                        }
                    },
                    '.parcel:hover': {
                        boxShadow: '3px 3px 5px 6px #ccc',
                    }

                }
            }
        })
    }
}

function mapStateToProps(state) {
    return {
        url: state.url,
        myBusiness: state.myBusiness,
        mq: state.mediaQueries,
    }
}


export default withRouter(connect(mapStateToProps)(ViewOrder));