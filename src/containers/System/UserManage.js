import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./UserManage.scss";
import {
  getAllUsers,
  createNewUserService,
  deleteUserService,
  editUserService,
} from "../../services/userService";
import ModalUser from "./ModalUser";
import ModalEditUser from "./ModalEditUser";
import { emitter } from "../../utils/emitter";

class UserManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrUser: [],
      isOpenModalUser: false,
      isOpenModalEditUser: false,
      userEdit: {},
    };
  }

  async componentDidMount() {
    await this.getAllUsersFromReact();
  }

  getAllUsersFromReact = async () => {
    let response = await getAllUsers("ALL");
    if (response && response.errCode === 0) {
      //triger việc component nó tự render lại bắt buộc dùng hàm this.setSate
      this.setState({
        arrUser: response.users,
      });
    }
  };
  handleAddNewUser = () => {
    this.setState({
      isOpenModalUser: true,
    });
    // alert("click me");
  };
  toggleUserModal = () => {
    this.setState({
      isOpenModalUser: !this.state.isOpenModalUser,
    });
  };

  toggleUserEditModal = () => {
    this.setState({
      isOpenModalEditUser: !this.state.isOpenModalEditUser,
    });
  };

  createNewUser = async (data) => {
    try {
      let response = await createNewUserService(data);
      if (response && response.errCode !== 0) {
        alert(response.errMessage);
      } else {
        await this.getAllUsersFromReact();
        this.setState({
          isOpenModalUser: false,
        });
        // emitter.emit("EVENT_CLEAR_MODAL_DATA", { id: "your id" }); //muốn truyền data
        emitter.emit("EVENT_CLEAR_MODAL_DATA");
      }
      // console.log("response create user: ", response);
    } catch (e) {
      console.log(e);
    }

    // console.log("check data from child : ", data);
  };

  handleDeleteUser = async (user) => {
    // console.log("Click delete", user);
    try {
      let res = await deleteUserService(user.id);
      console.log(res);
      if (res && res.errCode === 0) {
        await this.getAllUsersFromReact();
      } else {
        alert(res.errMessage);
      }
    } catch (e) {
      console.log(e);
    }
  };

  handleEditUser = (user) => {
    console.log("check edit user ", user);
    this.setState({
      isOpenModalEditUser: true,
      userEdit: user,
    });
  };

  doEditUser = async (user) => {
    try {
      let res = await editUserService(user);
      // console.log("Click save user: ", res);
      //có phản hồi và res.errCode trả về 0
      if (res && res.errCode === 0) {
        this.setState({
          isOpenModalEditUser: false, // đóng modal
        });
        this.getAllUsersFromReact(); //gọi lại hàm getAllUsersFromReact để thấy thông tin cập
      } else {
        alert(res.errCode);
      }
    } catch (e) {
      console.log(e);
    }
  };

  /** Life cycle
   *  Run component:
   * 1. Run construct -> init state //tức là khai báo các biến muốn dùng
   * 2. Did mount(set state): born >< unmount muốn gán giá trị cho 1 biến state nào đấy trước khi render ra màn hình
   * 3. Render (re-render)
   *
   */
  render() {
    let arrUser = this.state.arrUser;
    console.log(arrUser);
    //properties ; nested
    return (
      <div className="users-container">
        <ModalUser
          isOpen={this.state.isOpenModalUser}
          toggleFromParent={this.toggleUserModal}
          // test={"abc"}
          createNewUser={this.createNewUser} //truyền sang props thằng con (modelUser)
        />
        {this.state.isOpenModalEditUser && (
          <ModalEditUser
            isOpen={this.state.isOpenModalEditUser}
            toggleFromParent={this.toggleUserEditModal}
            currentUser={this.state.userEdit}
            editUser={this.doEditUser} //truyền sang props thằng con (modelUser)
          />
        )}

        <div className="title text-center">Manage users with Eric</div>
        <div className="mx-1">
          <button
            className="btn btn-primary px-3"
            onClick={() => this.handleAddNewUser()}
          >
            <i className="fas fa-plus"></i> Add new users
          </button>
        </div>
        <div className="users-table mt-3 mx-1">
          <table id="customers">
            <tbody>
              <tr>
                <th>Email</th>
                <th>First name</th>
                <th>Last name</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>

              {arrUser &&
                arrUser.map((item, index) => {
                  // console.log("eric check map ", item, index);
                  return (
                    <tr key={index}>
                      <td>{item.email}</td>
                      <td>{item.firstName}</td>
                      <td>{item.lastName}</td>
                      <td>{item.address}</td>
                      <td>
                        <button
                          className="btn-edit"
                          onClick={() => this.handleEditUser(item)}
                        >
                          <i className="fas fa-pencil-alt"></i>
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => this.handleDeleteUser(item)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
