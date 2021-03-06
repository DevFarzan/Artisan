import React, { Component } from 'react';
import HeaderMenu from '../header/headermenu';
import { InputNumber, Modal, Spin, Icon, Checkbox } from 'antd';
import { Link } from "react-router-dom";
// import CardDetail from '../../components/events/event_listing/CardDetail';
import { Elements, StripeProvider } from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm';
import { HttpUtils } from "../../Services/HttpUtils";
import './checkOutpage.css';
import { Redirect } from 'react-router';
import imgSucces from './images/succes.gif';
import Footer from '../footer/footer';

function onChange(e) {
    console.log(`checked = ${e.target.checked}`);
  }

class CheckOutPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cartValue: [],
            visible: false,
            cardData: '',
            stripe: null,
            email: '',
            amount: '',
            name: '',
            chechkOutObj: '',
            objectIds: '',
            noRecordFound: false,
            goProductpage: false,
            hideBtn: true,
            succes: false,
            userCheckOut: false,
            totalAmount: '',
            pakjazbafee: '',
            gst: '',
            loader: false
        }
    }
    componentDidMount() {
        const userData = JSON.parse(localStorage.getItem('user'));
        let addToCartData = JSON.parse(localStorage.getItem('addToCart'))
        if (addToCartData) {
            this.setState({
                cartValue: addToCartData,
                email: userData.email,
                name: userData.name,
                userId: userData._id,
                hideBtn: true
            })
        }
        else {
            this.setState({
                noRecordFound: true,
                hideBtn: false
            })
        }
        this.capturedKeys();
        this.calculateAmount(addToCartData)
    }



    onChange = (data, cartCount) => {
        let addToCartData = JSON.parse(localStorage.getItem('addToCart'))
        let updateCartData = [];
        for (var i = 0; i < addToCartData.length; i++) {
            if (addToCartData[i].objectId == data.objectId) {
                let updateObj = {};
                updateObj.cartCount = cartCount;
                updateObj.description = addToCartData[i].description;
                updateObj.images = addToCartData[i].images;
                updateObj.objectId = addToCartData[i].objectId;
                updateObj.price = addToCartData[i].price;
                updateObj.productName = addToCartData[i].productName;
                updateObj.profileId = addToCartData[i].profileId;
                updateObj.user_Id = addToCartData[i].user_Id;
                updateObj.shopName = addToCartData[i].shopName;
                updateObj.productId = addToCartData[i].productId;
                updateObj.shopId = addToCartData[i].shopId;

                updateCartData.push(updateObj)
            }
            else {
                updateCartData.push(addToCartData[i])
            }
        }
        this.calculateAmount(updateCartData);
        localStorage.setItem('addToCart', JSON.stringify(updateCartData));
        this.setState({
            cartValue: updateCartData,
            hideBtn: true
        })
    }
    removeCartData = (data, index) => {
        let addToCartData = JSON.parse(localStorage.getItem('addToCart'))
        let updateCartData = [];
        for (var i = 0; i < addToCartData.length; i++) {
            if (addToCartData[index] == addToCartData[i]) {
            }
            else {
                updateCartData.push(addToCartData[i])
            }
        }
        this.calculateAmount(updateCartData);
        localStorage.setItem('addToCart', JSON.stringify(updateCartData));
        this.setState({
            cartValue: updateCartData,
            hideBtn: true
        })
        if (updateCartData.length == 0) {
            this.setState({
                noRecordFound: true,
                hideBtn: false
            })
            localStorage.removeItem('addToCart');
        }
    }

    checkOutFunc = () => {
        const { name, email, userId, totalAmount } = this.state;
        let addToCartData = JSON.parse(localStorage.getItem('addToCart'))
        let objIds = []
        for (var i = 0; i < addToCartData.length; i++) {
            objIds.push(addToCartData[i].objectId)
        }
        let chechkOutObj = {
            name: name,
            email: email,
            amount: totalAmount.toString(),
            objectIds: objIds,
            userId: userId,
            currency: 'usd',
            loader: false
        }
        this.setState({
            visible: true,
            // amount: totalAmount,
            chechkOutObj: chechkOutObj,
        })
    }

    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }
    handleCancelPayment = () => {
        this.setState({
            succes: false
        });
    }

    calculateAmount = (amountObj) => {
        let amountValue = 0;
        let pakjazbafee = 0;
        let gst = 0;
        let totalAmount = 0;
        if (amountObj) {
            for (var i = 0; i < amountObj.length; i++) {
                let amount = Number(amountObj[i].price);
                let count = Number(amountObj[i].cartCount)
                amountValue = Math.round((amount * count) + amountValue);
            }
            pakjazbafee = Math.round((amountValue / 100) * 10);
            gst = Math.round((amountValue / 100) * 10);
            totalAmount = Math.round(amountValue + pakjazbafee + gst);
            this.setState({
                amount: amountValue,
                pakjazbafee: pakjazbafee,
                gst: gst,
                totalAmount: totalAmount
            })
        }
    }


    async capturedKeys() {
        let res = await HttpUtils.get('keys');
        if (window.Stripe) {
            this.setState({ stripe: window.Stripe(res.keys) });
        } else {
            document.querySelector('#stripe-js').addEventListener('load', () => {
                this.setState({ stripe: window.Stripe(res.keys) });
            });
        }
    }


    onAddMore = () => {
        this.setState({
            goProductpage: true
        })
    }

    loaderFunc = () => {
        this.setState({
            loader: true
        })
    }

    modalsHideAndShow = async (res) => {
        const { cartValue } = this.state;
        if (res.status) {
            for (var i = 0; i < cartValue.length; i++) {
                let res = await HttpUtils.post('postOrdersByShop', cartValue[i]);
            }
            localStorage.removeItem('addToCart');
            this.setState({
                succes: true,
                visible: false,
                loader: false
            })
            setTimeout(() => {
                this.setState({
                    succes: false,
                    goProductpage: true,
                    loader: false
                })
            }, 5000)
        }
        else {
            this.setState({
                loader: false
            })
        }
    }
    render() {
        const { cartValue, stripe, chechkOutObj, noRecordFound, goProductpage, hideBtn, succes, amount, pakjazbafee, gst, totalAmount, loader } = this.state;
        if (goProductpage) {
            return <Redirect to={{ pathname: `/` }} />
        }
        const antIcon = <Icon type="loading" style={{ fontSize: 120 }} spin />;
        return (
            <div>
                <HeaderMenu />
                <div >
                    <div className="" style={{ textAlign: "center", marginTop: "25px" }}>
                        <h1 style={{ fontFamily: 'Crimson Text, serif', fontWeight: "bold", color: "white" }}></h1>
                        <div className="div">
                            <h2 className='cartHeader'>Check Out Product</h2>
                            {/* {hideBtn ?
                                <div className='row'>
                                    <div className='cart col-md-7 col-sm-7 col-xs-12'></div>
                                
                                    <button className='checkoutbtn ant-btn post_need col-md-2 col-sm-2 col-xs-12' onClick={this.checkOutFunc}>Checkout</button>
                                    <Link rel="noopener noreferrer" to={`/`} style={{ color: 'black', fontSize: '14px' }}>
                                       
                                        <button className='checkoutbtn ant-btn post_need col-md-2 col-sm-2 col-xs-12'>Browse more</button>
                                    </Link>
                                    <div className='col-md-1 col-sm-1 col-xs-12'></div>

                                </div> : null} */}
                        </div>
                    </div>
                </div>
                <div className='container'>
                    <div className="row" style={{padding:"15px"}}>
                        {/*For Mobile Phones*/}
                        <div className="visible-xs" style={{backgroundColor:"white", padding:"5px", marginBottom:"30px"}}>
                        {cartValue && cartValue.map((elem, key) => {
                        return (
                                    <div className='panel-body' style={{padding:"0"}}>
                                        <div className="row" style={{padding:"10px"}}>
                                            <Checkbox onChange={onChange}>{elem.shopName}</Checkbox>
                                        </div>
                                        <hr/>
                                        <div className="row" style={{padding:"15px"}}>
                                            <div className="col-xs-1" style={{marginTop:"40px", padding:"0"}}>
                                                <Checkbox onChange={onChange}>
                                                </Checkbox>
                                            </div>
                                            <div className="col-xs-3">
                                                <img className='imgClass' src={elem.images[0]}  style={{marginTop:"15px"}}/>
                                            </div>
                                            <div className="col-xs-8">
                                                <ul className='cartDetail'>
                                                    <li>Product Name : {elem.productName}</li>
                                                </ul>
                                                <div className="row">
                                                    <div className="col-xs-6">
                                                        <p style={{margin:"0", color:"rgb(217, 166, 126)"}}>$ 5000</p>
                                                        <span><s> $ {elem.price * elem.cartCount}</s></span> 
                                                        <span><p> 20 %</p></span>
                                                    </div>  
                                                    <div className="col-xs-6">
                                                        <InputNumber min={1} max={10} defaultValue={elem.cartCount} onChange={this.onChange.bind(this, elem)} />
                                                        <button type="button" class="trashbtn btn-link btn-xs" onClick={this.removeCartData.bind(this, elem, key)}>
                                                            <span class="glyphicon glyphicon-trash"> </span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> 
                                        
                                    </div>

                            
                        )
                    })}
                            <div>
                                <Link rel="noopener noreferrer" to={`/`} style={{ color: 'black', fontSize: '14px' }}>        
                                    <button className='browsebtn ant-btn post_need' style={{width:"50%",}}>Browse more</button>
                                </Link>
                            </div>   
                        </div>

                        <div className="visible-xs">
                            {totalAmount != '' ? <div className='panel-body'>
                                <div className='row' style={{margin:"0"}}>
                                    

                                    <div className="">
                                        <ul className='cartDetail'>
                                            <h2 style={{ fontWeight: 'bold' }}>Total Amount</h2>
                                            
                                            <li style={{ marginTop: "15px" }}>
                                                <span>Amount :</span>
                                                <span className="checkout-amount" > $ {amount}</span> 
                                            </li>
                                            <li style={{ marginTop: "15px" }}>
                                                <span>GST 10% :</span>
                                                <span className="checkout-amount" >$ {gst}</span>
                                            </li>
                                            <li style={{ marginTop: "15px" }}>
                                                <span>Pakjazba Fee 10% :</span> 
                                                <span className="checkout-amount">$ {pakjazbafee}</span>
                                            </li>
                                            <li style={{ marginTop: "15px" }}>
                                                <span>Total Amount:</span>
                                                <span className="checkout-amount" style={{ color:"rgb(217, 166, 126)"}}> $ {totalAmount}</span>
                                            </li>
                                            
                                        </ul>
                                        <button className='checkoutbtn ant-btn post_need col-md-2 col-sm-2 col-xs-12' onClick={this.checkOutFunc}>Proceed to checkout</button>
                                    </div>
                                </div>
                            </div> : null}
                        </div>

                        <div className="col-md-8 hidden-xs" style={{backgroundColor:"white", padding:"15px"}}>
                        {cartValue && cartValue.map((elem, key) => {
                        return (
                                    <div className='panel-body'>
                                        <div className="row" style={{padding:"10px"}}>
                                            <Checkbox onChange={onChange}>{elem.shopName}</Checkbox>
                                        </div>
                                        <hr/>
                                        <div className="row" style={{padding:"15px"}}>
                                            <div className="col-md-1 col-sm-1" style={{marginTop:"35px"}}>
                                                <Checkbox onChange={onChange}>
                                                </Checkbox>
                                            </div>
                                            <div className="col-md-2 col-sm-2">
                                                <img className='imgClass' src={elem.images[0]} />
                                            </div>
                                            <div className="col-md-6 col-sm-6">
                                                <ul className='cartDetail'>
                                                    <li>Product Name : {elem.productName}</li>
                                                </ul>
                                            </div>
                                            <div className="col-md-1 col-sm-1" style={{padding:"0",}}>
                                                <div className="">
                                                    <p style={{color: "rgb(217, 166, 126)"}}>$ 5000</p>
                                                </div>
                                                <s> $ {elem.price * elem.cartCount}</s>
                                                
                                                <div className="">
                                                 <p> 20 %</p>
                                                </div>
                                                
                                            </div>
                                            <div className="col-md-2 col-sm-2">
                                                <InputNumber min={1} max={10} defaultValue={elem.cartCount} onChange={this.onChange.bind(this, elem)} />
                                                <div>
                                                    <button type="button" class="trashbtn btn-link btn-xs" onClick={this.removeCartData.bind(this, elem, key)}>
                                                        <span class="glyphicon glyphicon-trash"> </span>
                                                    </button>
                                                </div>
                                            </div>

                                        </div> 
                                        
                                    </div>

                            
                        )
                    })}
                            <div>
                                <Link rel="noopener noreferrer" to={`/`} style={{ color: 'black', fontSize: '14px' }}>        
                                    <button className='browsebtn ant-btn post_need col-md-2 col-sm-2 col-xs-12' style={{width:"50%"}}>Browse more</button>
                                </Link>
                            </div>   
                        </div>




                        <div className="col-md-4 hidden-xs">
                            
                            {totalAmount != '' ? <div className='panel-body'>
                            <div className='row' style={{margin:"0"}}>
                                

                                <div className="">
                                    <ul className='cartDetail'>
                                        <h2 style={{ fontWeight: 'bold' }}>Total Amount</h2>
                                        
                                        <li style={{ marginTop: "15px" }}>
                                            <span>Amount :</span>
                                            <span className="checkout-amount" > $ {amount}</span> 
                                        </li>
                                        <li style={{ marginTop: "15px" }}>
                                            <span>GST 10% :</span>
                                            <span className="checkout-amount" >$ {gst}</span>
                                        </li>
                                        <li style={{ marginTop: "15px" }}>
                                            <span>Pakjazba Fee 10% :</span> 
                                            <span className="checkout-amount">$ {pakjazbafee}</span>
                                        </li>
                                        <li style={{ marginTop: "15px" }}>
                                            <span>Total Amount:</span>
                                            <span className="checkout-amount" style={{ color:"rgb(217, 166, 126)"}}> $ {totalAmount}</span>
                                        </li>
                                        
                                    </ul>
                                    <Link rel="noopener noreferrer" to={`/checkout_billing`}>
                                        <button className='checkoutbtn ant-btn post_need col-md-2 col-sm-2 col-xs-12' onClick={this.checkOutFunc}>Proceed to checkout</button>
                                    </Link>
                                </div>
                            </div>
                        </div> : null}
                    
                    
                        {hideBtn ?
                                <div className='row'> 
                                    
                                   
                                </div> : null}
                    {noRecordFound && <span style={{ textAlign: "center" }}><h1>Not found....</h1></span>}
                    {noRecordFound && <span style={{ textAlign: "center" }}><h5>you can't buy any product</h5></span>}
                    {noRecordFound && <div className="col-md-12" style={{ textAlign: "center" }}><button type="button" className="btn2 btn2-success" onClick={this.onAddMore}>Go Back</button></div>}
                    {this.state.visible &&
                        <Modal
                            title="Kindly enter credit cart detail"
                            visible={this.state.visible}
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                            width="800px"
                        >
                            <div className="row">
                                <div className="col-md-12" style={{ textAlign: 'center' }}>
                                    <StripeProvider stripe={stripe}>
                                        <div className="example">
                                            <Elements style={{ boxSizing: 'border-box' }}>
                                                <CheckoutForm chechkOutObj={chechkOutObj} modalsHideAndShow={this.modalsHideAndShow}
                                                    loaderFunc={this.loaderFunc} />
                                            </Elements>
                                        </div>
                                    </StripeProvider>
                                </div>
                            </div>
                            {loader && <div style={{ textAlign: 'center', marginLeft: '-100px', marginBottom: '15px' }}>
                                <Spin indicator={antIcon} />
                            </div>}
                        </Modal>
                    }
                    {succes &&
                        <Modal
                            title="Payment Succeeded"
                            visible={this.state.succes}
                            onOk={this.handleOk}
                            onCancel={this.handleCancelPayment}
                            width="300px"
                        >
                            <img src={imgSucces} alt="img" style={{ height: "250px" }} />
                        </Modal>
                    }
                    <div>

                    </div>
                        </div>
                    

                    </div>
                    

                </div>
                <footer>
                    {totalAmount == '' ?
                        <Footer footerPosition="fixedPositionOnCheckOutPage" />
                        :
                        <Footer footerPosition='fixedPositionOnCheckOutPage2' />
                    }
                    {/* // {totalAmount != '' ? footerPosition="fixedPositionOnCheckOutPage": footerPosition = 'fixedPositionOnCheckOutPage2' } */}

                </footer>
            </div>
        )
    }
}
export default CheckOutPage;
