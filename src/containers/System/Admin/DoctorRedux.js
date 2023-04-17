import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import * as actions from "../../../store/actions";
import Pagination from "./Pagination";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import TableManageUser from "./TableManageUser";
import { withRouter } from "react-router";
import queryString from "query-string";
import { split } from "lodash";
import { emitter } from "../../../utils/emitter";

class DoctorRedux extends Component {
  constructor(props) {
    super(props);
    this.state = {
      genderArr: [],
      positionArr: [],
      roleArr: [],
      previewImgURL: "",
      isOpen: false,

      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
      gender: "",
      position: "",
      role: "",
      avatar: "",

      action: "",
      userEditId: "",

      //chúng ta cần thêm các biến state để lưu trữ thông tin phân trang, bao gồm:
      doctors: [],
      doctor: {},
      loading: false,
      error: null,
      page: 1, // Số trang hiện tại
      limit: 2, // Số lượng bản ghi trên mỗi trang
      total: 0,
    };
    this.listenToEmitter();
  }

  // handlefetchData = async (pageNumber) => {
  //   const response = await fetch(
  //     `/api/doctors?page=${searchParams.get("Page")}`
  //   );
  //   console.log(response);
  // };
  listenToEmitter() {
    const { location, history, params } = this.props;
    // const searchParams = new URLSearchParams(location.search);

    emitter.on("EVENT_CURENT_PAGE", () => {
      const searchParams = new URLSearchParams(window.location.search);
      const currentPage = searchParams.get("page");
      console.log("CurrentPage DoctorRedux", currentPage);
      this.setState(
        {
          page: currentPage,
        },
        () => {
          console.log(">>>>>THIS.PAGE NEW", this.state.page);
          let offset = +this.state.page || 1;
          this.props.getAllDoctorsStartRedux(offset, this.state.limit);
        }
      );
    });
  } //bus event

  async componentDidMount() {
    //CÁCH FIRE ACTION
    this.props.getGenderStart();
    this.props.getPositionStart();
    this.props.getRoleStart();

    // let offset = this.state.page ? +this.state.page - 1 : 0;
    // // this.props.getPostsLimitRedux(offset);
    this.props.getAllDoctorsStartRedux(this.state.page, this.state.limit);
    // const { location, history, params } = this.props;
    // console.log(
    //   "HEEEEEEEE",
    //   location.pathname.split("/system/user-doctor/?page=")
    // );
    // const searchParams = new URLSearchParams(location.search);
    // const currentPage = searchParams.get("page");
    // console.log("CurrentPage", currentPage);
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    //render => didupdate
    //hiện tại(this) và quá khứ(previous)
    //[] [3]

    // [3] [3]
    if (prevProps.genderRedux !== this.props.genderRedux) {
      let arrGenders = this.props.genderRedux;
      this.setState({
        genderArr: arrGenders,
        gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].key : "",
      });
    }

    if (prevProps.roleRedux !== this.props.roleRedux) {
      let arrRoles = this.props.roleRedux;
      this.setState({
        roleArr: arrRoles,
        role: arrRoles && arrRoles.length > 0 ? arrRoles[0].key : "",
      });
    }

    if (prevProps.positionRedux !== this.props.positionRedux) {
      let arrPositions = this.props.positionRedux;
      this.setState({
        positionArr: arrPositions,
        position:
          arrPositions && arrPositions.length > 0 ? arrPositions[0].key : "",
      });
    }
    //khi có sự thay đổi của người dùng ta set lại giá trị
    if (prevProps.listUsers !== this.props.listUsers) {
      let arrGenders = this.props.genderRedux;
      let arrRoles = this.props.roleRedux;
      let arrPositions = this.props.positionRedux;

      this.setState(
        {
          email: "",
          password: "",
          firstName: "",
          lastName: "",
          phoneNumber: "",
          address: "",
          gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].key : "",
          role: arrRoles && arrRoles.length > 0 ? arrRoles[0].key : "",
          position:
            arrPositions && arrPositions.length > 0 ? arrPositions[0].key : "",
          avatar: "",
          action: CRUD_ACTIONS.CREATE,
          previewImgURL: "",
        }
        // ,
        // () => {
        //   console.log("hoidanit callback check state ", this.state);
        // }
      );
    }
    // if (prevProps.doctorsRedux !== this.props.doctorsRedux) {
    //   let arrGenders = this.props.genderRedux;
    //   let arrRoles = this.props.roleRedux;
    //   let arrPositions = this.props.positionRedux;

    //   this.setState(
    //     {
    //       email: "",
    //       password: "",
    //       firstName: "",
    //       lastName: "",
    //       phoneNumber: "",
    //       address: "",
    //       gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].key : "",
    //       role: arrRoles && arrRoles.length > 0 ? arrRoles[0].key : "",
    //       position:
    //         arrPositions && arrPositions.length > 0 ? arrPositions[0].key : "",
    //       avatar: "",
    //       action: CRUD_ACTIONS.CREATE,
    //       previewImgURL: "",
    //     }
    //     // ,
    //     // () => {
    //     //   console.log("hoidanit callback check state ", this.state);
    //     // }
    //   );
    // }
  }

  handleOnchangeImage = async (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      // console.log("hoidanit base64 image: ", base64);
      let objectUrl = URL.createObjectURL(file);
      this.setState({
        previewImgURL: objectUrl,
        avatar: base64,
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

  handleSaveUser = () => {
    let isValid = this.checkValidateInput();
    if (isValid === false) return;

    let { action } = this.state;

    if (action === CRUD_ACTIONS.CREATE) {
      //fire redux create user
      this.props.createNewUser({
        email: this.state.email,
        password: this.state.password,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        address: this.state.address,
        phoneNumber: this.state.phoneNumber,
        gender: this.state.gender,
        roleId: this.state.role,
        positionId: this.state.position,
        avatar: this.state.avatar,
      });
      // console.log("hoidanit before submit check state: ", this.state);

      // setTimeout(() => {
      //   this.props.fetchUserRedux();
      // }, 1000);
    }
    if (action === CRUD_ACTIONS.EDIT) {
      //fire redux edit user
      this.props.editAUserRedux({
        //BÊN NODEJS
        // user.firstName = data.firstName;
        // user.lastName = data.lastName;
        // user.address = data.address;
        // user.roleId = data.roleId;
        // user.positionId = data.positionId;
        // user.gender = data.gender;
        // user.phonenumber = data.phoneNumber;
        id: this.state.userEditId,
        email: this.state.email,
        password: this.state.password,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        address: this.state.address,
        phonenumber: this.state.phoneNumber,
        gender: this.state.gender,
        roleId: this.state.role,
        positionId: this.state.position,
        avatar: this.state.avatar,
      });
    }
  };

  checkValidateInput = () => {
    let isValid = true;
    let arrCheck = [
      "email",
      "password",
      "firstName",
      "lastName",
      "phoneNumber",
      "address",
    ];

    for (let i = 0; i < arrCheck.length; i++) {
      if (!this.state[arrCheck[i]]) {
        isValid = false;
        alert("This input is required: " + arrCheck[i]);
        break;
      }
    }

    return isValid;
  };

  onChangeInput = (event, id) => {
    let copyState = { ...this.state };

    copyState[id] = event.target.value;
    this.setState(
      {
        ...copyState,
      }
      // ,
      // () => {
      //   console.log("hoidanit check input onchange: ", this.state);
      // }
    );
  };

  handleEditUserFromParent = (user) => {
    // console.log("hoidanit check handle edit user from parent: ", user);
    let imageBase64 = "";
    if (user.image) {
      imageBase64 = new Buffer(user.image, "base64").toString("binary");
    }

    this.setState(
      {
        // user.email là do bên backend_nodejs đặt như nào thì y vậy, phụ thuộc thông tin vào nodejs
        email: user.email,
        password: "HARDCODE",
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phonenumber,
        address: user.address,
        gender: user.gender,
        role: user.roleId,
        position: user.positionId,
        avatar: "",
        previewImgURL: imageBase64,
        action: CRUD_ACTIONS.EDIT,
        userEditId: user.id,
      }
      // ,
      // () => {
      //   console.log("hoidanit check base64: ", this.state);
      // }
    );
  };

  render() {
    // console.log("hoidanit check state: ", this.state);
    let genders = this.state.genderArr;
    let roles = this.state.roleArr;
    // console.log("hoidanit check roles ", roles);
    let positions = this.state.positionArr;
    let language = this.props.language; //this.props ko phải kiểu cha truyền sang con mà lấy từ redux sang react
    let isGetGenders = this.props.isLoadingGender;
    // console.log("hoidanit check state component: ", this.state);
    // let email = this.state.email;

    let {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      address,
      gender,
      position,
      role,
      avatar,
    } = this.state;

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
                <input
                  className="form-control"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    this.onChangeInput(event, "email");
                  }}
                  disabled={
                    this.state.action === CRUD_ACTIONS.EDIT ? true : false
                  }
                />
              </div>
              <div className="col-3">
                <babel>
                  <FormattedMessage id="manage-user.password" />
                </babel>
                <input
                  className="form-control"
                  type="password"
                  value={password}
                  onChange={(event) => {
                    this.onChangeInput(event, "password");
                  }}
                  disabled={
                    this.state.action === CRUD_ACTIONS.EDIT ? true : false
                  }
                />
              </div>
              <div className="col-3">
                <babel>
                  <FormattedMessage id="manage-user.first-name" />
                </babel>
                <input
                  className="form-control"
                  type="text"
                  value={firstName}
                  onChange={(event) => {
                    this.onChangeInput(event, "firstName");
                  }}
                />
              </div>
              <div className="col-3">
                <babel>
                  <FormattedMessage id="manage-user.last-name" />
                </babel>
                <input
                  className="form-control"
                  type="text"
                  value={lastName}
                  onChange={(event) => {
                    this.onChangeInput(event, "lastName");
                  }}
                />
              </div>
              <div className="col-3">
                <babel>
                  <FormattedMessage id="manage-user.phone-number" />
                </babel>
                <input
                  className="form-control"
                  type="text"
                  value={phoneNumber}
                  onChange={(event) => {
                    this.onChangeInput(event, "phoneNumber");
                  }}
                />
              </div>
              <div className="col-9">
                <babel>
                  <FormattedMessage id="manage-user.address" />
                </babel>
                <input
                  className="form-control"
                  type="text"
                  value={address}
                  onChange={(event) => {
                    this.onChangeInput(event, "address");
                  }}
                />
              </div>
              <div className="col-3">
                <babel>
                  <FormattedMessage id="manage-user.gender" />
                </babel>
                <select
                  className="form-control"
                  onChange={(event) => {
                    this.onChangeInput(event, "gender");
                  }}
                  value={gender} //để lấy giá trị mặc định
                >
                  {genders &&
                    genders.length > 0 &&
                    genders.map((item, index) => {
                      return (
                        <option key={index} value={item.key}>
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
                <select
                  className="form-control"
                  onChange={(event) => {
                    this.onChangeInput(event, "position");
                  }}
                  value={position}
                >
                  {positions &&
                    positions.length > 0 &&
                    positions.map((item, index) => {
                      return (
                        <option key={index} value={item.key}>
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
                <select
                  className="form-control"
                  onChange={(event) => {
                    this.onChangeInput(event, "role");
                  }}
                  value={role}
                >
                  {roles &&
                    roles.length > 0 &&
                    roles.map((item, index) => {
                      return (
                        <option key={index} value={item.key}>
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
              <div className="col-12 my-3">
                <button
                  className={
                    this.state.action === CRUD_ACTIONS.EDIT
                      ? "btn btn-warning"
                      : "btn btn-primary"
                  }
                  onClick={() => this.handleSaveUser()}
                >
                  {this.state.action === CRUD_ACTIONS.EDIT ? (
                    <FormattedMessage id="manage-user.edit" /> //khai file dịch
                  ) : (
                    <FormattedMessage id="manage-user.save" />
                  )}
                </button>
              </div>
              <div className="col-12 mb-5">
                <TableManageUser
                  pageKey={this.state.page}
                  limitKey={this.state.limit}
                  handleEditUserFromParentKey={this.handleEditUserFromParent}
                  location={this.props.location}
                  history={this.props.history}
                  params={new URLSearchParams(this.props.location.search)}
                />
              </div>
              {/* <div>
                <Pagination />
              </div> */}
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
    listUsers: state.admin.users,
    postsRedux: state.admin.posts, //là danh sách limit trả về số dòng length
    countRedux: state.admin.count, //tổng số record có trong db
    doctorsRedux: state.admin.doctors,
    totalRedux: state.admin.total,
    countRedux: state.admin.count,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGenderStart: () => dispatch(actions.fetchGenderStart()),

    getPositionStart: () => dispatch(actions.fetchPositionStart()),

    getRoleStart: () => dispatch(actions.fetchRoleStart()),

    createNewUser: (data) => dispatch(actions.createNewUser(data)),

    fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()), //fire action

    editAUserRedux: (data) => dispatch(actions.editAUser(data)), //đặt tên 1 cái key editAUserRedux để fire action redux là editAUser
    //  processLogout: () => dispatch(actions.processLogout()),
    // changeLanguageAppRedux: (language) =>
    //   dispatch(actions.changeLanguageApp(language)),
    getPostsLimitRedux: (page) => dispatch(actions.getPostsLimit(page)),
    getAllDoctorsStartRedux: (page, limit) =>
      dispatch(actions.getAllDoctorsStart(page, limit)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DoctorRedux));
