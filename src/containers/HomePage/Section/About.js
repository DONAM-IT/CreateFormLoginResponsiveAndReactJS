import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";

class About extends Component {
  render() {
    // let settings = this.props.settings;
    // console.log("check setting : ", settings);
    return (
      <div className="section-share section-about">
        <div className="section-about-header">
          Truyền thông nói về Channel Hỏi Dân IT
        </div>
        <div className="section-about-content">
          <div className="content-left">
            <iframe
              width="100%"
              height="400px"
              src="https://www.youtube.com/embed/oDyCAgjQ7gY"
              title="không phải dạng vừa đâu-Sơn Tùng M-TP"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
          </div>
          <div className="content-right">
            <p>
              Không gì có thể phủ nhận tài năng của Sơn Tùng cả.Bài hát như đập
              thẳng vào những định kiến, những sự ghen ghét đố kị , những lời
              chửi rủa mắc nhiếc,...Để có 1 ST như ngày hôm nay không phải dễ
              dàng, đến hiện tại ST đã chứng minh cho anh "không phải dạng vừa
              đâu"(ngày xưa nghe không hiểu, giờ nghe thấy bài này như 1 bài
              dizz :v)
            </p>
          </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(About);
