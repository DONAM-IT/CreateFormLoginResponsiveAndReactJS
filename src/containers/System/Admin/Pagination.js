import React, { Component } from "react";
import { connect } from "react-redux";
import PageNumber from "./PageNumber";
import * as actions from "../../../store/actions";
import "./Pagination.scss";
import icons from "../../../utils/icons";
import { withRouter } from "react-router-dom";
import { GrLinkPrevious } from "react-icons/gr";
const { GrLinkNext } = icons;

class Pagination extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrPage: [],
      currentPage: 1,
      setCurrentPage: 1,
      isHideEnd: false,
      isHideStart: false,
    };
  }

  handleChanePageFromParent1 = (limitKey) => {
    alert("hey handleChanePageFromParent1");
    this.props.getAllDoctorsStartRedux(1, limitKey);
  };
  handleChanePageFromParent2 = (offset, limit) => {
    // alert("hey handleChanePageFromParent2");
    this.props.getAllDoctorsStartRedux(offset, limit);
  };
  handleChanePageFromParent3 = (maxPage, limitKey) => {
    alert("hey handleChanePageFromParent3");
    this.props.getAllDoctorsStartRedux(maxPage, limitKey);
  };
  handlePageNumber = (count, length) => {
    let max = Math.ceil(count / length);
    let arrNumber = [];
    for (let i = 1; i <= max; i++) {
      arrNumber.push(i);
    }
    return arrNumber.length > 3 ? arrNumber.filter((i) => i < 4) : arrNumber;
    // return arrNumber;
  };
  render() {
    console.log(">>>> check props: ", this.props);
    const { limitKey, totalRedux, doctorsRedux, countRedux } = this.props;
    let arrPage = this.state.arrPage;
    let currentPage = this.props.pageKey;
    let maxPageNew = Math.floor(countRedux / totalRedux);
    console.log("maxPageNew", maxPageNew);
    let end = currentPage + 1 > maxPageNew ? maxPageNew : currentPage + 1;
    // console.log("end", end);
    let start = currentPage - 1 <= 0 ? 1 : currentPage - 1;
    // console.log("start", start);

    let temp = [];
    for (let i = start; i <= end; i++) {
      temp.push(i);
    }
    this.state.arrPage = temp;
    currentPage >= maxPageNew - 1
      ? (this.state.isHideEnd = true)
      : (this.state.isHideEnd = false);
    currentPage <= 2
      ? (this.state.isHideStart = true)
      : (this.state.isHideStart = false);

    console.log("arrPage", arrPage);
    const maxPage = Math.ceil(totalRedux / limitKey);
    const pages = [];
    for (let i = 1; i <= maxPage; i++) {
      pages.push(i);
    }
    let { pageKey } = this.props;

    // let count = this.props.countRedux;
    // let posts = this.props.postsRedux; //length
    // console.log(this.handlePageNumber(count, posts.length));
    //   let arrUsers = this.handlePageNumber(count, posts.length);
    let arrUsers = this.handlePageNumber(countRedux, totalRedux);
    // console.log("ARR số", this.handlePageNumber(count, posts.length));
    // let { GrLinkNext } = icons;
    // return (
    //   <div className="Pagination-container">
    //     <div className="pagination"></div>
    //   </div>
    // );
    return (
      //   <div className="Pagination-container">
      //     <div className="Pagination-content">
      //       {arrUsers > 1 && (
      //         <PageNumber
      //           number="&laquo;"
      //           handleChanePageFromParentKey1={this.handleChanePageFromParent1}
      //         />
      //       )}

      //       {arrUsers.map((item, index) => (
      //         <PageNumber
      //           key={item}
      //           number={item}
      //           active={item === arrUsers}
      //           handleChanePageFromParentKey2={this.handleChanePageFromParent2}
      //           //   handleClick={() =>
      //           //     this.props.getAllDoctorsStartRedux(item, limitKey)
      //           //   }
      //         />
      //       ))}

      //       {arrUsers < maxPage && (
      //         <PageNumber
      //           number="&raquo;"
      //           handleChanePageFromParentKey3={this.handleChanePageFromParent3}
      //           handleClick={() =>
      //             this.props.getAllDoctorsStartRedux(maxPage, limitKey)
      //           }
      //         />
      //       )}
      //     </div>
      //   </div>
      <div className="Pagination-container">
        <div className="Pagination-content">
          {!this.state.isHideStart && (
            <PageNumber
              icon={<GrLinkPrevious />}
              number={1}
              location={this.props.location}
              history={this.props.history}
              params={this.props.params}
            />
          )}
          {!this.state.isHideStart && <PageNumber number={"..."} />}

          {arrPage &&
            arrPage.length > 0 &&
            arrPage.map((item, index) => {
              return (
                <PageNumber
                  location={this.props.location}
                  history={this.props.history}
                  params={this.props.params}
                  key={item}
                  number={item}
                  currentPage={this.props.pageKey || 1}
                  limitPage={this.props.limitKey}
                  handleChanePageFromParentPagination={
                    this.handleChanePageFromParent2
                  }
                />
              );
            })}
          {!this.state.isHideEnd && <PageNumber number={"..."} />}
          {!this.state.isHideEnd && (
            <PageNumber
              location={this.props.location}
              history={this.props.history}
              params={this.props.params}
              // limitKey2={this.props.limitKey}
              handleChanePageFromParentPagination={
                this.handleChanePageFromParent2
              }
              icon={<GrLinkNext />}
              number={Math.floor(countRedux / totalRedux)}
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    //hứng kết quả
    listUsers: state.admin.users, //state.admin.users , admin là adminRedux lấy biến trong users ra, tức là giá trị nó lấy trong state redux của adminRedux
    postsRedux: state.admin.posts, //là danh sách limit trả về số dòng length
    countRedux: state.admin.count, //tổng số record có trong db
    doctorsRedux: state.admin.doctors, // số trang truyền là 5 bài post 20/5= 4 trang tất cả
    totalRedux: state.admin.total,
    // 20
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    // getPostsLimitRedux: (page) => dispatch(actions.getPostsLimit(page)),
    getAllDoctorsStartRedux: (page, limit) =>
      dispatch(actions.getAllDoctorsStart(page, limit)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Pagination);
