import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions";
import Navigator from "../../components/Navigator";
import { adminMenu, doctorMenu } from "./menuApp";
import "./Header.scss";
import { LANGUAGES, USER_ROLE } from "../../utils";
import { FormattedMessage } from "react-intl";
import _ from "lodash";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuApp: [], //mặc định sẽ là 1 mảng rỗng, tức menuApp sẽ render khi các bạn chạy app
    };
  }
  handChangeLanguage = (language) => {
    this.props.changeLanguageAppRedux(language);
  };
  componentDidMount() {
    let { userInfo } = this.props;
    let menu = [];
    //isEmpty check xem object có bị rỗng ko
    if (userInfo && !_.isEmpty(userInfo)) {
      let role = userInfo.roleId;
      console.log("role ", role);
      if (role === USER_ROLE.ADMIN) {
        menu = adminMenu;
      }
      if (role === USER_ROLE.DOCTOR) {
        menu = doctorMenu;
      }
    }
    this.setState({
      menuApp: menu,
    });
    // console.log("hoi dan it channel userinfor", this.props.userInfo);
  }
  render() {
    const { processLogout, language, userInfo } = this.props;
    // console.log("check userinfo ", userInfo);

    return (
      <div className="header-container">
        {/* thanh navigator */}
        <div className="header-tabs-container">
          <Navigator menus={this.state.menuApp} />
        </div>
        <div className="languages">
          <span className="welcome">
            <FormattedMessage id="homeheader.welcome" />{" "}
            {userInfo && userInfo.firstName ? userInfo.firstName : ""} !
          </span>
          <span
            className={
              language === LANGUAGES.VI ? "language-vi active" : "language-vi"
            }
            onClick={() => this.handChangeLanguage(LANGUAGES.VI)}
          >
            VN
          </span>
          <span
            className={
              language === LANGUAGES.EN ? "language-en active" : "language-en"
            }
            onClick={() => this.handChangeLanguage(LANGUAGES.EN)}
          >
            EN
          </span>
          {/* nút logout */}
          <div
            className="btn btn-logout"
            onClick={processLogout}
            title="Log out"
          >
            <i className="fas fa-sign-out-alt"></i>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    processLogout: () => dispatch(actions.processLogout()),
    changeLanguageAppRedux: (language) =>
      dispatch(actions.changeLanguageApp(language)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
