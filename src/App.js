import React from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

import { persistor } from "./Redux/store";
import { PersistGate } from "redux-persist/integration/react";

import "./App.css";

import firebase from "./firebase";

import { connect } from "react-redux";
import { setCurrentUser } from "./Redux/User/user.action";
import { UserSelector } from "./Redux/User/User.selector";
import { createStructuredSelector } from "reselect";

import Homepage from "./components/Homepage/Homepage";
import Auth from "./components/Auth/Auth";
import Dashboard from "./components/Dashboard/Dashboard";

class App extends React.Component {
  unSubscribeFromAuth = null;
  componentDidMount() {
    const { setCurrentUser } = this.props;

    this.unSubscribeFromAuth = firebase
      .auth()
      .onAuthStateChanged(async (userAuth) => {
        console.log("userAuth", userAuth);
        if (userAuth) {
          firebase
            .firestore()
            .collection("Users")
            .doc(userAuth.uid)
            .get()
            .then((doc) => setCurrentUser({ id: doc.id, ...doc.data() }));
        } else {
          setCurrentUser(userAuth);
        }
      });
  }

  componentWillUnmount() {
    this.unSubscribeFromAuth();
  }

  render() {
    return (
      <Router>
        <PersistGate persistor={persistor}>
          <Switch>
            <Route path="/account">
              {this.props.currentUser ? <Redirect to="/dashboard" /> : <Auth />}
            </Route>
            <Route path="/dashboard">
              {this.props.currentUser ? (
                <div>
                  <Route exact path="/dashboard">
                    <Dashboard />
                  </Route>
                </div>
              ) : (
                <Auth />
              )}
            </Route>

            <Route path="/" component={Homepage} />
          </Switch>
        </PersistGate>
      </Router>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});

const mapStatetoProps = createStructuredSelector({
  currentUser: UserSelector,
});

export default connect(mapStatetoProps, mapDispatchToProps)(App);
