import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { CookiesProvider, useCookies } from 'react-cookie';

import Home from './components/Home/Home';
import Login from './components/Login/Login';

import './App.css';

function ProtectedRoute({ component: Component, ...rest }) {

  const [ cookies ] = useCookies();

  return (<Route {...rest} render={(props) => {

    return cookies.jwtToken ? 
            (<Component {...props} />) 
            : 
            (<Redirect to='/login' />);
  }} />)
}

function App() {

  return (
    <CookiesProvider>
      <BrowserRouter>
        <Switch>
          <ProtectedRoute path="/" exact={true} component={Home} />
          <Route path="/login" exact={true} component={Login} />
        </Switch>
      </BrowserRouter>
    </CookiesProvider>
  );
}

export default App;
