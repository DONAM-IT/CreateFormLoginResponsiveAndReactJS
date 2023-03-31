import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { getAllCodeService } from "../../../services/userService";
import { LANGUAGES } from "../../../utils";

class UserRedux extends Component {
  constructor(props) {
    super(props);
    this.state = {
      genderArr: [],
    };
  }
  async componentDidMount() {
    try {
      let res = await getAllCodeService("gender");
      if (res && res.errCode === 0) {
        this.setState({
          genderArr: res.data,
        });
      }
      console.log("Hoidanit check res: ", res);
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    // console.log("hoidanit check state: ", this.state);
    let genders = this.state.genderArr;
    let language = this.props.language;
    return (
      <div className="user-redux-container">
        <div className="title">
          Learn User-Redux "Hỏi Dân IT" youtube Channel
        </div>
        <div className="user-redux-body">
          <div className="container">
            <div className="row">
              <div className="col-12 my-3">
                <FormattedMessage id="manage-user.add" />
              </div>
              <div className="col-3">
                <babel>
                  <FormattedMessage id="manage-user.email" />
                </babel>
                <input className="form-control" type="email" />
              </div>
              <div className="col-3">
                <babel>
                  <FormattedMessage id="manage-user.password" />
                </babel>
                <input className="form-control" type="password" />
              </div>
              <div className="col-3">
                <babel>
                  <FormattedMessage id="manage-user.first-name" />
                </babel>
                <input className="form-control" type="text" />
              </div>
              <div className="col-3">
                <babel>
                  <FormattedMessage id="manage-user.last-name" />
                </babel>
                <input className="form-control" type="email" />
              </div>
              <div className="col-3">
                <babel>
                  <FormattedMessage id="manage-user.phone-number" />
                </babel>
                <input className="form-control" type="text" />
              </div>
              <div className="col-9">
                <babel>
                  <FormattedMessage id="manage-user.address" />
                </babel>
                <input className="form-control" type="text" />
              </div>
              <div className="col-3">
                <babel>
                  <FormattedMessage id="manage-user.gender" />
                </babel>
                <select className="form-control">
                  {genders &&
                    genders.length > 0 &&
                    genders.map((item, index) => {
                      return (
                        <option key={index}>
                          {language === LANGUAGES.VI
                            ? item.valueVi
                            : item.valueEn}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div className="col-3">
                <babel>
                  <FormattedMessage id="manage-user.position" />
                </babel>
                <select className="form-control">
                  <option selected>Choose...</option>
                  <option>...</option>
                </select>
              </div>
              <div className="col-3">
                <babel>
                  <FormattedMessage id="manage-user.role" />
                </babel>
                <select className="form-control">
                  <option selected>Choose...</option>
                  <option>...</option>
                </select>
              </div>
              <div className="col-3">
                <babel>
                  <FormattedMessage id="manage-user.image" />
                </babel>
                <input type="text" className="form-control" />
              </div>
              <div className="col-12 mt-3">
                <button className="btn btn-primary">
                  <FormattedMessage id="manage-user.save" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
