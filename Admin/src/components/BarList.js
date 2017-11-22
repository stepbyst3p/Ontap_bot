import React, { Component } from "react";
import { Link } from "react-router-dom";
import NewBeerForm from "./NewBeerForm";
import AddBeer from "./AddBeer";
import BeerList from "./BeerList";
import { app, base } from "../base";
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
    this.state = {
      showBeerAddFormForBarWithId: "",
      showBarEditFormForBarWithId: "",
      address: "",
      title: "",
      isBarEditFormShown: true,
      isBeerAddFormShown: true
    };
    this.onChange = address => this.setState({ address });
    this.onTitleChange = title => this.setState({ title });
  }
  showBeerAddForm(barId) {
    this.setState({
      showBeerAddFormForBarWithId: barId,
      isBeerAddFormShown: !this.state.isBeerAddFormShown
    });
  }
  showBarEditForm(barId) {
    this.setState({
      showBarEditFormForBarWithId: barId,
      isBarEditFormShown: !this.state.isBarEditFormShown
    });
  }
  updateBar(event) {
    event.preventDefault();
    geocodeByAddress(this.state.address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        const barRef = app
          .database()
          .ref(
            `users/${this.props.userUid}/bars/${this.state
              .showBarEditFormForBarWithId}`
          );
        debugger;
        const title = this.state.title;
        const address = this.state.address;
        const geocode = latLng;
        const updates = {};
        updates["title"] = title;
        updates["address"] = address;
        updates["geocode"] = geocode;
        console.log(updates);
        barRef.update(updates);
        console.log(this.state.isBarEditFormShown);
      })
      .catch(error => console.error("Error", error));
  }

  removeBar(barId) {
    const barRef = app
      .database()
      .ref(`users/${this.props.userUid}/bars/${barId}`);
    barRef.remove();
  }
  handleChangeBarTitleForm(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  render() {
    const { bars } = this.props;
    const barIds = Object.keys(bars);
    const inputProps = {
      value: this.state.address,
      onChange: this.onChange,
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
            return (
              <div
                key={id}
                style={barCardStyles}
                className="pt-card pt-elevation-2"
              >
                <div className="barHead">
                  {this.state.showBarEditFormForBarWithId === barId &&
                  this.state.isBarEditFormShown == false ? (
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
                          name="title"
                          type="text"
                          onChange={this.handleChangeBarTitleForm}
                          placeholder="Название бара"
                          required
                        />
                        <PlacesAutocomplete
                          inputProps={inputProps}
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
                      className="pt-button"
                      onClick={() => {
                        this.showBeerAddForm(barId);
                        console.log(this.state.isBeerAddFormShown);
                      }}
                    >
                      {`${emoji.beers}`} Ассортимент
                    </button>
                    <button
                      className="pt-button"
                      onClick={() => {
                        this.showBarEditForm(barId);
                        console.log(this.state.isBarEditFormShown);
                      }}
                    >
                      {`${emoji.pencil2}`} Редактировать
                    </button>
                    <button
                      className="pt-button"
                      onClick={() => this.removeBar(bar.id)}
                    >
                      {`${emoji.x}`} Удалить
                    </button>
                  </div>
                </div>
                {this.state.showBeerAddFormForBarWithId === barId &&
                this.state.isBeerAddFormShown == false ? (
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
