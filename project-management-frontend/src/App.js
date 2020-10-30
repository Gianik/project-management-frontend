import React from 'react';
import Login from './components/Login';
import Registration from './components/Registration';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Security from './components/Security';
import Members from './components/Member';
import Announcement from './components/Announcement';
import Navbar from './components/Navbar';
import Test from './components/Test'
const App = () => {
  return (
    <Router>
      <div className="App">
        <Switch>
          <ProtectedRoute exact={true} path="/" component={Dashboard} />
          <Route path="/Login" exact component={Login} />
          <Route path="/Registration" exact component={Registration} />
          <Route path="/Test" exact component={Test} />
          <ProtectedRoute path="/Dashboard" exact component={Dashboard} />
          <Route path="/Profile" exact component={Profile} />
          <ProtectedRoute path="/Security" exact component={Security} />
          <ProtectedRoute path="/Members" exact component={Members} />
          <ProtectedRoute path="/Announcement" exact component={Announcement} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;