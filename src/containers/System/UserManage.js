import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./UserManage.scss";
import { getAllUsers } from "../../services/userService";
import ModalUser from "./ModalUser";

class UserManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrUser: [],
      isOpenModalUser: false,
    };
  }

  async componentDidMount() {
    //gọi API - để lấy dữ liệu từ api về
    let response = await getAllUsers("ALL");
    if (response && response.errCode === 0) {
      //triger việc component nó tự render lại bắt buộc dùng hàm this.setSate
      this.setState({
        arrUser: response.users,
      });

      //Lưu ý: Hàm setState là hàm bất đồng bộ nên cần muốn in ra cái biến this.state.arrUser thì
      //phải dùng trong call back function, khi hàm trên chạy xong thì chạy hàm call back
      //NẾU CÓ ÍT DATA THÌ K BỊ BẤT ĐỒNG BỘ THÌ NÓ SET ĐC 2 CÁI STATE
      /**
          this.setState({
          arrUser: response.users,
         }, () => {
            console.log("check state user :", this.state.arrUser);
         });

          console.log("check state user 1:", this.state.arrUser);
        **/
    }
    // console.log("get user from node.js :", response);
  }

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
          test={"abc"}
        />
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
                      <button className="btn-edit">
                        <i className="fas fa-pencil-alt"></i>
                      </button>
                      <button className="btn-delete">
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
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