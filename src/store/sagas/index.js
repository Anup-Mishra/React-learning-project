import { checkAuthTimeoutSaga, logoutSaga, authUserSaga, authCheckStateSaga } from './auth';
import { takeEvery,all,takeLatest } from 'redux-saga/effects';
import * as actionTypes from '../actions/actionTypes';
import { initIngredientsSaga } from './burgerBuilder';
import { fetchedOrdersSaga, purchaseBurgerSaga } from './orders';

export function* watchAuth(){
    yield all([
        takeEvery(actionTypes.AUTH_INITIATE_LOGOUT,logoutSaga),
        takeEvery(actionTypes.AUTH_CHECK_TIMEOUT,checkAuthTimeoutSaga),
        takeEvery(actionTypes.AUTH_USER,authUserSaga),
        takeEvery(actionTypes.AUTH_CHECK_INITIAL_STATE,authCheckStateSaga)
    ]);
}

export function* watchBurgerBuilder(){
    yield takeLatest(actionTypes.INIT_INGREDIENTS,initIngredientsSaga);
}

export function* watchOrder(){
    yield takeEvery(actionTypes.PURCHASE_BURGER,purchaseBurgerSaga); 
    yield takeEvery(actionTypes.FETCH_ORDERS,fetchedOrdersSaga); 
}