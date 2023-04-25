import React, { Component } from "react";
import { connect } from "react-redux";
import "./DoctorSchedule.scss";
import localization from "moment/locale/vi";
import moment from "moment";
import { LANGUAGES } from "../../../utils";
import { getScheduleDoctorByDate } from "../../../services/userService";
import _ from "lodash";
import { FormattedMessage } from "react-intl";

class DoctorSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allDays: [],
      allAvalabelTime: [],
    };
  }

  //khi component được render
  async componentDidMount() {
    let { language } = this.props;
    let allDays = this.getArrDays(language);

    this.setState({
      allDays: allDays,
    });

    // console.log("moment vie:", moment(new Date()).format("dddd - DD/MM")); //TIẾNG VIỆT HIỂN THỊ THỨ CẦN 4 CHỮ d còn tiếng anh thì dùng 3 chữ d
    // console.log(
    //   "moment en:",
    //   moment(new Date()).locale("en").format("ddd - DD/MMM")
    // );
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  getArrDays = (language) => {
    let allDays = [];
    for (let i = 0; i < 7; i++) {
      let object = {};
      if (language === LANGUAGES.VI) {
        if (i === 0) {
          let ddMM = moment(new Date()).format("DD/MM");
          let today = `Hôm nay - ${ddMM}`;
          object.label = today;
        } else {
          let labelVi = moment(new Date())
            .add(i, "days")
            .format("dddd - DD/MM");
          object.label = this.capitalizeFirstLetter(labelVi);
        }

        // object.label = _.capitalize(
        //   moment(new Date()).add(i, "days").format("dddd - DD/MM")
        // );
      } else {
        if (i === 0) {
          let ddMM = moment(new Date()).format("DD/MM");
          let today = `Today - ${ddMM}`;
          object.label = today;
        } else {
          object.label = moment(new Date())
            .add(i, "days")
            .locale("en")
            .format("ddd - DD/MM");
          // .format("ddd - DD/MMM");
        }
      }

      object.value = moment(new Date()).add(i, "days").startOf("day").valueOf(); //moment(new Date()) mặc định lấy thứ, ngày, tháng, giờ, phút, giây nên mới dùng startOf("day") để không lấy phút giây, valueOf() chuyển time sang Unix Timestamp

      allDays.push(object);
    }
    return allDays;
    // console.log("allDays: ", allDays);
  };
  //cần có componentDidUpdate để biết khi nào props thay đổi
  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
      let allDays = this.getArrDays(this.props.language);
      this.setState({
        allDays: allDays,
      });
    }
    if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
      let allDays = this.getArrDays(this.props.language);
      let res = await getScheduleDoctorByDate(
        this.props.doctorIdFromParent,
        allDays[0].value
      );
      this.setState({
        allAvalabelTime: res.data ? res.data : [],
      });
    }
  }

  handleOnChangeSelect = async (event) => {
    // console.log("check id: ", this.props.detailDoctor);
    if (this.props.doctorIdFromParent && this.props.doctorIdFromParent !== -1) {
      let doctorId = this.props.doctorIdFromParent;
      let date = event.target.value;
      let res = await getScheduleDoctorByDate(doctorId, date);

      if (res && res.errCode === 0) {
        this.setState({
          allAvalabelTime: res.data ? res.data : [],
        });
      }
      console.log("check res schedule from react: ", res);
    }
    // console.log("event onchange date value: ", event.target.value);
  };
  render() {
    // let options = [
    //   { label: "Thứ 2", value: "2" },
    //   { label: "Thứ 3", value: "3" },
    //   { label: "Thứ 4", value: "4" },
    // ];
    let { allDays, allAvalabelTime } = this.state; //lấy state ra xài
    let { language } = this.props;
    return (
      <div className="doctor-schedule-container">
        <div className="all-schedule">
          <select onChange={(event) => this.handleOnChangeSelect(event)}>
            {allDays &&
              allDays.length > 0 &&
              allDays.map((item, index) => {
                return (
                  <option value={item.value} key={index}>
                    {item.label}
                  </option>
                );
              })}
          </select>
        </div>
        <div className="all-availabe-time">
          <div className="text-calendar">
            {/* //i viết tắt icon <span> hiển thị text ít nên dùng */}

            <i className="fas fa-calendar-alt">
              <span>
                <FormattedMessage id="patient.detail-doctor.schedule" />
              </span>
            </i>
          </div>
          <div className="time-content">
            {allAvalabelTime && allAvalabelTime.length > 0 ? (
              <>
                <div className="time-content-btns">
                  {allAvalabelTime.map((item, index) => {
                    let timeDisplay =
                      language === LANGUAGES.VI
                        ? item.timeTypeData.valueVi
                        : item.timeTypeData.valueEn;
                    // let timeTypeData
                    return (
                      <button
                        key={index}
                        className={
                          language === LANGUAGES.VI ? "btn-vie" : "btn-en"
                        }
                      >
                        {timeDisplay}
                      </button>
                    );
                  })}
                </div>

                <div className="book-free">
                  <span>
                    <FormattedMessage id="patient.detail-doctor.choose" />
                    <i className="far fa-hand-point-up"></i>
                    <FormattedMessage id="patient.detail-doctor.book-free" />
                  </span>
                </div>
              </>
            ) : (
              <div className="no-schedule">
                <FormattedMessage id="patient.detail-doctor.no-schedule" />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { language: state.app.language };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
