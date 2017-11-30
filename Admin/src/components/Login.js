import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Registration from "./Registration";
import {
  Toaster,
  Intent,
  Tabs,
  TabList,
  Tab,
  TabPanel
} from "@blueprintjs/core";
import { app, facebookProvider } from "../base";

const loginStyles = {
  width: "90%",
  maxWidth: "315px",
  margin: "20px auto",
  border: "1px solid #ddd",
  borderRadius: "5px",
  padding: "10px"
};

class Login extends Component {
  constructor(props) {
    super(props);
    this.authWithFacebook = this.authWithFacebook.bind(this);
    this.authWithEmailPassword = this.authWithEmailPassword.bind(this);
    this.state = {
      redirect: false
    };
  }

  authWithFacebook() {
    app
      .auth()
      .signInWithPopup(facebookProvider)
      .then((user, error) => {
        if (error) {
          this.toaster.show({
            intent: Intent.DANGER,
            message: "Unable to sign in with Facebook"
          });
        } else {
          this.props.setCurrentUser(user);
          this.setState({ redirect: true });
        }
      });
  }

  authWithEmailPassword(event) {
    event.preventDefault();

    const email = this.emailInput.value;
    const password = this.passwordInput.value;

    app
      .auth()
      .fetchProvidersForEmail(email)
      .then(providers => {
        // if (providers.length === 0) {
        //   return app.auth().createUserWithEmailAndPassword(email, password);
        // } else
        if (providers.indexOf("password") === -1) {
          // they used facebook
          this.loginForm.reset();
          this.toaster.show({
            intent: Intent.WARNING,
            message: "Неверный логин или пароль."
          });
        } else {
          // sign user in
          return app.auth().signInWithEmailAndPassword(email, password);
        }
      })
      .then(user => {
        if (user && user.email) {
          this.loginForm.reset();
          this.props.setCurrentUser(user);
          this.setState({ redirect: true });
        }
      })
      .catch(error => {
        this.toaster.show({ intent: Intent.DANGER, message: error.message });
      });
  }

  render() {
    const { from } = this.props.location.state || {
      from: { pathname: "/bars" }
    };

    if (this.state.redirect === true) {
      return <Redirect to={from} />;
    }

    return (
      <div style={loginStyles}>
        <Toaster
          ref={element => {
            this.toaster = element;
          }}
        />
        {/* <button
          style={{ width: "100%" }}
          className="pt-button pt-intent-primary"
          onClick={() => {
            this.authWithFacebook();
          }}
        >
          Log In with Facebook
        </button>
        <hr style={{ marginTop: "10px", marginBottom: "10px" }} /> */}
        <Tabs>
          <TabList>
            <Tab>Вход</Tab>
            <Tab>Регистрация</Tab>
          </TabList>
          <TabPanel>
            {" "}
            <form
              onSubmit={event => {
                this.authWithEmailPassword(event);
              }}
              ref={form => {
                this.loginForm = form;
              }}
            >
              <div
                style={{ marginBottom: "10px" }}
                className="pt-callout pt-icon-log-in"
              >
                <h5>Вход в панель управления</h5>
              </div>
              <label className="pt-label">
                Email
                <input
                  style={{ width: "100%" }}
                  className="pt-input"
                  name="email"
                  type="email"
                  ref={input => {
                    this.emailInput = input;
                  }}
                  placeholder="Email"
                />
              </label>
              <label className="pt-label">
                Пароль
                <input
                  style={{ width: "100%" }}
                  className="pt-input"
                  name="password"
                  type="password"
                  ref={input => {
                    this.passwordInput = input;
                  }}
                  placeholder="Пароль"
                />
              </label>
              <input
                style={{ width: "100%" }}
                type="submit"
                className="pt-button pt-intent-primary"
                value="Войти в личный кабинет"
              />
            </form>
          </TabPanel>
          <TabPanel>
            <Registration />
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

export default Login;
