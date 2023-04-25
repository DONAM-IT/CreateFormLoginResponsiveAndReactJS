import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManageSchedule.scss";
import { FormattedMessage } from "react-intl";
import Select from "react-select";
import * as actions from "../../../store/actions";
import { LANGUAGES, CRUD_ACTIONS, dateFormat } from "../../../utils";
import DatePicker from "../../../components/Input/DatePicker";
import moment from "moment";
import Immutable from "immutable";
import { toast } from "react-toastify";
import _ from "lodash";
import { saveBulkScheduleDoctor } from "../../../services/userService";
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
    /**
     * Nếu bạn gặp lỗi "item.set is not a function" khi sử dụng `Immutable.js` trong đoạn mã đã cho, có thể là do phương thức `.set()` không hỗ trợ trực tiếp cho một mảng. 
     * Thay vào đó, bạn có thể sử dụng `Immutable.fromJS()` để chuyển đổi mảng ban đầu thành một `Immutable.List`.
      Sau đó, khi sử dụng `Immutable.js`, bạn có thể sử dụng phương thức `.setIn()` để thêm thuộc tính vào từng đối tượng trong mảng.
     */

    if (prevProps.allScheduleTime !== this.props.allScheduleTime) {
      //Cách 1
      //Sử dụng Immutable.js, hãy sử dụng phương thức `size()`. CÒN sử dụng plain JS mảng thì bạn nên sử dụng thuộc tính `length`
      // let data = Immutable.fromJS(this.props.allScheduleTime);
      // console.log("data after before:", data.toJS());
      // if (data && data.size > 0) {
      //   data = data.map((item) => {
      //     return item.setIn(["isSelected"], false);
      //   });
      // }
      // console.log("data after mapping:", data.toJS());

      //Cách 2
      /**
       * Cách thứ hai của bạn là cách khác để thiết lập thuộc tính `isSelected` vào mỗi đối tượng trong mảng `data`. 
       * Cách này hoạt động bằng cách sử dụng spread syntax `...` để tạo ra một bản sao của mỗi đối tượng trong mảng. Sau đó, bạn thêm thuộc tính `isSelected` với giá trị mặc định `"false"` vào trong bản sao này 
       * thông qua object destructuring.
      Cách này cũng hoạt động và có thể sử dụng được nếu muốn. Tuy nhiên, nó không giải quyết vấn đề về immutable data một cách tốt nhất, và điều đó có thể dẫn đến các vấn đề về quản lý trạng thái và xử lý lỗi trong tương lai.
      Vì vậy, nếu có nhu cầu làm việc với các bộ dữ liệu lớn hoặc cần quản lý trạng thái của ứng dụng phức tạp hơn, việc sử dụng một thư viện như `Immutable.js` để xử lý immutable data là rất cần thiết.
       */
      let data = this.props.allScheduleTime;
      // console.log("data after before:", data);
      if (data && data.length > 0) {
        data = data.map((item) => ({ ...item, isSelected: false }));
      }
      // console.log("data after mapping:", data);

      this.setState({
        rangeTime: data, //lưu được vào trong state cái biến rangeTime
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

  /** Shallow copy
   * 
   * Cách này Nếu bạn thay đổi trực tiếp mảng, điều đó có thể gây ảnh hưởng đến dữ liệu ban đầu. 
   * Khi bạn thay đổi phần tử bên trong mảng, phần tử đó sẽ được thay đổi trực tiếp, có thể gây nên các bất ổn hoặc rủi ro trong việc sử dụng các phần tử đó tại những điểm khác nhau của chương trình.
   * 
   * handleClickBtnTime = (time) => {
    let { rangeTime } = this.state;
    console.log("hoi dan it check item click:rangeTime before ", rangeTime);

    if (rangeTime && rangeTime.length > 0) {
      rangeTime = rangeTime.map((item) => {
        if (item.id === time.id) item.isSelected = !item.isSelected; //shallow copy là Khi bạn thay đổi thuộc tính của bản sao, thuộc tính của đối tượng gốc sẽ bị thay đổi theo.
        return item;
      });
      console.log("hoi dan it channel: after ", rangeTime);
      this.setState({
        rangeTime: rangeTime,
      });
    }
  }; khi click vào time thì giá trị biến isSelected before và after giống nhau là vì sao? cách khắc phục ?
  
  >>>> Vấn đề của bạn nằm ở chỗ bạn đang thay đổi thuộc tính `isSelected` của mảng `rangeTime` mà không tạo ra một bản sao mới của mảng. 
   Vì vậy, `isSelected` của các đối tượng trong mảng `rangeTime` được thay đổi trực tiếp, không tạo ra một mảng mới.
Việc này dẫn đến các giá trị `isSelected` trước và sau khi thay đổi đều giống nhau. 
Để khắc phục điều này, thay vì thay đổi thuộc tính `isSelected` của đối tượng trong mảng `rangeTime`, 
bạn nên tạo một bản sao mới của đối tượng và thêm thuộc tính `isSelected` vào đối tượng mới tạo này. 
Sau đó, bạn cập nhật mảng `rangeTime` với đối tượng mới.
Bằng cách tạo một bản sao mới của đối tượng và thêm thuộc tính `isSelected` vào trong đối tượng mới như ở ví dụ trên, khi bạn kiểm tra lại console.log, 
bạn sẽ nhận được giá trị khác nhau giữa `rangeTime` trước khi thay đổi và `rangeTime` sau khi thay đổi.

   */

  // //CÁCH 1: Deep copy
  // Tạo một bản sao mới của đối tượng và thêm thuộc tính `isSelected` vào đối tượng mới tạo này. Sau đó, bạn cập nhật mảng `rangeTime` với đối tượng mới.
  handleClickBtnTime = (time) => {
    let { rangeTime } = this.state;
    console.log("hoi dan it check item click:rangeTime before ", rangeTime);

    if (rangeTime && rangeTime.length > 0) {
      rangeTime = rangeTime.map((item) => {
        if (item.id === time.id) {
          //! chỉ dùng với Boolean là true hay false
          const newItem = { ...item, isSelected: !item.isSelected }; //Deep copy Khi bạn thay đổi thuộc tính của bản sao, đối tượng gốc sẽ không bị ảnh hưởng.
          //Để deep copy một đối tượng, ta thường sử dụng các giải pháp có sẵn của JavaScript như JSON.parse(JSON.stringify()) hoặc implement thư viện hỗ trợ sao chép đối tượng như lodash hoặc immutable.js.
          return newItem;
        }
        return item;
      });
      console.log("hoi dan it channel: after ", rangeTime);
      this.setState({
        rangeTime: rangeTime,
      });
    }
  };

  /** CÁCH 2: Deep copy
   * Sử dụng `JSON.parse(JSON.stringify())` để copy mảng:
   * Tuy nhiên, sử dụng `JSON.parse(JSON.stringify())` để copy mảng có thể gặp vấn đề trong một số trường hợp nhất định, như khi mảng chứa các đối tượng không thể được chuyển đổi sang JSON hoặc chứa các thuộc tính không có thể được sao chép. Bạn có thể sử dụng các thư viện hỗ trợ sao chép phức tạp hơn như Lodash hoặc Immutable.js để sao chép đối tượng.
   * Bằng cách sao chép mảng sử dụng deep copy, bạn đảm bảo rằng các vấn đề liên quan đến tham chiếu của các đối tượng bên trong mảng sẽ được giải quyết một cách an toàn.
   *
   */
  // handleClickBtnTime = (time) => {
  //   let { rangeTime } = this.state;

  //   // console.log("hoi dan it check item click:rangeTime before ", rangeTime);

  //   if (rangeTime && rangeTime.length > 0) {
  //     let newRangeTime = JSON.parse(JSON.stringify(rangeTime));
  //     newRangeTime = newRangeTime.map((item) => {
  //       if (item.id === time.id) {
  //         item.isSelected = !item.isSelected;
  //       }
  //       return item;
  //     });
  //     // console.log("After newRangeTime", newRangeTime);
  //     this.setState({
  //       rangeTime: newRangeTime,
  //     });
  //   }
  // };

  handleSaveSchedule = async () => {
    let { rangeTime, selectedDoctor, currentDate } = this.state;
    let result = [];
    if (!currentDate) {
      toast.error("Invalid date! ");
      return;
    }
    //_.isEmpty(selectedDoctor) là true nếu selectedDoctor = {}
    if (selectedDoctor && _.isEmpty(selectedDoctor)) {
      toast.error("Invalid selected doctor! ");
      return;
    }

    // let formatedDate = moment(currentDate).format(dateFormat.SEND_TO_SERVER); //hiện ra chữ
    // let formatedDate = moment(currentDate).unix(); //gửi lên server dưới dạng timestamp
    let formatedDate = new Date(currentDate).getTime(); //hàm này trả ra 1 số nguyên là
    //chúng ta cần phải lọc các khoảng thời gian, sau đó build object
    if (rangeTime && rangeTime.length > 0) {
      let selectedTime = rangeTime.filter((item) => item.isSelected === true);
      // console.log("hoidanit channel: selectedTime: ", selectedTime);
      if (selectedTime && selectedTime.length > 0) {
        //bên trong mỗi 1 lần lặp sẽ khởi tạo 1 biến object mới
        selectedTime.map((schedule, index) => {
          console.log("check schedule ", schedule, index, selectedDoctor);
          let object = {};
          object.doctorId = selectedDoctor.value; //thư viện select sẽ trả 1 object có 2 trường value: lable
          object.date = formatedDate;
          object.timeType = schedule.keyMap; //timeType để map database khỏi sửa bên nodejs
          result.push(object); //đẩy vào 1 cái mảng
        });
      } else {
        toast.error("Invalid selected time! ");
        return;
      }
    }
    // let res = await saveBulkScheduleDoctor(result);
    //gửi lên server là 1 cái mảng
    //  [
    //    { doctorId: 6, date: "25/04/2023", time: "T1" },
    //    { doctorId: 6, date: "25/04/2023", time: "T2" },
    //    { doctorId: 6, date: "25/04/2023", time: "T3" },
    //  ];

    //build cục data gửi lên server 1 biến object có tên là arrSchedule và giá trị của nó chính là cái mảng của chúng ta
    // {
    //   arrSchedule: [
    //     { doctorId: 6, date: "24/04/2023", time: "T1" },
    //     { doctorId: 6, date: "24/04/2023", time: "T3" },
    //   ];
    // }
    let res = await saveBulkScheduleDoctor({
      arrSchedule: result,
      doctorId: selectedDoctor.value,
      formatedDate: formatedDate,
    });

    if (res && res.errCode === 0) {
      toast.success("Save Infor succeed!");
    } else {
      toast.error("error saveBulkScheduleDoctor!");
      console.log("error saveBulkScheduleDoctor >>> res: ", res);
    }
    // console.log("hoi dan it channel check res:saveBulkScheduleDoctor ", res);
    // console.log("hoi dan it channel check result: ", result);
  };
  render() {
    // console.log(
    //   "hoi dan it channel: check range time in render",
    //   this.props.allScheduleTime
    // );
    // console.log("hoi dan it check state: ", this.state);
    // console.log("hoi dan it check props: ", this.props);

    let { rangeTime } = this.state; //lấy biến ra thông state và props
    let { language } = this.props;
    // let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
    // console.log("hoi dan it check state: ", rangeTime);

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
                minDate={new Date().setHours(0, 0, 0, 0)}
                // minDate={yesterday}
                language={this.props.language}
              />
            </div>
            <div className="col-12 pick-hour-container">
              {rangeTime &&
                rangeTime.length > 0 &&
                rangeTime.map((item, index) => {
                  return (
                    <button
                      className={
                        item.isSelected === true
                          ? "btn btn-schedule active"
                          : "btn btn-schedule"
                      }
                      key={index}
                      onClick={() => this.handleClickBtnTime(item)}
                    >
                      {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                    </button>
                  );
                })}
            </div>
            <div className="col-12">
              <button
                className="btn btn-primary btn-save-schedule"
                onClick={() => this.handleSaveSchedule()}
              >
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
