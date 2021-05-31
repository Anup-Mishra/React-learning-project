import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import ContactData from '../Checkout/Contactdata/Contactdata';
import {connect} from 'react-redux';
import CheckoutSummary from '../../Components/Order/CheckoutSummary/CheckoutSummary';
const Checkout = props => {

    const checkoutCancelledHandler = () => {
        props.history.goBack();
    }

    const checkoutContinuedHandler = () => {
         props.history.replace('/checkout/contact-data');
    }

        let summary = <Redirect to='/' />
        let purchasedRedirect = props.purchased?<Redirect to='/' />:null;
        if(props.ings){
            summary = (
                <div>
                    {purchasedRedirect}
                <CheckoutSummary ingredients={props.ings}
                checkoutCancelled={checkoutCancelledHandler}
                checkoutContinued={checkoutContinuedHandler}/>
                <Route path={props.match.path+'/contact-data'} 
                component={ContactData} />
                </div>
            );
        }
        return(
                {summary}
        );
        /*as by rendering contactdata component in this way we cant access props containing
        history property provided by routing so we have to pass it in the arrow function.*/
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        purchased: state.order.purchased
    }
}

export default connect(mapStateToProps)(Checkout);