import React, { useState, useEffect, useCallback } from 'react';
import Aux from '../../hoc/Auxiliary';
import Burger from '../../Components/Burger/Burger';
import BuildControls from '../../Components/Burger/BuildControls/BuildControls';
import Modal from '../../Components/UI/Modal/Modal';
import OrderSummary from '../../Components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../Components/UI/Spinner/Spinner';
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import * as burgerBuilderactions from '../../store/actions/index';
import axios from '../../axios-orders';
import { useDispatch,useSelector } from 'react-redux';
export const BurgerBuilder = props => {
    const [purchasing,setPurchasing] = useState(false);
    const dispatch = useDispatch();
    const ings = useSelector(state => {
        return state.burgerBuilder.ingredients;
    });
    const price = useSelector(state => {
        return state.burgerBuilder.totalPrice;
    });
    const error = useSelector(state => {
        return state.burgerBuilder.error;
    });
    const isAuthenticated = useSelector(state => {
        return state.auth.token!==null;
    });
    const onIngredientAdded= (ingName) => dispatch(burgerBuilderactions.addIngredient(ingName));
    const onIngredientRemoved= (ingName) => dispatch(burgerBuilderactions.removeIngredient(ingName));
    const onInitIngredient= useCallback(() => dispatch(burgerBuilderactions.initIngredients()),[dispatch]);
    const onInitPurchase= () => dispatch(burgerBuilderactions.purchaseInit());
    const onSetAuthRedirectPath= (path) => dispatch(burgerBuilderactions.setAuthRedirectPath(path));

    useEffect(() => {
        onInitIngredient();
    },[onInitIngredient])

     const updatePurchaseState = (ingredients) => {
        const sum =Object.keys(ingredients).map(igKey => {
            return ingredients[igKey];
        }).reduce((sum,el)=>{
            return sum + el;
        }, 0);
        return sum>0;
    }
    
    const purchaseHandler = () => {
        if(isAuthenticated){
            setPurchasing(true);
        }else{
            onSetAuthRedirectPath('/checkout');
            props.history.push('/auth');
        }
    }

    const purchaseCancelHandler = () => {
        setPurchasing(false);
    }

    const puchaseContinueHandler = () => {
        onInitPurchase();
        props.history.push('/checkout');
    }

        const disabledInfo ={
            ...ings
        }
        for (let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary =  null;
        let burger = error?<p>Ingredients can't be loaded!</p>:<Spinner />;
        if(ings){
            burger =(
                <Aux>
                      <Burger ingredients={ings} />
                 <BuildControls ingredientAdded={onIngredientAdded}
                                ingredientRemoved={onIngredientRemoved}
                                disabled={disabledInfo}
                                purchasable={updatePurchaseState(ings)}
                                price={price}
                                ordered={purchaseHandler}
                                isAuth={isAuthenticated}/>
                </Aux>
            );
            orderSummary = <OrderSummary 
        price={price}
        purchaseCanceled={purchaseCancelHandler}
        purchaseContinued={puchaseContinueHandler}
        ingredients={ings} />; 
        }
        return(
            <Aux>
             <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
                {orderSummary}
             </Modal>
             {burger}
            </Aux>
        );
    }
export default withErrorHandler(BurgerBuilder, axios);