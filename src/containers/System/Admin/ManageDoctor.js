import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./TableManageUser.scss";
import * as actions from "../../../store/actions";
import "./ManageDoctor.scss";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
// import style manually
import "react-markdown-editor-lite/lib/index.css";
import Select from "react-select";
import { LANGUAGES, CRUD_ACTIONS } from "../../../utils";
import { getDetailInforDoctor } from "../../../services/userService";
// const listDoctors = [
//   { value: "chocolate", label: "Chocolate" },
//   { value: "strawberry", label: "Strawberry" },
//   { value: "vanilla", label: "Vanilla" },
// ];

const mdParser = new MarkdownIt(/* Markdown-it options */);
class ManageDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //save to Markdown table
      contentMarkdown: "",
      contentHTML: "",
      selectedOption: "",
      description: "",
      listDoctors: [],
      hasOldData: false, //xem có thông tin cũ hay chưa

      //save to doctor_infor table
      listPrice: [],
      listPayment: [],
      listProvince: [],
      selectedPrice: "",
      selectedPayment: "",
      selectedProvince: "",
      nameClinic: "",
      addressClinic: "",
      note: "",
    };
  }
  componentDidMount() {
    this.props.fetchAllDoctors();
    this.props.getAllRequiredDoctorInfor();
  }

  buildDataInputSelect = (inputData, type) => {
    let result = [];
    let { language } = this.props;
    if (inputData && inputData.length > 0) {
      inputData.map((item, index) => {
        let object = {};
        let labelVi =
          type === "USERS"
            ? `${item.lastName} ${item.firstName}`
            : item.valueVi;
        let labelEn =
          type === "USERS"
            ? `${item.firstName} ${item.lastName}`
            : item.valueEn;
        object.label = language === LANGUAGES.VI ? labelVi : labelEn;
        object.value = item.id;
        result.push(object); // object gồm key là label và value đẩy vô mảng result
      });
    }

    return result;
  };

  //chạy sau khi hàm reder xảy ra
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.allDoctors !== this.props.allDoctors) {
      let dataSelect = this.buildDataInputSelect(
        this.props.allDoctors,
        "USERS"
      );
      this.setState({
        listDoctors: dataSelect,
      });
    }
    //nếu ngôn ngữ thay đổi
    if (prevProps.language !== this.props.language) {
      let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
      let { selectedOption } = this.state;
      if (dataSelect && dataSelect.length > 0) {
        let foundDoctor = dataSelect.find(
          (item) => item.value === selectedOption.value
        );
        if (foundDoctor) {
          selectedOption = {
            label: foundDoctor.label,
            value: foundDoctor.value,
          };
        }
        // else {
        //   selectedOption = dataSelect[0];
        // }
      }

      this.setState({
        listDoctors: dataSelect,
        selectedOption: selectedOption,
      });
    }

    if (
      prevProps.allRequiredDoctorInfor !== this.props.allRequiredDoctorInfor
    ) {
      // console.log(
      //   ">> hoidan  it get data from redux: ",
      //   this.props.allRequiredDoctorInfor
      // );

      let { resPayment, resPrice, resProvince } =
        this.props.allRequiredDoctorInfor;
      let dataSelectPrice = this.buildDataInputSelect(resPrice);
      let dataSelectPayment = this.buildDataInputSelect(resPayment);
      let dataSelectProvince = this.buildDataInputSelect(resProvince);

      console.log(
        "hoi dan it: data new: ",
        dataSelectPrice,
        dataSelectPayment,
        dataSelectProvince
      );
      this.setState({
        listPrice: dataSelectPrice,
        listPayment: dataSelectPayment,
        listProvince: dataSelectProvince,
      });
    }
  }
  handleDeleteUser = (user) => {
    // console.log("hoidanit delete the user: ", user);
    this.props.deleteAUserRedux(user.id); //dùng redux fire action, gọi đến tên fuction , fire action xóa người dùng bên file action
  };
  //đặt 1 cái action fire lên thằng cha
  handleEditUser = (user) => {
    //truyền dữ liệu từ thằng con sang thằng cha
    //cách này dùng khi và chỉ khi thằng con muốn gọi 1 hàm bên trên thằng cha
    // this.props.handleEditUserFromParentKey("data from child");
    this.props.handleEditUserFromParentKey(user);
  };

  // Finish!
  handleEditorChange = ({ html, text }) => {
    this.setState({
      contentMarkdown: text,
      contentHTML: html,
    });
    // console.log("handleEditorChange", html, text);
  };

  handleSaveContentMarkdown = () => {
    // alert("click me");
    let { hasOldData } = this.state;
    this.props.saveDetailDoctor({
      contentHTML: this.state.contentHTML,
      contentMarkdown: this.state.contentMarkdown,
      description: this.state.description,
      doctorId: this.state.selectedOption.value,
      action: hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,
    });
    // console.log("hoidanit check status", this.state);
  };
  handleChangeSelect = async (selectedOption) => {
    this.setState({ selectedOption });
    // console.log(`Option selected:`, selectedOption);
    let res = await getDetailInforDoctor(selectedOption.value);
    if (res && res.errCode === 0 && res.data && res.data.Markdown) {
      let markdown = res.data.Markdown;
      this.setState({
        contentHTML: markdown.contentHTML,
        contentMarkdown: markdown.contentMarkdown,
        description: markdown.description,
        hasOldData: true,
      });
    } else {
      this.setState({
        contentHTML: "",
        contentMarkdown: "",
        description: "",
        hasOldData: false,
      });
    }
    // console.log("hoi dan it channel:", res);
  };

  handleOnChangeDesc = (event) => {
    this.setState({
      description: event.target.value, //giá trị mới trong `textarea` sẽ được lấy bằng `event.target.value`
    });
  };
  render() {
    let { hasOldData } = this.state;

    // console.log("hoidanitChannel: ", this.state);
    return (
      <div className="manage-doctor-container">
        <div className="manage-doctor-title">
          <FormattedMessage id="admin.manage-doctor.title" />
        </div>
        <div className="more-infor">
          <div className="content-left form-group">
            <label>
              <FormattedMessage id="admin.manage-doctor.select-doctor" />
            </label>
            <Select
              value={this.state.selectedOption} //giá trị đầu vào, giá trị là current là cái bạn đang chọn hiện tại
              onChange={this.handleChangeSelect} //hàm onChange để cho nó thấy những thay đổi
              options={this.state.listDoctors} //là list danh sách mà các bạn cho người dùng chọn
              placeholder={"Chọn bác sĩ"}
            />
          </div>
          <div className="content-right">
            <label>
              <FormattedMessage id="admin.manage-doctor.intro" />
            </label>
            <textarea
              className="form-control"
              // khi giá trị trong `textarea` thay đổi, hàm `handleOnChangeDesc` sẽ được gọi và truyền vào tham số `event`.
              // đồng thời sự kiện `onChange` sẽ được gắn với hàm `handleOnChangeDesc` để cập nhật giá trị trong state khi có sự thay đổi
              onChange={(event) => this.handleOnChangeDesc(event)}
              //giá trị của `value` sẽ được set bằng giá trị hiện tại của `description` trong state của component,
              value={this.state.description}
            ></textarea>
          </div>
        </div>
        <div className="more-infor-extra row">
          <div className="col-4 form-group">
            <label>Chọn giá</label>
            <Select
              // value={this.state.selectedOption} //giá trị đầu vào, giá trị là current là cái bạn đang chọn hiện tại
              // onChange={this.handleChangeSelect} //hàm onChange để cho nó thấy những thay đổi
              options={this.state.listPrice} //là list danh sách mà các bạn cho người dùng chọn
              placeholder={"Chọn giá"}
            />
          </div>
          <div className="col-4 form-group">
            <label>Chọn phương thức thanh toán</label>
            <Select
              // value={this.state.selectedOption} //giá trị đầu vào, giá trị là current là cái bạn đang chọn hiện tại
              // onChange={this.handleChangeSelect} //hàm onChange để cho nó thấy những thay đổi
              options={this.state.listPayment} //là list danh sách mà các bạn cho người dùng chọn
              placeholder={"Chọn phương thức thanh toán"}
            />
          </div>
          <div className="col-4 form-group">
            <label>Chọn tỉnh thành</label>
            <Select
              // value={this.state.selectedOption} //giá trị đầu vào, giá trị là current là cái bạn đang chọn hiện tại
              // onChange={this.handleChangeSelect} //hàm onChange để cho nó thấy những thay đổi
              options={this.state.listProvince} //là list danh sách mà các bạn cho người dùng chọn
              placeholder={"Chọn tỉnh thành"}
            />
          </div>

          <div className="col-4 form-group">
            <label>Tên phòng khám</label>
            <input className="form-control"></input>
          </div>
          <div className="col-4 form-group">
            <label>Địa chỉ phòng khám</label>
            <input className="form-control"></input>
          </div>
          <div className="col-4 form-group">
            <label>Note</label>
            <input className="form-control"></input>
          </div>
        </div>
        <div className="manage-doctor-editor">
          <MdEditor
            style={{ height: "500px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={this.handleEditorChange} //đang truyền props xuống, đối với 1 biến props ko cần truyền arrow function
            value={this.state.contentMarkdown}
          />
        </div>
        <button
          onClick={() => this.handleSaveContentMarkdown()}
          className={
            hasOldData === true
              ? "save-content-doctor"
              : "create-content-doctor"
          }
        >
          {/* Lưu thông tin */}
          {hasOldData === true ? (
            <span>
              <FormattedMessage id="admin.manage-doctor.save" />
            </span>
          ) : (
            <span>
              <FormattedMessage id="admin.manage-doctor.add" />
            </span>
          )}
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    //hứng kết quả
    allDoctors: state.admin.allDoctors, //state.admin.users , admin là adminRedux lấy biến trong users ra, tức là giá trị nó lấy trong state redux của adminRedux
    allRequiredDoctorInfor: state.admin.allRequiredDoctorInfor,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
    getAllRequiredDoctorInfor: () => dispatch(actions.getRequiredDoctorInfor()),
    saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
