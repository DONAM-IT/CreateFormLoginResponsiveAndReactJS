import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./TableManageUser.scss";
import * as actions from "../../../store/actions";

import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
// import style manually
import "react-markdown-editor-lite/lib/index.css";

// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);

// Finish!
function handleEditorChange({ html, text }) {
  console.log("handleEditorChange", html, text);
}

class TableManageUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //đây là cái mảng hứng giá trị từ con redux về
      usersRedux: [],
    };
  }
  componentDidMount() {
    this.props.fetchUserRedux();
  }
  //chạy sau khi hàm reder xảy ra
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.listUsers !== this.props.listUsers) {
      //gán giá trị vào userRedux, this.setState bắt component render lại, ngay lập tức lấy được giá trị thôi
      this.setState({
        usersRedux: this.props.listUsers,
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
  render() {
    console.log("hoidanit check all users: ", this.props.listUsers);
    console.log("hoidanit check state: ", this.state.usersRedux);
    let arrUsers = this.state.usersRedux;
    return (
      <React.Fragment>
        <table id="TableManageUser">
          <tbody>
            <tr>
              <th>Email</th>
              <th>First name</th>
              <th>Last name</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
            {arrUsers &&
              arrUsers.length > 0 &&
              arrUsers.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.email}</td>
                    <td>{item.firstName}</td>
                    <td>{item.lastName}</td>
                    <td>{item.address}</td>
                    <td>
                      <button
                        onClick={() => this.handleEditUser(item)}
                        className="btn-edit"
                      >
                        <i className="fas fa-pencil-alt"></i>
                      </button>
                      <button
                        onClick={() => this.handleDeleteUser(item)}
                        className="btn-delete"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        <MdEditor
          style={{ height: "500px" }}
          renderHTML={(text) => mdParser.render(text)}
          onChange={handleEditorChange}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    //hứng kết quả
    listUsers: state.admin.users, //state.admin.users , admin là adminRedux lấy biến trong users ra, tức là giá trị nó lấy trong state redux của adminRedux
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()), //fire action
    deleteAUserRedux: (id) => dispatch(actions.deleteAUser(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
