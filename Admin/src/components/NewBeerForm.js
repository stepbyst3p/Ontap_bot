import React, { Component } from "react";

class NewBeerForm extends Component {
  constructor(props) {
    super(props);
    this.createBeer = this.createBeer.bind(this);
  }

  createBeer(event) {
    event.preventDefault();

    const Beer = {
      title: this.titleInput.value,
      brewery: this.breweryInput.value,
      style: this.styleInput.value,
      alc: this.alcInput.value,
      barId: this.props.barId
    };
    this.props.addBeer(Beer);
    this.beerForm.reset();
  }
  render() {
    return (
      <div>
        <form
          onSubmit={event => this.createBeer(event)}
          ref={form => (this.beerForm = form)}
        >
          <label className="pt-label">
            Название
            <input
              style={{ width: "100%" }}
              className="pt-input"
              name="title"
              type="text"
              ref={input => {
                this.titleInput = input;
              }}
              placeholder="Jigulyovskoye"
              required
            />
          </label>
          <label className="pt-label">
            Пивоварня
            <input
              style={{ width: "100%" }}
              className="pt-input"
              name="brewery"
              type="text"
              ref={input => {
                this.breweryInput = input;
              }}
              placeholder="Jigulyovskoye"
              required
            />
          </label>
          <label className="pt-label">
            Стиль
            <input
              style={{ width: "100%" }}
              className="pt-input"
              name="style"
              type="text"
              ref={input => {
                this.styleInput = input;
              }}
              placeholder="Jigulyovskoye"
              required
            />
          </label>
          <label className="pt-label">
            Алкоголь
            <input
              style={{ width: "100%" }}
              className="pt-input"
              name="alc"
              type="text"
              ref={input => {
                this.alcInput = input;
              }}
              placeholder="Jigulyovskoye"
              required
            />
          </label>
          <input
            style={{ width: "100%" }}
            type="submit"
            className="pt-button pt-intent-primary"
            value="Добавить Кран"
          />
        </form>
      </div>
    );
  }
}

export default NewBeerForm;
