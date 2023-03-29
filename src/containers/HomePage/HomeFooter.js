import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";

class HomeFooter extends Component {
  render() {
    // let settings = this.props.settings;
    // console.log("check setting : ", settings);
    return (
      <div className="home-footer">
        <p>
          &copy; 2023 Hỏi Dân It với Eric.
          <a target="_blank" href="https://youtu.be/oDyCAgjQ7gY">
            More information, plesase visit my youtube channel. &#8594; Click
            here &#8592;
          </a>
        </p>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
