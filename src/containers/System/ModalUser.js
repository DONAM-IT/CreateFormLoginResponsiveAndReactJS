import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

class ModalUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      address: "",
    };
  }
  componentDidMount() {}

  toggle = () => {
    // alert("me toggle");
    this.props.toggleFromParent();
  };

  handleOnChangeInput = (event, id) => {
    //bad code modify state
    /**
     *  this.state = {
     *    email: '',
     *    password: ''
     *  }
     *
     *  this.state.email === this.state['email']
     *
     */
    // this.state[id] = event.target.value;
    // this.setState(
    //   {
    //     ...this.state,
    //   },
    //   () => {
    //     console.log("check bad state: ", this.state);
    //   }
    // );

    //good code
    let copyState = { ...this.state };
    copyState[id] = event.target.value;

    this.setState({
      ...copyState,
    });

    // this.setState(
    //   {
    //     ...copyState,
    //   }, //anycall back function để ko bị bất đồng bộ vì luôn in state ra đúng
    //   () => {
    //     console.log("check good state: ", this.state);
    //   }
    // );

    // console.log("event 1:", event.target.value, id); //muốn lấy giá trị của 1 event /fire
  };

  // handleOnChangeInput2 = (event) => {
  //   console.log("event 2:", event.target.value); //muốn lấy giá trị của 1 event
  // };

  checkValideInput = () => {
    let isValid = true;
    let arrInput = ["email", "password", "firstName", "lastName", "address"];
    for (let i = 0; i < arrInput.length; i++) {
      console.log("check inside loop", this.state[arrInput[i]], arrInput[i]);
      if (!this.state[arrInput[i]]) {
        isValid = false;
        alert("Missing parameter: " + arrInput[i]);
        break;
      }
    }
    return isValid;
  };
  handleAddNewUser = () => {
    //validate
    let isValid = this.checkValideInput();
    if (isValid === true) {
      //call api create modal
      // console.log("check props child ", this.props);
      this.props.createNewUser(this.state);
      // console.log("data modal ", this.state);
    }
  };
  render() {
    return (
      <Modal
        //state chúng ta truyền chính là props đầu vào của nó, thuộc tính = true bắt buộc phải xuất hiện model
        isOpen={this.props.isOpen} //state bên cha thay đổi do setState thành true nên  isOpen = true bắt buộc model xuất hiện
        toggle={() => {
          this.toggle();
        }}
        className={"modal-user-container"}
        size="lg"
        // centered
      >
        <ModalHeader
          toggle={() => {
            this.toggle();
          }}
        >
          Create a new user
        </ModalHeader>
        <ModalBody>
          <div className="modal-user-body">
            <div className="input-container">
              <label>Email</label>
              <input
                type="text"
                onChange={(event) => {
                  this.handleOnChangeInput(event, "email"); //id đặt đúng tên state ở hàm contructor
                }}
                value={this.state.email} //set giá trị cho nó từ state
              ></input>
            </div>
            <div className="input-container">
              <label>Password</label>
              <input
                type="password"
                onChange={(event) => {
                  this.handleOnChangeInput(event, "password");
                }}
                value={this.state.password}
              ></input>
            </div>
            <div className="input-container">
              <label>First name</label>
              <input
                type="text"
                onChange={(event) => {
                  this.handleOnChangeInput(event, "firstName");
                }}
                value={this.state.firstName}
              ></input>
            </div>
            <div className="input-container">
              <label>Last Name</label>
              <input
                type="text"
                onChange={(event) => {
                  this.handleOnChangeInput(event, "lastName");
                }}
                value={this.state.lastName}
              ></input>
            </div>
            <div className="input-container max-width-input">
              <label>Address</label>
              <input
                type="text"
                onChange={(event) => {
                  this.handleOnChangeInput(event, "address");
                }}
                value={this.state.address}
              ></input>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            className="px-3"
            onClick={() => {
              this.handleAddNewUser();
            }}
          >
            Add new
          </Button>{" "}
          <Button
            color="secondary"
            className="px-3"
            onClick={() => {
              this.toggle();
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser);
