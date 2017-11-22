import React, { Component } from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from "react-places-autocomplete";
const newBarStyles = {
  padding: "10px"
};

class NewBarForm extends Component {
  constructor(props) {
    super(props);
    this.createBar = this.createBar.bind(this);
    this.state = { address: "", title: "" };
    this.onChange = address => this.setState({ address });
    this.onTitleChange = title => this.setState({ title });
  }

  createBar(event) {
    event.preventDefault();
    geocodeByAddress(this.state.address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        debugger;
        const title = this.state.title;
        const address = this.state.address;
        this.props.addBar(title, address, latLng);
      })
      .catch(error => console.error("Error", error));
    this.barForm.reset();
    this.props.postSubmitHandler();
  }
  handleChangeBarTitleForm(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  render() {
    const inputProps = {
      value: this.state.address,
      onChange: this.onChange,
      required: true
    };
    const cssForAddressInput = {
      input: "pt-input"
    };
    return (
      <div style={newBarStyles}>
        <form
          onSubmit={event => this.createBar(event)}
          ref={form => (this.barForm = form)}
        >
          <label className="pt-label">
            Название бара
            <input
              style={{ width: "100%" }}
              className="pt-input"
              name="title"
              type="text"
              onChange={e => this.handleChangeBarTitleForm(e)}
              placeholder="Название бара"
              required
            />
          </label>
          <label className="pt-label">
            Адрес
            <PlacesAutocomplete
              inputProps={inputProps}
              classNames={cssForAddressInput}
            />
          </label>
          <input
            style={{ width: "100%" }}
            type="submit"
            className="pt-button pt-intent-warning"
            value="Создать бар"
          />
        </form>
      </div>
    );
  }
}

export default NewBarForm;
