import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManageSchedule.scss";
import { FormattedMessage } from "react-intl";
import Select from "react-select";
import * as actions from "../../../store/actions";
import { LANGUAGES, CRUD_ACTIONS } from "../../../utils";
import DatePicker from "../../../components/Input/DatePicker";
import moment from "moment";

class ManageSchedule extends Component {
  //cần viết hàm tạo(constructor) để lưu cái state
  constructor(props) {
    super(props); //kế thừa props từ cha truyền xuống
    // const currentDate = new Date();
    // const dateString = moment(currentDate).format("DD/MM/YYYY");

    this.state = {
      listDoctors: [],
      selectedDoctor: {}, //bản chất selectedDoctor là 1 object nó sẽ lưu label và value
      currentDate: "", //bắt buộc phải chọn ngày nên để rỗng
      // now: dateString,
      rangeTime: [], //khoảng thời gian
    };
  }
  //sau lần render đầu tiên mặc định react sẽ chạy vào hàm này
  componentDidMount() {
    this.props.fetchAllDoctors(); //fire action fetchAllDoctors của thằng redux
    this.props.fetchAllScheduleTime();
  }

  //để lấy biến allDoctors ra thì phải có hàm componentDidUpdate
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.allDoctors !== this.props.allDoctors) {
      let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
      this.setState({
        listDoctors: dataSelect,
      });
    }
    //khi hiện tại và quá khứ khác nhau nghĩa là biết api trả về dữ liệu rồi khi này setState
    if (prevProps.allScheduleTime !== this.props.allScheduleTime) {
      this.setState({
        rangeTime: this.props.allScheduleTime, //lưu được vào trong state cái biến rangeTime
      });
    }
    //nếu ngôn ngữ thay đổi
    if (prevProps.language !== this.props.language) {
      let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
      let { selectedDoctor } = this.state;
      if (dataSelect && dataSelect.length > 0) {
        let foundDoctor = dataSelect.find(
          (item) => item.value === selectedDoctor.value
        );
        if (foundDoctor) {
          selectedDoctor = {
            label: foundDoctor.label,
            value: foundDoctor.value,
          };
        }
        // else {
        //   selectedDoctor = dataSelect[0];
        // }
      }

      this.setState({
        listDoctors: dataSelect,
        selectedDoctor: selectedDoctor,
      });
    }
  }
  //inputData nó chấp nhận 2 biến label và value
  //truyền inputData nó sẽ phụ thuộc vào language của chúng ta, và nó sẽ build cho bạn 1 cục lấy được các thông tin thằng bác sĩ
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

  handleChangeSelect = async (selectedOption) => {
    this.setState({ selectedDoctor: selectedOption });
  };

  handleOnchangeDatePicker = (date) => {
    this.setState({
      currentDate: date[0], // cái hàm nhả về cái array chúng ta lấy phần tử đầu tiên trong cái mảng
    });
    // console.log('hoi dan it check date onchange', date);
  };

  render() {
    // console.log("hoi dan it check state: ", this.state);
    // console.log("hoi dan it check props: ", this.props);
    let { rangeTime } = this.state; //lấy biến ra thông state và props
    let { language } = this.props;
    return (
      <div className="manage-schedule-container">
        <div className="m-s-title">
          <FormattedMessage id="manage-schedule.title" />
        </div>
        <div className="container">
          <div className="row">
            {/* //form-group để nó boostrap gom nhóm label và input thành group */}
            <div className="col-6 form-group">
              <label>
                <FormattedMessage id="manage-schedule.choose-doctor" />
              </label>
              <Select
                //đi từ dưới lên options(lựa chọn list) > onChange (click thay đổi và setstate selectedDoctor) > value (lôi giá trị ra hiện tại để hiển thị) ,value là giá trị tự động thay đổi theo selectedDoctor
                value={this.state.selectedDoctor}
                onChange={this.handleChangeSelect} //khi thay đổi onChange nó sẽ setState
                options={this.state.listDoctors}
              />
            </div>
            <div className="col-6 form-group">
              <label>
                <FormattedMessage id="manage-schedule.choose-date" />
              </label>
              {/* <input className="form-control"></input> */}
              <DatePicker
                onChange={this.handleOnchangeDatePicker}
                className="form-control"
                value={this.state.currentDate}
                // minDate={this.state.now}
                minDate={new Date()}
              />
            </div>
            <div className="col-12 pick-hour-container">
              {rangeTime &&
                rangeTime.length > 0 &&
                rangeTime.map((item, index) => {
                  return (
                    <button className="btn btn-schedule" key={index}>
                      {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                    </button>
                  );
                })}
            </div>
            <div className="col-12">
              <button className="btn btn-primary btn-save-schedule">
                <FormattedMessage id="manage-schedule.save" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language, // sau khi fire event của thằng redux thì ngay lập tức nó sẽ nạp vào redux thông qua app, cái biến là language
    allDoctors: state.admin.allDoctors,
    allScheduleTime: state.admin.allScheduleTime, //thông qua state của redux, gọi đến adminReducer, gọi đến biến các bạn muốn lấy
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
    fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
