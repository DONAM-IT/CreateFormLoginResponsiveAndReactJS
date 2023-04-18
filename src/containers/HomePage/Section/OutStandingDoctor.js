import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import Slider from "react-slick";
import * as actions from "../../../store/actions";
import { LANGUAGES } from "../../../utils";

class OutStandingDoctor extends Component {
  //để render động được cái danh sách người dùng, thì chúng ta cần phải đặt state, để kiểm soát được các biến thay đổi

  constructor(props) {
    super(props);
    this.state = {
      arrDoctors: [],
    };
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    //tạo componentDidUpdate để cập nhật theo cái redux
    if (prevProps.topDotorsRedux !== this.props.topDotorsRedux) {
      this.setState({
        arrDoctors: this.props.topDotorsRedux,
      });
    }
  }
  //fire redux để lấy được thông tin
  componentDidMount() {
    //gọi đến redux
    this.props.loadTopDoctors(); //tên truy cập gián tiếp đến actions
  }

  render() {
    // console.log(
    //   "Hoidanit channel: check topDoctorRedux: ",
    //   this.props.topDotorsRedux
    // );
    let arrDoctors = this.state.arrDoctors;
    let { language } = this.props;
    //dùng hàm concat để meger mảng vì trong db mình có ít hơn 10 phần tử
    arrDoctors = arrDoctors
      .concat(arrDoctors)
      .concat(arrDoctors)
      .concat(arrDoctors);
    console.log("arrDoctors", arrDoctors);
    return (
      <div className="section-share section-outstanding-doctor">
        <div className="section-container">
          <div className="section-header">
            <span className="title-section">Bác sĩ nổi bật tuần qua</span>
            <button className="btn-section">xem thêm</button>
          </div>
          <div className="section-body">
            <Slider {...this.props.settings}>
              {arrDoctors &&
                arrDoctors.length > 0 &&
                arrDoctors.map((item, index) => {
                  // if (index === 0) {
                  //   console.log("check item", item);
                  // }
                  let imageBase64 = "";
                  if (item.image) {
                    imageBase64 = new Buffer(item.image, "base64").toString(
                      "binary"
                    );
                  }
                  let nameVi = `${item.positionData.valueVi}, ${item.lastName} ${item.firstName} `;
                  let nameEn = `${item.positionData.valueEn}, ${item.firstName} ${item.lastName}`;
                  return (
                    <div className="section-customize" key={index}>
                      <div className="customize-border">
                        <div className="outer-bg">
                          <div
                            className="bg-image section-outstanding-doctor"
                            style={{
                              backgroundImage: `url(${imageBase64})`,
                            }}
                          />
                        </div>
                        <div className="position text-center">
                          <div>
                            {language === LANGUAGES.VI ? nameVi : nameEn}
                          </div>
                          <div>Cơ Xương Khớp 1</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </Slider>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    isLoggedIn: state.user.isLoggedIn,
    topDotorsRedux: state.admin.topDotors, // lôi ra từ redux: state.admin, admin là adminReducer
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadTopDoctors: () => dispatch(actions.fetchTopDoctor()), //FIRE ACTION fetchTopDoctor
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor);
