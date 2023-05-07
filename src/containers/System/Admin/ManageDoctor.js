import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./TableManageUser.scss";
import * as actions from "../../../store/actions";
import "./ManageDoctor.scss";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
// import style manually
import "react-markdown-editor-lite/lib/index.css";
import Select from "react-select";
import { LANGUAGES, CRUD_ACTIONS } from "../../../utils";
import { getDetailInforDoctor } from "../../../services/userService";
// const listDoctors = [
//   { value: "chocolate", label: "Chocolate" },
//   { value: "strawberry", label: "Strawberry" },
//   { value: "vanilla", label: "Vanilla" },
// ];

const mdParser = new MarkdownIt(/* Markdown-it options */);
class ManageDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //save to Markdown table
      contentMarkdown: "",
      contentHTML: "",
      selectedOption: "",
      description: "",
      listDoctors: [],
      hasOldData: false, //xem có thông tin cũ hay chưa

      //save to doctor_infor table
      listPrice: [],
      listPayment: [],
      listProvince: [],
      listClinic: [],
      listSpecialty: [],

      selectedPrice: "",
      selectedPayment: "",
      selectedProvince: "",
      selectedClinic: "",
      selectedSecialty: "",
      nameClinic: "",
      addressClinic: "",
      note: "",
      clinicId: "",
      specialtyId: "",
    };
  }
  componentDidMount() {
    this.props.fetchAllDoctors();
    this.props.getAllRequiredDoctorInfor();
  }

  buildDataInputSelect = (inputData, type) => {
    let result = [];
    let { language } = this.props;
    if (inputData && inputData.length > 0) {
      if (type === "USERS") {
        inputData.map((item, index) => {
          let object = {};
          let labelVi = `${item.lastName} ${item.firstName}`;
          let labelEn = `${item.firstName} ${item.lastName}`;
          object.label = language === LANGUAGES.VI ? labelVi : labelEn;
          object.value = item.id;
          result.push(object); // object gồm key là label và value đẩy vô mảng result
        });
      }
      if (type === "PRICE") {
        console.log("hoi danit check input price: ", inputData);
        inputData.map((item, index) => {
          let object = {};
          let labelVi = `${item.valueVi}`;
          let labelEn = `${item.valueEn} USD`;
          object.label = language === LANGUAGES.VI ? labelVi : labelEn;
          object.value = item.keyMap;
          result.push(object); // object gồm key là label và value đẩy vô mảng result
        });
      }
      if (type === "PAYMENT" || type === "PROVINCE") {
        inputData.map((item, index) => {
          let object = {};
          let labelVi = `${item.valueVi}`;
          let labelEn = `${item.valueEn}`;
          object.label = language === LANGUAGES.VI ? labelVi : labelEn;
          object.value = item.keyMap;
          result.push(object); // object gồm key là label và value đẩy vô mảng result
        });
      }
      if (type === "SPECIALTY") {
        inputData.map((item, index) => {
          let object = {};
          object.label = item.name;
          object.value = item.id;
          result.push(object); // object gồm key là label và value đẩy vô mảng result
        });
      }
    }

    return result;
  };

  //chạy sau khi hàm reder xảy ra
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.allDoctors !== this.props.allDoctors) {
      let dataSelect = this.buildDataInputSelect(
        this.props.allDoctors,
        "USERS"
      );
      this.setState({
        listDoctors: dataSelect,
      });
    }
    //khi có thông tin thay đổi
    if (
      prevProps.allRequiredDoctorInfor !== this.props.allRequiredDoctorInfor
    ) {
      // console.log(
      //   ">> hoidan  it get data from redux: ",
      //   this.props.allRequiredDoctorInfor
      // );

      let { resPayment, resPrice, resProvince, resSpecialty } =
        this.props.allRequiredDoctorInfor;
      let dataSelectPrice = this.buildDataInputSelect(resPrice, "PRICE");
      let dataSelectPayment = this.buildDataInputSelect(resPayment, "PAYMENT");
      let dataSelectProvince = this.buildDataInputSelect(
        resProvince,
        "PROVINCE"
      );
      let dataSelectSpecialty = this.buildDataInputSelect(
        resSpecialty,
        "SPECIALTY"
      );

      // console.log(
      //   "hoi dan it: data new: ",
      //   dataSelectPrice,
      //   dataSelectPayment,
      //   dataSelectProvince
      // );
      this.setState({
        listPrice: dataSelectPrice,
        listPayment: dataSelectPayment,
        listProvince: dataSelectProvince,
        listSpecialty: dataSelectSpecialty,
      });
    }
    //nếu ngôn ngữ thay đổi
    if (prevProps.language !== this.props.language) {
      let dataSelect = this.buildDataInputSelect(
        this.props.allDoctors,
        "USERS"
      );
      let { resPayment, resPrice, resProvince } =
        this.props.allRequiredDoctorInfor;
      let dataSelectPrice = this.buildDataInputSelect(resPrice, "PRICE");
      let dataSelectPayment = this.buildDataInputSelect(resPayment, "PAYMENT");
      let dataSelectProvince = this.buildDataInputSelect(
        resProvince,
        "PROVINCE"
      );

      let { selectedOption } = this.state;
      if (dataSelect && dataSelect.length > 0) {
        let foundDoctor = dataSelect.find(
          (item) => item.value === selectedOption.value
        );
        if (foundDoctor) {
          selectedOption = {
            label: foundDoctor.label,
            value: foundDoctor.value,
          };
        }
        // else {
        //   selectedOption = dataSelect[0];
        // }
      }

      this.setState({
        listDoctors: dataSelect,
        selectedOption: selectedOption,
        listPrice: dataSelectPrice,
        listPayment: dataSelectPayment,
        listProvince: dataSelectProvince,
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

  // Finish!
  handleEditorChange = ({ html, text }) => {
    this.setState({
      contentMarkdown: text,
      contentHTML: html,
    });
    // console.log("handleEditorChange", html, text);
  };

  handleSaveContentMarkdown = () => {
    // alert("click me");
    let { hasOldData } = this.state;
    // console.log("hoi dan it channel check state: ", this.state);
    // return;

    this.props.saveDetailDoctor({
      contentHTML: this.state.contentHTML,
      contentMarkdown: this.state.contentMarkdown,
      description: this.state.description,
      doctorId: this.state.selectedOption.value,
      action: hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,

      selectedPrice: this.state.selectedPrice.value,
      selectedPayment: this.state.selectedPayment.value,
      selectedProvince: this.state.selectedProvince.value,
      nameClinic: this.state.nameClinic,
      addressClinic: this.state.addressClinic,
      note: this.state.note,
      clinicId:
        this.state.selectedClinic && this.state.selectedClinic.value
          ? this.state.selectedClinic.value
          : "",
      specialtyId: this.state.selectedSecialty.value,
    });
    // console.log("hoidanit check status", this.state);
  };

  //chỉ lấy thông tin của bác sĩ khi và chỉ khi chúng ta onChange cái dropdown mà chọn bác sĩ
  handleChangeSelect = async (selectedOption) => {
    this.setState({ selectedOption });

    let { listPayment, listProvince, listPrice } = this.state;

    // console.log(`Option selected:`, selectedOption);
    let res = await getDetailInforDoctor(selectedOption.value);
    if (res && res.errCode === 0 && res.data && res.data.Markdown) {
      let markdown = res.data.Markdown;

      let addressClinic = "",
        nameClinic = "",
        note = "",
        paymentId = "",
        priceId = "",
        provinceId = "",
        selectedPayment = "",
        selectedPrice = "",
        selectedProvince = "";

      if (res.data.Doctor_infor) {
        addressClinic = res.data.Doctor_infor.addressClinic;
        nameClinic = res.data.Doctor_infor.nameClinic;
        note = res.data.Doctor_infor.note;

        paymentId = res.data.Doctor_infor.paymentId;
        priceId = res.data.Doctor_infor.priceId;
        provinceId = res.data.Doctor_infor.provinceId;

        //tìm 1 phần tử find là hàm của js, nếu tìm ra thì trả 1 object còn ko thì trả là undefine
        selectedPayment = listPayment.find((item) => {
          return item && item.value === paymentId; //trả về 1 object với điều kiện item.value === paymentId
        });
        selectedPrice = listPrice.find((item) => {
          return item && item.value === priceId; //trả về 1 object với điều kiện item.value === paymentId
        });
        selectedProvince = listProvince.find((item) => {
          return item && item.value === provinceId; //trả về 1 object với điều kiện item.value === paymentId
        });

        // console.log(
        //   "check hoi dan it find array",
        //   selectedPayment,
        //   listPayment,
        //   paymentId
        // );
      }

      this.setState({
        contentHTML: markdown.contentHTML,
        contentMarkdown: markdown.contentMarkdown,
        description: markdown.description,
        hasOldData: true,
        addressClinic: addressClinic,
        nameClinic: nameClinic,
        note: note,
        selectedPayment: selectedPayment,
        selectedPrice: selectedPrice,
        selectedProvince: selectedProvince,
      });
    } else {
      this.setState({
        contentHTML: "",
        contentMarkdown: "",
        description: "",
        hasOldData: false,
        addressClinic: "",
        nameClinic: "",
        note: "",
      });
    }
    // console.log("hoi dan it channel:", res);
  };

  /**
   * Trong đoạn code trên, hàm `handleChangeSelectDoctorInfor` 
   * được sử dụng để cập nhật state của component khi người dùng chọn giá.

Trong hàm này, bạn đang tạo một bản sao của state hiện tại sử dụng toán tử spread `...this.state`, 
sau đó cập nhật giá trị của state tương ứng với `stateName` và `selectedOption`. Đối với `stateName`, 
bạn đang lấy tên trường từ đối tượng `name` được truyền vào hàm thông qua tham số `name`. 
Đối với `selectedOption`, bạn đang lấy giá trị được chọn mới nhất và truyền cho state tương ứng.
Sau khi cập nhật state, bạn đang sử dụng `setState` để áp dụng các thay đổi lên component.
Trong phần render, bạn đang sử dụng component `Select` với các props như `value`, `onChange`, `options`, `placeholder` và `name`. 
Giá trị của `value` được thiết lập bằng state `selectedPrice`, đồng thời hàm `handleChangeSelectDoctorInfor` được gọi mỗi khi người dùng thay đổi giá trị.
   * 
   */

  //selectedOption, name là 2 biến thư viện react select trả ra cho mình, chứ mình không tự trả ra được 2 biến đó, mình dùng 2 biến đó thôi

  // handleChangeSelectDoctorInfor = async (selectedOption, name) => {
  //   let stateName = name.name; //lấy động các bạn truyền name như nào thì nó gán state như vậy đó là câu lệnh newdevstate[stateName] = selectedOption;
  //   /**
  //    * `newdevstate` là một biến (bất kỳ) trong mã nguồn của bạn.
  //    * Khi bạn sao chép state hiện tại, bạn tạo một bản sao của state hiện tại và lưu trữ trong `newdevstate`. Sau đó, bạn có thể cập nhật các giá trị trong `newdevstate` mà không tác động đến giá trị của state hiện tại.
  //   Bạn có thể sử dụng `newdevstate` để thực hiện một số thao tác trên state mà không làm thay đổi giá trị của state gốc. Điều này rất hữu ích khi bạn muốn thực hiện các thao tác trên state mà không làm thay đổi component,
  //   ví dụ như khi thực hiện một phương thức để xác định giá trị logic trong state mới và sau đó cập nhật state gốc.
  //    */

  //   // this.state.selectedPrice = selectedOption; ko được viết code newdevstate bằng cách trực tiếp như vậy this.state.selectedPrice = giá trị selectedOption viết code cực kỳ xấu

  //   // Nên viết cách newdevstate
  //   //Tạo bản sao của state hiện tại
  //   let newdevstate = { ...this.state };

  //   // Thực hiện các thay đổi trên newdevstate || chúng ta đã cập nhật giá trị stateName (selectedPrice, selectedProvince, selectPayment) trong`newdevstate`
  //   newdevstate[stateName] = selectedOption; //gán vào state tương ứng vì các ô react select chỉ khác nhau mỗi tên

  //   // Cập nhật state gốc bằng giá trị mới ||  chúng ta đã sử dụng `setState` để sao chép giá trị của `newdevstate` vào component.
  //   this.setState({
  //     ...newdevstate, //trả về y nguyên thằng newdevstate
  //   });

  //   console.log(
  //     "hoidan it channel check new select on change: ",
  //     selectedOption,
  //     name
  //   );
  // };

  handleChangeSelectDoctorInfor = async (selectedOption, name) => {
    let stateName = name.name; //lấy động các bạn truyền name như nào thì nó gán state như vậy đó là câu lệnh newdevstate[stateName] = selectedOption;

    //Tạo bản sao của state hiện tại
    let stateCopy = { ...this.state };

    // Thực hiện các thay đổi trên newdevstate || chúng ta đã cập nhật giá trị stateName (selectedPrice, selectedProvince, selectPayment) trong`newdevstate`

    // cách này dùng được khi và chỉ khi keyword đúng luôn là tên của state
    stateCopy[stateName] = selectedOption; //gán vào state tương ứng vì các ô react select chỉ khác nhau mỗi tên

    // Cập nhật state gốc bằng giá trị mới ||  chúng ta đã sử dụng `setState` để sao chép giá trị của `newdevstate` vào component.
    // render lại giao diện || ăn giao diện
    this.setState({
      ...stateCopy, //trả về y nguyên thằng newdevstate
    });
  };

  handleOnChangeText = (event, id) => {
    let stateCopy = { ...this.state };
    stateCopy[id] = event.target.value;
    this.setState({
      ...stateCopy,
    });
  };
  render() {
    let { hasOldData } = this.state;
    // console.log("hoi dan it check state: ", this.state);
    // console.log("hoidanitChannel: ", this.state);
    return (
      <div className="manage-doctor-container">
        <div className="manage-doctor-title">
          <FormattedMessage id="admin.manage-doctor.title" />
        </div>
        <div className="more-infor">
          <div className="content-left form-group">
            <label>
              <FormattedMessage id="admin.manage-doctor.select-doctor" />
            </label>
            <Select
              value={this.state.selectedOption} //giá trị đầu vào, giá trị là current là cái bạn đang chọn hiện tại
              onChange={this.handleChangeSelect} //hàm onChange để cho nó thấy những thay đổi
              options={this.state.listDoctors} //là list danh sách mà các bạn cho người dùng chọn
              placeholder={
                <FormattedMessage id="admin.manage-doctor.select-doctor" />
              }
            />
          </div>
          <div className="content-right">
            <label>
              <FormattedMessage id="admin.manage-doctor.intro" />
            </label>
            <textarea
              className="form-control"
              // khi giá trị trong `textarea` thay đổi, hàm `handleOnChangeText` sẽ được gọi và truyền vào tham số `event`.
              // đồng thời sự kiện `onChange` sẽ được gắn với hàm `handleOnChangeText` để cập nhật giá trị trong state khi có sự thay đổi
              onChange={(event) =>
                this.handleOnChangeText(event, "description")
              }
              //giá trị của `value` sẽ được set bằng giá trị hiện tại của `description` trong state của component,
              value={this.state.description}
            ></textarea>
          </div>
        </div>
        <div className="more-infor-extra row">
          <div className="col-4 form-group">
            <label>
              <FormattedMessage id="admin.manage-doctor.price" />
            </label>
            <Select
              //chúng ta lấy giá trị của select theo biến state
              value={this.state.selectedPrice} //giá trị đầu vào, giá trị là current là cái bạn đang chọn hiện tại
              onChange={this.handleChangeSelectDoctorInfor} //hàm onChange để cho nó thấy những thay đổi
              options={this.state.listPrice} //là list danh sách mà các bạn cho người dùng chọn
              placeholder={<FormattedMessage id="admin.manage-doctor.price" />}
              name={"selectedPrice"}
            />
          </div>
          <div className="col-4 form-group">
            <label>
              <FormattedMessage id="admin.manage-doctor.payment" />
            </label>
            <Select
              value={this.state.selectedPayment} //giá trị đầu vào, giá trị là current là cái bạn đang chọn hiện tại
              onChange={this.handleChangeSelectDoctorInfor} //hàm onChange để cho nó thấy những thay đổi
              options={this.state.listPayment} //là list danh sách mà các bạn cho người dùng chọn
              placeholder={
                <FormattedMessage id="admin.manage-doctor.payment" />
              }
              name="selectedPayment"
            />
          </div>
          <div className="col-4 form-group">
            <label>
              <FormattedMessage id="admin.manage-doctor.province" />
            </label>
            <Select
              value={this.state.selectedProvince} //giá trị đầu vào, giá trị là current là cái bạn đang chọn hiện tại
              onChange={this.handleChangeSelectDoctorInfor} //hàm onChange để cho nó thấy những thay đổi
              options={this.state.listProvince} //là list danh sách mà các bạn cho người dùng chọn
              placeholder={
                <FormattedMessage id="admin.manage-doctor.province" />
              }
              name={"selectedProvince"}
            />
          </div>

          <div className="col-4 form-group">
            <label>
              <FormattedMessage id="admin.manage-doctor.nameClinic" />
            </label>
            <input
              className="form-control"
              onChange={(event) => this.handleOnChangeText(event, "nameClinic")}
              value={this.state.nameClinic}
            ></input>
          </div>
          <div className="col-4 form-group">
            <label>
              <FormattedMessage id="admin.manage-doctor.addressClinic" />
            </label>
            <input
              className="form-control"
              onChange={(event) =>
                this.handleOnChangeText(event, "addressClinic")
              }
              value={this.state.addressClinic}
            ></input>
          </div>
          <div className="col-4 form-group">
            <label>
              {" "}
              <FormattedMessage id="admin.manage-doctor.note" />
            </label>
            <input
              className="form-control"
              onChange={(event) => this.handleOnChangeText(event, "note")}
              value={this.state.note}
            ></input>
          </div>
        </div>
        <div className="row">
          <div className="col-4 form-group">
            <label>
              <FormattedMessage id="admin.manage-doctor.speciality" />
            </label>
            <Select
              value={this.state.selectedSecialty} //giá trị đầu vào, giá trị là current là cái bạn đang chọn hiện tại
              options={this.state.listSpecialty} //là list danh sách mà các bạn cho người dùng chọn
              placeholder={
                <FormattedMessage id="admin.manage-doctor.speciality" />
              }
              onChange={this.handleChangeSelectDoctorInfor}
              name="selectedSecialty"
            />
          </div>
          <div className="col-4 form-group">
            <label>
              <FormattedMessage id="admin.manage-doctor.select-clinic" />
            </label>
            <Select
              value={this.state.selectedClinic} //giá trị đầu vào, giá trị là current là cái bạn đang chọn hiện tại
              options={this.state.listClinic} //là list danh sách mà các bạn cho người dùng chọn
              placeholder={
                <FormattedMessage id="admin.manage-doctor.select-clinic" />
              }
              onChange={this.handleChangeSelectDoctorInfor}
              name="selectedClinic"
            />
          </div>
        </div>
        <div className="manage-doctor-editor">
          <MdEditor
            style={{ height: "300px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={this.handleEditorChange} //đang truyền props xuống, đối với 1 biến props ko cần truyền arrow function
            value={this.state.contentMarkdown}
          />
        </div>

        <button
          onClick={() => this.handleSaveContentMarkdown()}
          className={
            hasOldData === true
              ? "save-content-doctor"
              : "create-content-doctor"
          }
        >
          {/* Lưu thông tin */}
          {hasOldData === true ? (
            <span>
              <FormattedMessage id="admin.manage-doctor.save" />
            </span>
          ) : (
            <span>
              <FormattedMessage id="admin.manage-doctor.add" />
            </span>
          )}
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    //hứng kết quả
    allDoctors: state.admin.allDoctors, //state.admin.users , admin là adminRedux lấy biến trong users ra, tức là giá trị nó lấy trong state redux của adminRedux
    allRequiredDoctorInfor: state.admin.allRequiredDoctorInfor,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
    getAllRequiredDoctorInfor: () => dispatch(actions.getRequiredDoctorInfor()),
    saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
