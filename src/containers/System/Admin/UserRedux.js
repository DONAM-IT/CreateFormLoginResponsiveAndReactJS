import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { LANGUAGES } from "../../../utils";
import * as actions from "../../../store/actions";
import "./UserRedux.scss";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

class UserRedux extends Component {
  constructor(props) {
    super(props);
    this.state = {
      genderArr: [],
      positionArr: [],
      roleArr: [],
      previewImgURL: "",
      isOpen: false,
    };
  }
  async componentDidMount() {
    //CÁCH FIRE ACTION
    this.props.getGenderStart();
    this.props.getPositionStart();
    this.props.getRoleStart();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    //render => didupdate
    //hiện tại(this) và quá khứ(previous)
    //[] [3]

    // [3] [3]
    if (prevProps.genderRedux !== this.props.genderRedux) {
      this.setState({
        genderArr: this.props.genderRedux,
      });
    }
    if (prevProps.roleRedux !== this.props.roleRedux) {
      this.setState({
        roleArr: this.props.roleRedux,
      });
    }
    if (prevProps.positionRedux !== this.props.positionRedux) {
      this.setState({
        positionArr: this.props.positionRedux,
      });
    }
  }

  handleOnchangeImage = (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file) {
      let objectUrl = URL.createObjectURL(file);
      this.setState({
        previewImgURL: objectUrl,
      });
    }

    // console.log("hoidanit check file 0: ", objectUrl);
  };

  openPreviewImage = () => {
    //!this.state.previewImgURL ~ this.state.previewImgURL === null
    if (!this.state.previewImgURL) return;
    this.setState({
      isOpen: true,
    });
  };
  render() {
    // console.log("hoidanit check state: ", this.state);
    let genders = this.state.genderArr;
    let roles = this.state.roleArr;
    console.log("hoidanit check roles ", roles);
    let positions = this.state.positionArr;
    let language = this.props.language; //this.props ko phải kiểu cha truyền sang con mà lấy từ redux sang react
    let isGetGenders = this.props.isLoadingGender;
    // console.log("hoidanit check state component: ", this.state);
    return (
      <div className="user-redux-container">
        <div className="title">
          LEARN REACT-REDUX VỚI "Hỏi Dân IT" YOUTUBE CHANNEL
        </div>
        <div className="user-redux-body">
          <div className="container">
            <div className="row">
              <div className="col-12 my-3">
                <FormattedMessage id="manage-user.add" />
              </div>
              <div className="col-12">
                {isGetGenders === true ? "Loading genders" : ""}
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
                  {positions &&
                    positions.length > 0 &&
                    positions.map((item, index) => {
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
                  <FormattedMessage id="manage-user.role" />
                </babel>
                <select className="form-control">
                  {roles &&
                    roles.length > 0 &&
                    roles.map((item, index) => {
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
                  <FormattedMessage id="manage-user.image" />
                </babel>
                <div className="preview-img-container">
                  <input
                    id="previewImg"
                    type="file"
                    hidden
                    onChange={(event) => this.handleOnchangeImage(event)}
                  />
                  <label className="label-upload" htmlFor="previewImg">
                    Tải ảnh <i className="fas fa-upload"></i>
                  </label>
                  <div
                    className="preview-image"
                    style={{
                      backgroundImage: `url(${this.state.previewImgURL})`,
                    }}
                    onClick={() => this.openPreviewImage()}
                  ></div>
                </div>
              </div>
              <div className="col-12 mt-3">
                <button className="btn btn-primary">
                  <FormattedMessage id="manage-user.save" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {this.state.isOpen === true && (
          <Lightbox
            mainSrc={this.state.previewImgURL}
            onCloseRequest={() => this.setState({ isOpen: false })}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    genderRedux: state.admin.genders,
    roleRedux: state.admin.roles,
    positionRedux: state.admin.positions,
    isLoadingGender: state.admin.isLoadingGender,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGenderStart: () => dispatch(actions.fetchGenderStart()),

    getPositionStart: () => dispatch(actions.fetchPositionStart()),

    getRoleStart: () => dispatch(actions.fetchRoleStart()),

    //  processLogout: () => dispatch(actions.processLogout()),
    // changeLanguageAppRedux: (language) =>
    //   dispatch(actions.changeLanguageApp(language)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
