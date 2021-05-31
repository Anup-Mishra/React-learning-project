import React, { useEffect, Suspense } from 'react';
import Layout from './Components/Layout/Layout';
import BurgerBuilder from './Containers/BurgerBuilder/BurgerBuilder';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import Logout from "./Containers/Auth/Logout/Logout";
import { connect } from 'react-redux';
import * as actions from './store/actions/index';
const Checkout = React.lazy(() => {
  return import('./Containers/Checkout/Checkout');
});
const Orders = React.lazy(() => {
  return import('./Containers/Orders/Orders');
});
const Auth = React.lazy(() => {
  return import('./Containers/Auth/Auth');
});
const App = props => {
  const {onTryAutoSignup} = props;
    useEffect(()=>{
      onTryAutoSignup();
    },[onTryAutoSignup]);

    let routes = (
      <Switch>
      <Route path='/auth' render={(props)=> <Auth {...props} />} />
      <Route path="/" component={BurgerBuilder} exact/>
      <Redirect to='/' />
      </Switch>
    );
    if(props.isAuthenticated){
      <Switch>
        <Route path="/checkout" render={(props)=> <Checkout {...props} />} />
     <Route path="/orders" render={(props)=> <Orders {...props} />} />
     <Route path="/logout" component={Logout} />
     <Route path='/auth' render={(props)=> <Auth {...props} />} />
     <Route path="/" component={BurgerBuilder} exact/>
     <Redirect to='/' />
     </Switch>
    }
  return (
    <div className="App">
     <Layout>
       <Suspense fallback={<p>Jai MahaKAAL</p>}>{routes}</Suspense>
          </Layout>
    </div>
  );
}


const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token!==null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(App));
