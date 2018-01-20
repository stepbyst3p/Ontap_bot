import React, { Component } from "react";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import { Spinner } from "@blueprintjs/core";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Logout from "./components/Logout";
import BarList from "./components/BarList";
import { app, base } from "./base";

function AuthenticatedRoute({ component: Component, authenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        authenticated === true ? (
          <Component {...props} {...rest} />
        ) : (
            <Redirect to={{ pathname: "/", state: { from: props.location } }} />
          )
      }
    />
  );
}

function ShowRoute({ component: Component, items, param, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ match, ...props }) => {
        if (rest.requireAuth === true && !rest.authenticated) {
          return (
            <Redirect to={{ pathname: "/", state: { from: props.location } }} />
          );
        }

        const item = items[match.params[param]];
        if (item) {
          return <Component item={item} {...props} match={match} {...rest} />;
        } else {
          return <h1>Not Found</h1>;
        }
      }}
    />
  );
}

class App extends Component {
  constructor(props) {
    super(props);
    this.setCurrentUser = this.setCurrentUser.bind(this);
    this.addBar = this.addBar.bind(this);
    this.addBeer = this.addBeer.bind(this);
    this.updateBar = this.updateBar.bind(this);
    // this.removeAuthListener = this.removeAuthListener.bind(this);
    this.state = {
      authenticated: false,
      currentUser: "currentUser",
      loading: true,
      bars: {},
      beers: {}
    };
  }

  addBar(title, address, latLng) {
    const bars = { ...this.state.bars };
    let id = Date.now();
    bars[id] = {
      id: id,
      title: title,
      address: address,
      geocode: latLng,
      chordpro: "",
      beers: [],
      owner: this.state.currentUser.uid
    };

    this.setState({ bars });
  }

  addBeer(Beer) {
    const beers = { ...this.state.beers };
    let id = Date.now();
    beers[id] = {
      id: id,
      title: Beer.title,
      brewery: Beer.brewery,
      style: Beer.style,
      alc: Beer.alc
    };
  }

  updateBar(bar) {
    const bars = { ...this.state.bars };
    bars[bar.id] = bar;

    this.setState({ bars });
  }

  setCurrentUser(user) {
    if (user) {
      this.setState({
        currentUser: user,
        authenticated: true
      });
    } else {
      this.setState({
        currentUser: null,
        authenticated: false
      });
    }
  }

  componentWillMount() {
    this.removeAuthListener = app.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          authenticated: true,
          currentUser: user,
          loading: false
        });

        this.barsRef = base.syncState(`users/${user.uid}/bars`, {
          context: this,
          state: "bars"
        });
        this.beersRef = base.syncState(`users/${user.uid}/bars/1510428673839`, {
          context: this,
          state: "beers"
        });
        // base.removeBinding(this.beersRef);
        console.log(this.state.bars);
      } else {
        this.setState({
          authenticated: false,
          currentUser: "currentUser",
          loading: false
        });

        base.removeBinding(this.barsRef);
      }
    });
  }

  componentWillUnmount() {
    this.removeAuthListener();
    base.removeBinding(this.barsRef);
    base.removeBinding(this.beersRef);
  }

  render() {
    if (this.state.loading === true) {
      return (
        <div
          style={{
            textAlign: "center",
            position: "absolute",
            top: "25%",
            left: "0",
            right: "0"
          }}
        >
          <h3>Загрузка личного кабинета</h3>
          <Spinner />
        </div>
      );
    }

    return (
      <div style={{ maxWidth: "1160px", margin: "0 auto" }}>
        <BrowserRouter>
          <div>
            <Header
              addBar={this.addBar}
              authenticated={this.state.authenticated}
            />
            <div className="main-content" style={{ padding: "1em" }}>
              <div className="workspace">
                <Route
                  exact
                  path="/"
                  render={props => {
                    return (
                      <Login setCurrentUser={this.setCurrentUser} {...props} />
                    );
                  }}
                />
                <Route exact path="/logout" component={Logout} />
                <AuthenticatedRoute
                  exact
                  path="/bars"
                  authenticated={this.state.authenticated}
                  component={BarList}
                  bars={this.state.bars}
                  addBeer={this.addBeer}
                  userUid={this.state.currentUser.uid}
                />
              </div>
            </div>
          </div>
        </BrowserRouter>
        <Footer />
      </div>
    );
  }
}

export default App;
