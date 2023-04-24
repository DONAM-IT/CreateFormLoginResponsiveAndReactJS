import React, { Component } from "react";
import { connect } from "react-redux";
import "./DoctorSchedule.scss";
import localization from "moment/locale/vi";
import moment from "moment";
import { LANGUAGES } from "../../../utils";
import { getScheduleDoctorByDate } from "../../../services/userService";

class DoctorSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allDays: [],
    };
  }

  //khi component được render
  async componentDidMount() {
    let { language } = this.props;

    console.log("moment vie:", moment(new Date()).format("dddd - DD/MM")); //TIẾNG VIỆT HIỂN THỊ THỨ CẦN 4 CHỮ d còn tiếng anh thì dùng 3 chữ d
    console.log(
      "moment en:",
      moment(new Date()).locale("en").format("ddd - DD/MMM")
    );
    this.setArrDays(language);
  }
  setArrDays = (language) => {
    let allDays = [];
    for (let i = 0; i < 7; i++) {
      let object = {};
      if (language === LANGUAGES.VI) {
        object.label = moment(new Date()).add(i, "days").format("dddd - DD/MM");
      } else {
        object.label = moment(new Date())
          .add(i, "days")
          .locale("en")
          .format("ddd - DD/MM");
        // .format("ddd - DD/MMM");
      }

      object.value = moment(new Date()).add(i, "days").startOf("day").valueOf(); //moment(new Date()) mặc định lấy thứ, ngày, tháng, giờ, phút, giây nên mới dùng startOf("day") để không lấy phút giây, valueOf() chuyển time sang Unix Timestamp

      allDays.push(object);
    }

    // console.log("allDays: ", allDays);
    this.setState({
      allDays: allDays,
    });
  };
  //cần có componentDidUpdate để biết khi nào props thay đổi
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
      this.setArrDays(this.props.language);
    }
  }

  handleOnChangeSelect = async (event) => {
    console.log("check id: ", this.props.detailDoctor);
    if (this.props.doctorIdFromParent && this.props.doctorIdFromParent !== -1) {
      let doctorId = this.props.doctorIdFromParent;
      let date = event.target.value;
      let res = await getScheduleDoctorByDate(doctorId, date);
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
    let { allDays } = this.state;
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
        <div className="all-availabe-time"></div>
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
