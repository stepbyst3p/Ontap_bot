import React, { Component } from "react";
import { app } from "../base";
import { emoji } from "node-emoji";

class AddBeer extends Component {
  constructor() {
    super();
    this.state = {
      beerTitle: "",
      beerBrewery: "",
      beerStyle: "",
      beerAlc: "",
      EditingBeerTitle: "",
      EditingBeerBrewery: "",
      EditingBeerStyle: "",
      EditingBeerAlc: "",
      barId: "",
      beers: [],
      beerId: "",
      showBeerEditFormForBeerWithId: "",
      isBeerEditFormShown: true
    };
    this.handleChangeBeerForm = this.handleChangeBeerForm.bind(this);
    this.handleSubmitBeerForm = this.handleSubmitBeerForm.bind(this);
    this.handleChangeEditBeerForm = this.handleChangeEditBeerForm.bind(this);
    this.removeBeer = this.removeBeer.bind(this);
    this.showBeerEditForm = this.showBeerEditForm.bind(this);
  }

  showBeerEditForm(beerId) {
    this.setState({
      beerId: beerId,
      showBeerEditFormForBeerWithId: beerId,
      isBeerEditFormShown: !this.state.isBeerEditFormShown
    });
  }
  updateBeer(event) {
    event.preventDefault();
    const beerRef = app
      .database()
      .ref(
        `users/${this.props.userUid}/bars/${this.props.barId}/beers/${this.state
          .showBeerEditFormForBeerWithId}`
      );
    debugger;
    const beerTitle = this.state.EditingBeerTitle;
    const beerBrewery = this.state.EditingBeerBrewery;
    const beerStyle = this.state.EditingBeerStyle;
    const beerAlc = this.state.EditingBeerAlc;
    const updates = {};
    updates["beerTitle"] = beerTitle;
    updates["beerBrewery"] = beerBrewery;
    updates["beerStyle"] = beerStyle;
    updates["beerAlc"] = beerAlc;
    console.log(updates);
    beerRef.update(updates);
    console.log(this.state.isBeerEditFormShown);
  }

  componentDidMount() {
    const beersRef = app
      .database()
      .ref(`users/${this.props.userUid}/bars/${this.props.barId}/beers`);
    beersRef.on("value", snapshot => {
      let beers = snapshot.val();
      let newState = [];
      for (let beer in beers) {
        newState.push({
          id: beer,
          beerTitle: beers[beer].beerTitle,
          beerBrewery: beers[beer].beerBrewery,
          beerStyle: beers[beer].beerStyle,
          beerAlc: beers[beer].beerAlc
        });
      }
      this.setState({
        beers: newState
      });
    });
  }
  removeBeer(beerId) {
    const beerRef = app
      .database()
      .ref(
        `users/${this.props.userUid}/bars/${this.props.barId}/beers/${beerId}`
      );
    beerRef.remove();
  }
  handleChangeBeerForm(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  handleChangeEditBeerForm(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  handleSubmitBeerForm(e) {
    e.preventDefault();
    const beersRef = app
      .database()
      .ref(`users/${this.props.userUid}/bars/${this.props.barId}/beers`);
    debugger;
    const beer = {
      beerTitle: this.state.beerTitle,
      beerBrewery: this.state.beerBrewery,
      beerStyle: this.state.beerStyle,
      beerAlc: this.state.beerAlc
    };
    beersRef.push(beer);
    // this.setState({
    //   [e.target.name]: e.target.value
    // });
  }

  render() {
    return (
      <div>
        <div className="beer-form">
          <form
            onSubmit={this.handleSubmitBeerForm}
            className="pt-inline form-addBeer"
          >
            <input
              type="text"
              name="beerTitle"
              className="pt-input "
              placeholder="Название Пива"
              onChange={this.handleChangeBeerForm}
              value={this.state.beerTitle}
              required
            />
            <input
              type="text"
              className="pt-input "
              name="beerBrewery"
              placeholder="Пивоварня"
              onChange={this.handleChangeBeerForm}
              value={this.state.beerBrewery}
              required
            />
            <input
              type="text"
              className="pt-input "
              name="beerStyle"
              placeholder="Стиль"
              onChange={this.handleChangeBeerForm}
              value={this.state.beerStyle}
              required
            />
            <input
              type="number"
              className="pt-input "
              name="beerAlc"
              placeholder="Алкоголь"
              onChange={this.handleChangeBeerForm}
              value={this.state.beerAlc}
              required
            />
            <button className="pt-button pt-intent-success">
              Добавить кран
            </button>
          </form>
        </div>

        <table className="pt-table" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Название</th>
              <th>Пивоварня</th>
              <th>Стиль</th>
              <th>Алкоголь (%)</th>
            </tr>
          </thead>
          <tbody>
            {this.state.beers.map(beer => {
              let beerId = beer.id;
              return (
                <tr key={beer.id}>
                  <td>
                    {this.state.showBeerEditFormForBeerWithId === beerId &&
                    this.state.isBeerEditFormShown == false ? (
                      <input
                        type="text"
                        name="EditingBeerTitle"
                        className="pt-input "
                        placeholder="Название Пива"
                        onChange={this.handleChangeEditBeerForm}
                        value={this.state.EditingBeerTitle}
                        required
                        form="beerEditForm"
                      />
                    ) : (
                      beer.beerTitle
                    )}
                  </td>
                  <td>
                    {this.state.showBeerEditFormForBeerWithId === beerId &&
                    this.state.isBeerEditFormShown == false ? (
                      <input
                        type="text"
                        className="pt-input "
                        name="EditingBeerBrewery"
                        placeholder="Пивоварня"
                        onChange={this.handleChangeEditBeerForm}
                        value={this.state.EditingBeerBrewery}
                        required
                        form="beerEditForm"
                      />
                    ) : (
                      beer.beerBrewery
                    )}
                  </td>
                  <td>
                    {this.state.showBeerEditFormForBeerWithId === beerId &&
                    this.state.isBeerEditFormShown == false ? (
                      <input
                        type="text"
                        className="pt-input "
                        name="EditingBeerStyle"
                        placeholder="Стиль"
                        onChange={this.handleChangeEditBeerForm}
                        value={this.state.EditingBeerStyle}
                        required
                        form="beerEditForm"
                      />
                    ) : (
                      beer.beerStyle
                    )}
                  </td>
                  <td>
                    {this.state.showBeerEditFormForBeerWithId === beerId &&
                    this.state.isBeerEditFormShown == false ? (
                      <input
                        type="number"
                        className="pt-input "
                        name="EditingBeerAlc"
                        placeholder="Алкоголь"
                        onChange={this.handleChangeEditBeerForm}
                        value={this.state.EditingBeerAlc}
                        required
                        form="beerEditForm"
                      />
                    ) : (
                      beer.beerAlc
                    )}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {this.state.showBeerEditFormForBeerWithId === beerId &&
                    this.state.isBeerEditFormShown == false ? (
                      <button
                        className="pt-button pt-icon-floppy-disk pt-minimal"
                        form="beerEditForm"
                      >
                        Сохранить
                      </button>
                    ) : null}
                    <button
                      className="pt-button pt-icon-edit pt-minimal"
                      onClick={() => {
                        this.showBeerEditForm(beerId);
                        console.log(beerId);
                      }}
                    />
                    <button
                      className="pt-button pt-icon-delete pt-minimal"
                      onClick={() => this.removeBeer(beer.id)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <form
          id="beerEditForm"
          onSubmit={event => {
            this.updateBeer(event);
            this.showBeerEditForm(this.state.beerId);
          }}
        />
      </div>
    );
  }
}

export default AddBeer;
