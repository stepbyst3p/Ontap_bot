import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Popover, PopoverInteractionKind, Position } from "@blueprintjs/core";
import NewBarForm from "./NewBarForm";

class Header extends Component {
  constructor(props) {
    super(props);
    this.closePopover = this.closePopover.bind(this);
    this.state = {
      popoverOpen: false
    };
  }

  closePopover() {
    this.setState({ popoverOpen: false });
  }

  render() {
    return (
      <nav className="pt-navbar">
        <div className="pt-navbar-group pt-align-left">
          <div className="pt-navbar-heading">
            <img src="logo.svg" className="logo" alt="Ontap Bot" />{" "}
            <strong className="brandName">{`Ontap_Bot`}</strong>
          </div>
        </div>
        {this.props.authenticated ? (
          <div className="pt-navbar-group pt-align-right">
            <Link className="pt-button pt-minimal pt-icon-glass" to="/bars">
              Мои бары
            </Link>
            <Popover
              content={
                <NewBarForm
                  addBar={this.props.addBar}
                  postSubmitHandler={this.closePopover}
                />
              }
              interactionKind={PopoverInteractionKind.CLICK}
              isOpen={this.state.popoverOpen}
              onInteraction={state => this.setState({ popoverOpen: state })}
              position={Position.BOTTOM}
            >
              <button
                className="pt-button pt-minimal pt-icon-add"
                aria-label="add new bar"
              >
                Добавить
              </button>
            </Popover>
            <span className="pt-navbar-divider" />
            <button className="pt-button pt-minimal pt-icon-user" />
            <button className="pt-button pt-minimal pt-icon-cog" />
            <Link
              className="pt-button pt-minimal pt-icon-log-out"
              to="/logout"
              aria-label="Log Out"
            />
          </div>
        ) : (
          <div className="pt-navbar-group pt-align-right">
            <Link className="pt-button pt-intent-primary" to="/">
              Регистрация/Вход
            </Link>
          </div>
        )}
      </nav>
    );
  }
}

export default Header;
