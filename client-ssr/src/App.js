import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { CookiesProvider, useCookies } from 'react-cookie';

import Home from './components/Home/Home';
import Login from './components/Login/Login';

import './App.css';

function ProtectedRoute({ component: Component, ...rest }) {

  let jwtToken = null;
  const [ cookies ] = useCookies();

  if(rest.staticContext && rest.staticContext.serverCookies) {
    // Check for server side
    if(rest.staticContext.serverCookies.jwtToken) {
      jwtToken = rest.staticContext.serverCookies.jwtToken;
    }
  } else {
    // check for client side
    jwtToken = cookies.jwtToken;
  }
  

  return (<Route {...rest} render={(props) => {

    return jwtToken ? 
            (<Component {...props} />) 
            : 
            (<Redirect to='/login' />);
  }} />)
}

function App(props) {

  return (
    <CookiesProvider>
      <Switch>
        <ProtectedRoute 
          path="/"
          exact={true}
          component={Home} />
        <Route path="/login" exact={true} component={Login} />
      </Switch>
    </CookiesProvider>
  );
}

export default App;