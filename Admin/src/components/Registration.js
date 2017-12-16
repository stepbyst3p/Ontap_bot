import React, { Component } from "react";
import { Toaster, Intent } from "@blueprintjs/core";
import axios from "axios";
import cors from "cors";

class Registration extends Component {
  constructor() {
    super();
    this.handleChangeForm = this.handleChangeForm.bind(this);
    this.handleSubmitForm = this.handleSubmitForm.bind(this);
    this.state = {
      name: "",
      email: "",
      barTitle: "",
      barCity: "",
      barAddress: "",
      requestStatus: ""
    };
  }
  handleChangeForm = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  handleSubmitForm = e => {
    e.preventDefault();

    const { name, email, barTitle, barCity, barAddress } = this.state;
    debugger;
    console.log(this.state);
    fetch("/registration", {
      method: "post",
      credentials: "include",
      mode: cors,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: {
        name,
        email,
        barTitle,
        barCity,
        barAddress
      }
    })
      .then(res => {
        console.log(res);
        this.toaster.show({
          intent: Intent.SUCCESS,
          message:
            "Заявка на регистрацию успешно отправлена. Мы свяжемся с вами, как только проверим все данные"
        });
        this.setState({
          requestStatus: "sended"
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const { name, email, barTitle, barCity, barAddress } = this.state;
    return (
      <div>
        <Toaster
          ref={element => {
            this.toaster = element;
          }}
        />
        {this.state.requestStatus === "sended" ? null : (
          <form onSubmit={this.handleSubmitForm}>
            <div
              style={{ marginBottom: "10px" }}
              className="pt-callout pt-icon-user"
            >
              <h5>Регистрация</h5>
            </div>
            <label className="pt-label">
              Имя
              <input
                style={{ width: "100%" }}
                className="pt-input"
                name="name"
                type="text"
                placeholder="Имя"
                value={name}
                onChange={this.handleChangeForm}
              />
            </label>
            <label className="pt-label">
              Email
              <input
                style={{ width: "100%" }}
                className="pt-input"
                name="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={this.handleChangeForm}
              />
            </label>
            <label className="pt-label">
              Название бара
              <input
                style={{ width: "100%" }}
                className="pt-input"
                name="barTitle"
                type="text"
                placeholder="Название бара"
                value={barTitle}
                onChange={this.handleChangeForm}
              />
            </label>
            <label className="pt-label">
              Город
              <input
                style={{ width: "100%" }}
                className="pt-input"
                name="barCity"
                type="text"
                placeholder="Город"
                value={barCity}
                onChange={this.handleChangeForm}
              />
            </label>
            <label className="pt-label">
              Адрес
              <input
                style={{ width: "100%" }}
                className="pt-input"
                name="barAddress"
                type="text"
                placeholder="Адрес"
                value={barAddress}
                onChange={this.handleChangeForm}
              />
            </label>
            <input
              style={{ width: "100%" }}
              type="submit"
              className="pt-button pt-intent-primary"
              value="Отправить заявку на регистрацию"
            />
          </form>
        )}
      </div>
    );
  }
}

export default Registration;
