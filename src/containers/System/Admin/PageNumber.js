import React, { memo } from "react";
import "./PageNumber.scss";

import axios from "axios";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import { withRouter, matchPath } from "react-router";
import { useHistory, useLocation } from "react-router-dom";
import { emitter } from "../../../utils/emitter";

const PageNumber = ({
  number,
  currentPage,
  icon,
  location,
  history,
  params,
}) => {
  console.log("currentPage hiện tại PageNumber", currentPage);

  const handleChangePage = () => {
    if (!(number === "...")) {
      params.set("page", number);
      history.push({
        pathname: location.pathname,
        search: "?" + params.toString(),
      });
      emitter.emit("EVENT_CURENT_PAGE");
      // Gọi lại hàm getAllDoctorsStartRedux khi chuyển trang
    }
  };

  return (
    <div
      className={`${number === "..." ? "cursor-text " : "cursor-pointer "} 
              ${+number === +currentPage ? "PageNumber active" : "PageNumber"}`}
      onClick={handleChangePage}
    >
      {icon || number}
    </div>
  );
};

export default memo(withRouter(PageNumber));
