import React, { useEffect, useState } from 'react';
import Input from '../../Components/UI/Input/Input';
import Button from '../../Components/UI/Button/Button';
import classes from "./Auth.module.css";
import * as actions from '../../store/actions/auth';
import { connect } from 'react-redux';
import Spinner from '../../Components/UI/Spinner/Spinner';
import { Redirect } from 'react-router-dom';
import { updateObject, checkValidity } from '../../shared/utility';
const Auth = props => {
    const [controls,setControls] = useState({
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Mail Address'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
        password: {
            elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 7
                },
                valid: false,
                touched: false
            }});
        const [isSignup,setIsSignup] = useState(true);
    
        const {burgerBuilding,authRedirectPath,onSetAuthRedirectPath} = props;
    useEffect(()=> {
        if(!burgerBuilding && authRedirectPath!=='/'){
            onSetAuthRedirectPath();
        }
    },[burgerBuilding,authRedirectPath,onSetAuthRedirectPath]);

    const submitHandler = (event) => {
        event.preventDefault();
        props.onAuth(controls.email.value,controls.password.value,isSignup);
    }

    const inputChangedHandler = (event,controlName)=>{
        const updatedControls = updateObject(controls,{
            [controlName]: updateObject(controls[controlName],{
                value: event.target.value,
                valid: checkValidity(event.target.value,controls[controlName].validation),
                touched: true
            })
        });
        setControls(updatedControls);
    }

    const switchModeHandler = ()=> {
        setIsSignup(!isSignup);
    }

        const formElementsArray = [];
        for(let keys in controls){
            formElementsArray.push({
                id:keys,
                config: controls[keys]
            })
        }
        let form = formElementsArray.map(formElement => (
            <Input elementType={formElement.config.elementType} 
            key={formElement.id}
            elementConfig={formElement.config.elementConfig}
            invalid={!formElement.config.valid}
            shouldValidate={formElement.config.validation}
            touched={formElement.config.touched}
            value={formElement.config.value} changed={(event)=>inputChangedHandler(event,formElement.id)}/>
        ));

        if(props.loading){
            form = <Spinner />
        }
        let errorMessage = null;
        if(props.error){
            errorMessage = (
                <p>{props.error.message}</p>
            );
        }
        let authRedirect = null;
        if(props.isAuthenticated){
            authRedirect = <Redirect to={props.authRedirectPath} />
        }
        return(
            <div className={classes.Auth}>
                {authRedirect}
                {errorMessage}
            <form onSubmit={submitHandler}>
                {form}
                <Button btnType="Success">SUBMIT</Button>
            </form>
            <Button btnType="Danger" clicked={switchModeHandler}>SWITCH TO {isSignup?'SIGNIN':'SIGNUP'}</Button>
            </div>
        );
    };


const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token!=null,
        burgerBuilding: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email,password,isSignup) => dispatch(actions.auth(email,password,isSignup)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Auth);