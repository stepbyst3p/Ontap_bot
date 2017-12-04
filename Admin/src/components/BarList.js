import React, { Component } from "react";
import AddBeer from "./AddBeer";
import { app } from "../base";
import { emoji } from "node-emoji";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
const barListStyles = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "center"
};

const barCardStyles = {
  width: "100%",
  margin: "5px"
};

class BarList extends Component {
  constructor(props) {
    super(props);
    this.showBeerAddForm = this.showBeerAddForm.bind(this);
    this.removeBar = this.removeBar.bind(this);
    this.handleChangeBarTitleForm = this.handleChangeBarTitleForm.bind(this);
    this.updateBar = this.updateBar.bind(this);
    this.state = {
      showBeerAddFormForBarWithId: "",
      showBarEditFormForBarWithId: "",
      EditingAddress: "",
      EditingTitle: "",
      isBarEditFormShown: true,
      isBeerAddFormShown: true
    };
    this.onEditAddressChange = EditingAddress =>
      this.setState({ EditingAddress });
  }
  showBeerAddForm(barId) {
    this.setState({
      showBeerAddFormForBarWithId: barId,
      isBeerAddFormShown: !this.state.isBeerAddFormShown
    });
  }
  showBarEditForm(barId, barTitle, barAddress) {
    this.setState({
      showBarEditFormForBarWithId: barId,
      isBarEditFormShown: !this.state.isBarEditFormShown,
      EditingTitle: barTitle,
      EditingAddress: barAddress
    });
  }
  updateBar(event) {
    event.preventDefault();
    const title = this.state.EditingTitle;
    const address = this.state.EditingAddress;
    geocodeByAddress(this.state.EditingAddress)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        debugger;
        console.log(this.state);
        const updates = {};
        updates["title"] = title;
        updates["address"] = address;
        updates["geocode"] = latLng;
        const barRef = app
          .database()
          .ref(
            `users/${this.props.userUid}/bars/${
              this.state.showBarEditFormForBarWithId
            }`
          );
        barRef.update(updates);
      })
      .catch(error => console.error("Error", error));
  }

  removeBar(barId) {
    const barRef = app
      .database()
      .ref(`users/${this.props.userUid}/bars/${barId}`);
    let confirmation = window.confirm(
      "Вы уверены, что хотите удалить бар и все данные, привязанные к нему?"
    );
    if (confirmation === true) {
      barRef.remove();
    } else {
      return false;
    }
  }
  handleChangeBarTitleForm(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  render() {
    const { bars } = this.props;
    const barIds = Object.keys(bars);
    const addressEditProps = {
      value: this.state.EditingAddress,
      onChange: this.onEditAddressChange,
      required: true,
      placeholder: "Адрес"
    };
    const cssForAddressInput = {
      input: "pt-input"
    };
    return (
      <div>
        <h1 style={{ margin: "0.5em auto", textAlign: "center" }}>Мои Бары</h1>

        <div style={barListStyles}>
          {barIds.map(id => {
            const bar = bars[id];
            let barId = bar.id;
            let barAddress = bar.address;
            let barTitle = bar.title;
            return (
              <div
                key={id}
                style={barCardStyles}
                className="pt-card pt-elevation-2"
              >
                <div className="barHead">
                  {this.state.showBarEditFormForBarWithId === barId &&
                  this.state.isBarEditFormShown === false ? (
                    <div className="barInfoEdit">
                      <form
                        onSubmit={event => {
                          this.updateBar(event);
                          this.showBarEditForm(barId);
                        }}
                        className="pt-inline form-editBar"
                      >
                        <input
                          className="pt-input"
                          name="EditingTitle"
                          type="text"
                          onChange={this.handleChangeBarTitleForm}
                          value={this.state.EditingTitle}
                          placeholder="Название бара"
                          required
                        />
                        <PlacesAutocomplete
                          inputProps={addressEditProps}
                          classNames={cssForAddressInput}
                        />
                        <input
                          type="submit"
                          className="pt-button pt-intent-success"
                          value="Сохранить"
                        />
                      </form>
                    </div>
                  ) : (
                    <div className="barInfo">
                      <div className="barTitle">
                        <h3>{bar.title}</h3>
                      </div>
                      <div className="barAddress">
                        {`${emoji.round_pushpin} ${bar.address}`}
                      </div>
                    </div>
                  )}
                  <div className="barControls">
                    <button
                      onClick={() => {
                        this.showBeerAddForm(barId);
                      }}
                      className="pt-button pt-icon-th-list pt-default"
                      onClick={() => {
                        this.showBeerAddForm(barId);
                      }}
                    >
                      Ассортимент
                    </button>
                    <button
                      className="pt-button pt-icon-edit pt-default"
                      onClick={() => {
                        this.showBarEditForm(barId, barTitle, barAddress);
                        console.log(this.state.isBarEditFormShown);
                      }}
                    >
                      Редактировать
                    </button>
                    <button
                      className="pt-button pt-icon-delete pt-default"
                      onClick={() => this.removeBar(bar.id)}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
                {this.state.showBeerAddFormForBarWithId === barId &&
                this.state.isBeerAddFormShown === false ? (
                  // <NewBeerForm
                  //   addBeer={this.props.addBeer}
                  //   barId={this.state.showBeerAddFormForBarWithId}
                  // />
                  <AddBeer
                    addBeer={this.props.addBeer}
                    barId={this.state.showBeerAddFormForBarWithId}
                    userUid={this.props.userUid}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default BarList;
