import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./TableManageUser.scss";
import * as actions from "../../../store/actions";
import Pagination from "./Pagination";

class TableManageUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //đây là cái mảng hứng giá trị từ con redux về
      usersRedux: [],
      doctorReduxTemp: [],
      number: 0,
      length: 0,
      count: 0,
      // limit: 2,
    };
  }
  componentDidMount() {
    // const { pageKey, limitKey } = this.props;
    // this.props.getPostsLimitRedux(0); //0 là trang 1 vì index+ 1 (0+1)
    // this.props.fetchUserRedux();
  }
  handleChanePageFromParent = (number) => {
    const { limit, getAllDoctorsStartRedux } = this.props;
    getAllDoctorsStartRedux(number, limit);
  };
  //chạy sau khi hàm reder xảy ra
  componentDidUpdate(prevProps, prevState, snapshot) {
    // if (prevProps.listUsers !== this.props.listUsers) {
    //   //gán giá trị vào userRedux, this.setState bắt component render lại, ngay lập tức lấy được giá trị thôi
    //   this.setState({
    //     usersRedux: this.props.listUsers,
    //   });
    // }
    // if (prevProps.postsRedux !== this.props.postsRedux) {
    //   //gán giá trị vào userRedux, this.setState bắt component render lại, ngay lập tức lấy được giá trị thôi
    //   this.setState({
    //     usersRedux: this.props.postsRedux,
    //   });
    // }
    if (prevProps.doctorsRedux !== this.props.doctorsRedux) {
      //gán giá trị vào userRedux, this.setState bắt component render lại, ngay lập tức lấy được giá trị thôi
      this.setState({
        doctorReduxTemp: this.props.doctorsRedux,
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
    console.log("hoidanit check all users: ", this.props.doctorsRedux);
    console.log("hoidanit check state: ", this.state.usersRedux);

    // let arrUsers = this.state.usersRedux;
    // let count = this.props.countRedux;
    // let posts = this.props.postsRedux;
    let arrUsers = this.props.doctorsRedux;
    console.log("HELLO arrUsers", arrUsers);
    let count = this.props.countRedux;

    // console.log("Hoidanit check count by getPostsLimitRedux voi gia tri posta va posta: ", counta, posta.length);
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
        <Pagination
          pageKey={this.props.pageKey}
          limitKey={this.props.limitKey}
          location={this.props.location}
          history={this.props.history}
          params={this.props.params}
        />
      </table>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    //hứng kết quả
    listUsers: state.admin.users, //state.admin.users , admin là adminRedux lấy biến trong users ra, tức là giá trị nó lấy trong state redux của adminRedux
    postsRedux: state.admin.posts, //là danh sách limit trả về số dòng
    countRedux: state.admin.count, //tổng số record có trong db
    doctorsRedux: state.admin.doctors,
    totalRedux: state.admin.total,
    countRedux: state.admin.count,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()), //fire action
    deleteAUserRedux: (id) => dispatch(actions.deleteAUser(id)),
    getPostsLimitRedux: (page) => dispatch(actions.getPostsLimit(page)),
    getAllDoctorsStartRedux: (page, limit) =>
      dispatch(actions.getAllDoctorsStart(page, limit)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
