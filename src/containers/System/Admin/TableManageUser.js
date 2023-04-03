import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./TableManageUser.scss";
import * as actions from "../../../store/actions";
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
  render() {
    console.log("hoidanit check all users: ", this.props.listUsers);
    console.log("hoidanit check state: ", this.state.usersRedux);
    let arrUsers = this.state.usersRedux;
    return (
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
                    <button className="btn-edit">
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
