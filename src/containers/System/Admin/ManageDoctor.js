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
import { LANGUAGES } from "../../../utils";

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
      contentMarkdown: "",
      contentHTML: "",
      selectedOption: "",
      description: "",
      listDoctors: [],
    };
  }
  componentDidMount() {
    this.props.fetchAllDoctors();
  }

  buildDataInputSelect = (inputData) => {
    let result = [];
    let { language } = this.props;
    if (inputData && inputData.length > 0) {
      inputData.map((item, index) => {
        let object = {};
        let labelVi = `${item.lastName} ${item.firstName}`;
        let labelEn = `${item.firstName} ${item.lastName}`;
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
      let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
      this.setState({
        listDoctors: dataSelect,
      });
    }
    //nếu ngôn ngữ thay đổi
    if (prevProps.language !== this.props.language) {
      let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
      this.setState({
        listDoctors: dataSelect,
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
    this.props.saveDetailDoctor({
      contentHTML: this.state.contentHTML,
      contentMarkdown: this.state.contentMarkdown,
      description: this.state.description,
      doctorId: this.state.selectedOption.value,
    });
    console.log("hoidanit check status", this.state);
  };
  handleChange = (selectedOption) => {
    this.setState({ selectedOption }, () =>
      console.log(`Option selected:`, this.state.selectedOption)
    );
  };

  handleOnChangeDesc = (event) => {
    this.setState({
      description: event.target.value, //giá trị mới trong `textarea` sẽ được lấy bằng `event.target.value`
    });
  };
  render() {
    console.log("hoidanitChannel: ", this.state);
    return (
      <div className="manage-doctor-container">
        <div className="manage-doctor-title">Tạo thêm thông tin doctors</div>
        <div className="more-infor">
          <div className="content-left form-group">
            <label>Chọn bác sĩ</label>
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChange}
              options={this.state.listDoctors}
            />
          </div>
          <div className="content-right">
            <label>Thông tin giới thiệu:</label>
            <textarea
              className="form-control"
              rows="4"
              // khi giá trị trong `textarea` thay đổi, hàm `handleOnChangeDesc` sẽ được gọi và truyền vào tham số `event`.
              // đồng thời sự kiện `onChange` sẽ được gắn với hàm `handleOnChangeDesc` để cập nhật giá trị trong state khi có sự thay đổi
              onChange={(event) => this.handleOnChangeDesc(event)}
              //giá trị của `value` sẽ được set bằng giá trị hiện tại của `description` trong state của component,
              value={this.state.description}
            >
              gsdfggdsg
            </textarea>
          </div>
        </div>
        <div className="manage-doctor-editor">
          <MdEditor
            style={{ height: "500px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={this.handleEditorChange} //đang truyền props xuống, đối với 1 biến props ko cần truyền arrow function
          />
        </div>
        <button
          onClick={() => this.handleSaveContentMarkdown()}
          className="save-content-doctor"
        >
          Lưu thông tin
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
    saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
