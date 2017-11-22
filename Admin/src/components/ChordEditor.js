import React, { Component } from "react";
import { Link } from "react-router-dom";
import ChordSheetJS from "chordsheetjs";

class ChordEditor extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const bar = { ...this.props.item };
    bar.chordpro = event.target.value;
    debugger;

    this.props.updateBar(bar);
  }

  getChordMarkup() {
    const formatter = new ChordSheetJS.HtmlFormatter();
    const parser = new ChordSheetJS.ChordProParser();
    const bar = parser.parse(this.props.item.chordpro);

    return { __html: formatter.format(bar) };
  }

  render() {
    const { item: bar } = this.props;

    return (
      <div>
        <ul className="pt-breadcrumbs">
          <li>
            <Link to="/bars" className="pt-breadcrumb">
              Bars
            </Link>
          </li>
          <li>
            <Link to="#" className="pt-breadcrumb">
              {bar.title}
            </Link>
          </li>
        </ul>
        <h2 style={{ margin: "0.5em 0" }}>{bar.title}</h2>
        <div className="chord-editor">
          <div className="panel">
            <h3>Input</h3>
            <textarea
              style={{ width: "100%", height: "100%" }}
              onChange={this.handleChange}
              value={bar.chordpro}
            />
          </div>
          <div className="panel">
            <h3>Output</h3>
            <div
              style={{ width: "100%", height: "100%", fontFamily: "monospace" }}
              className="chord-output"
              dangerouslySetInnerHTML={this.getChordMarkup()}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default ChordEditor;
