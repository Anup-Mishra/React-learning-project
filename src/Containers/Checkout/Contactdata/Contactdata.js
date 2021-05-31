import React, { useState } from 'react';
import Button from '../../../Components/UI/Button/Button';
import classes from './Contactdata.module.css';
import axios from '../../../axios-orders';
import Spinner from '../../../Components/UI/Spinner/Spinner';
import Input from '../../../Components/UI/Input/Input';
import { connect } from 'react-redux';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';
import { updateObject, checkValidity } from '../../../shared/utility';
const ContactData = props => {
    const [orderForm,setOrderForm] = useState({
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            zipcode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'ZIP Code'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 5
                },
                valid: false,
                touched: false
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your E-mail'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'fastest', displayValue: 'Fastest'},
                        {value: 'cheapest', displayValue: 'Cheapest'}
                    ]
                },
                value: 'fastest',
                validation: {},
                valid: true
            }
        });
    
        const [formIsValid,setFormIsValid] = useState(false);
    

    const orderHandler = (event) => {
        event.preventDefault();
        let formData = {};
        for (let fromElementIdentifier in orderForm){
            formData[fromElementIdentifier] = orderForm[fromElementIdentifier].value
        }
        const order ={
            ingredients : props.ings,
            price : Number.parseFloat(props.price).toFixed(2),
            orderData: formData,
            userId: props.userId
        };
        props.onOrderBurger(order,props.token);
    }

    const inputChangeHandler = (event, inputIdentifier) => {
         const updatedFormElement = updateObject(orderForm[inputIdentifier],{
            value : event.target.value,
            touched : true,
            valid : checkValidity(event.target.value,orderForm[inputIdentifier].validation),
         });
         const updatedOrderForm = updateObject(orderForm,{
            [inputIdentifier] : updatedFormElement
         })
         let formIsValid = true;
         for(let inputIdentifier in updatedOrderForm){
             formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
         }
         setOrderForm(updatedOrderForm);
         setFormIsValid(formIsValid);
    }

        const formElementsArray = [];
        for(let keys in orderForm){
            formElementsArray.push({
                id:keys,
                config: orderForm[keys]
            })
        }
        let form= (
            <form onSubmit={orderHandler}>
            {formElementsArray.map(formElement => (
                <Input elementType={formElement.config.elementType} 
                key={formElement.id}
                elementConfig={formElement.config.elementConfig}
                invalid={!formElement.config.valid}
                shouldValidate={formElement.config.validation}
                touched={formElement.config.touched}
                value={formElement.config.value} changed={(event)=>inputChangeHandler(event,formElement.id)}/>
            ))};
            <Button btnType="Success" disabled={!formIsValid}>ORDER</Button>
            </form>
        );  
        if( props.loading){
            form= <Spinner />;
        }
        return(
            <div className={classes.ContactData}>
            <h4>Enter Your Contact Data</h4>
            {form}
        </div>
        )
    }


const mapStateToProps = state => {
    return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.price,
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData) => dispatch(actions.purchaseBurger(orderData))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(ContactData, axios));