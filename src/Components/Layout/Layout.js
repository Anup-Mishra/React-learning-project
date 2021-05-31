import classes from './Layout.module.css';
import Aux from '../../hoc/Auxiliary';
import Toolbar from '../Navigation/Toolbar/Toolbar';
import SideDrawer from '../Navigation/SideDrawer/SideDrawer';
import React, { useState } from 'react';
import { connect } from 'react-redux';
const Layout = (props) => {
    const [sideDrawerIsVisible,setSideDrawerIsVisible] = useState(false);
    const sideDrawerCloseHandler = () => {
        setSideDrawerIsVisible(false);
    }
    const sideDrawerToggleHandler = () => {
        setSideDrawerIsVisible(!sideDrawerIsVisible);
    }
        return(
    <Aux>
    <Toolbar isAuth={props.isAuthenticated} drawerToggleClicked={sideDrawerToggleHandler}/>
    <SideDrawer isAuth={props.isAuthenticated} closed={sideDrawerCloseHandler} open={sideDrawerIsVisible} />
    <main className = {classes.Content}>
        {props.children}
    </main>
    </Aux>
        )};

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token!=null
    }
} 

export default connect(mapStateToProps)(Layout);
