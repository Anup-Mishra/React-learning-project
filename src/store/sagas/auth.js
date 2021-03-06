import { put, call } from 'redux-saga/effects';
import * as actionTypes from '../actions/actionTypes';
import delay from 'redux-saga';
import * as actions from '../actions/index';
import axios from 'axios';

export function* logoutSaga(action) {
    yield call([localStorage,"removeItem"],"expirationDate");//these way makes it easily testable by mocking these thing  
    yield localStorage.removeItem('userId');
    yield localStorage.removeItem('token');
    yield put({
        type: actionTypes.AUTH_LOGOUT
    });
}

export function* checkAuthTimeoutSaga(action){
    yield delay(action.expirationTime*1000);
    yield put(actions.logout());
}

export function* authUserSaga(action){
        put(actions.authStart());
        const authData = {
            email: action.email,
            password: action.password,
            returnSecureToken: true
        };
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDhskbIzh1Hhjhqbf7Z-Q3LHjkiWx6d-yc';
        if(!action.isSignup){
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDhskbIzh1Hhjhqbf7Z-Q3LHjkiWx6d-yc';
        }
        try{
        const response = yield axios.post(url,authData)
        const expirationDate = yield new Date(new Date().getTime() + response.data.expiresIn*1000);
        yield localStorage.setItem('expirationDate',expirationDate);
        yield localStorage.setItem('token',response.data.idToken);
        yield localStorage.setItem('userId',response.data.localId);
        yield put(actions.checkAuthTimeout(response.data.expiresIn));
        yield put(actions.authSuccess(response.data.idToken,response.data.localId));
        }catch(error){
            yield put(actions.authFail(error.response.data.error));
        }
}

export function* authCheckStateSaga(action){
    const token = yield localStorage.getItem('token');
        if(!token){
            yield put(actions.logout())
        }else{
            const expirationDate = yield new Date(localStorage.getItem('expirationDate'));
            if(expirationDate <= new Date()){
                yield put(actions.logout()); 
            }else{
                const userId = yield localStorage.getItem('userId');
                yield put(actions.authSuccess(token,userId));
                yield put(actions.checkAuthTimeout((expirationDate.getTime()-new Date().getTime()))/1000);
            }
        }
}