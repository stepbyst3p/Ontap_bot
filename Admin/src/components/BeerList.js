import React, { Component } from "react";
import { Link } from "react-router-dom";
import NewBeerForm from "./NewBeerForm";
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

class BeerList extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { beers } = this.props;
    const beerIds = Object.keys(beers);
    return (
      <div>
        <div style={barListStyles}>
          {beerIds.map(id => {
            const beer = beers[id];
            let beerId = beer.id;
            return (
              <div
                key={id}
                style={barCardStyles}
                className="pt-card pt-elevation-0 pt-interactive"
              >
                <p>{beer.title}</p>
                <p>{beer.brewery}</p>
                <p>{beer.style}</p>
                <p>{beer.alc}</p>
                {/* <h5>
                  <Link to={`/bars/${id}`}>{bar.title}</Link>
                </h5>
                <button
                  onClick={() => {
                    this.showBeerAddForm(barId);
                  }}
                >
                  Добавить пиво
                </button>
                {this.state.showBeerAddFormForBarWithId === barId ? (
                  <NewBeerForm addBeer={this.props.addBeer} barId={bar.id} />
                ) : null}*/}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default BeerList;
