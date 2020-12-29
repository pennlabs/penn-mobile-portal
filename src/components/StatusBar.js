import React from "react";

const StatusBar = ({ isExpired, isSubmitted, isApproved, isLive }) => {
  return (
    <div className="columns is-mobile">
      <div
        className="column is-1"
        style={{
          width: "1vw",
          zIndex: 1,
          position: "relative",
        }}
      >
        <span
          className="icon"
          style={{ color: "#2175cb", width: 20, height: 20 }}
        >
          <i className="fas fa-circle fa-lg" style={{ fontSize: 27 }}></i>
        </span>
        <div
          style={{
            color: "#2175cb",
            fontWeight: "bold",
            marginLeft: -7,
            paddingTop: 6,
          }}
        >
          Draft
        </div>
      </div>
      <div
        className="column"
        style={{
          backgroundColor: isSubmitted || isExpired ? "#2175cb" : "#cccccc",
          marginLeft: 0,
          padding: 0,
          marginTop: 20,
          height: 5,
          zIndex: isSubmitted || isExpired ? 2 : 0,
          position: "relative",
        }}
      ></div>
      <div
        className="column is-1"
        style={{
          width: "1vw",
          padding: "13px 0px 0px 0px",
          zIndex: 1,
          position: "relative",
        }}
      >
        <span
          className="icon"
          style={{
            color: isSubmitted || isExpired ? "#2175cb" : "#cccccc",
            width: 20,
            height: 20,
            boxShadow: isSubmitted && !isApproved ? "0 0 8px 3px #d9d9d9" : "",
          }}
        >
          <i className="fas fa-circle fa-lg" style={{ fontSize: 27 }}></i>
        </span>
        <div
          style={{
            fontSize: 16,
            fontWeight: isSubmitted || isExpired ? "bold" : "normal",
            color: isSubmitted || isExpired ? "#2175cb" : "#999999",
            width: 107,
            marginLeft: -42,
            paddingTop: 6,
          }}
        >
          Under Review
        </div>
      </div>
      <div
        className="column"
        style={{
          backgroundColor: isApproved || isExpired ? "#2175cb" : "#cccccc",
          marginLeft: 0,
          padding: "0px 0px 0px 0px",
          marginTop: 20,
          height: 5,
          zIndex: isApproved || isExpired ? 2 : 0,
          position: "relative",
        }}
      ></div>
      <div
        className="column is-1"
        style={{
          width: "1vw",
          padding: "13px 0px 0px 0px",
          zIndex: 1,
          position: "relative",
        }}
      >
        <span
          className="icon"
          style={{
            color: isApproved || isExpired ? "#2175cb" : "#cccccc",
            width: 20,
            height: 20,
            boxShadow:
              isApproved && !isLive && !isExpired ? "0 0 8px 3px #d9d9d9" : "",
          }}
        >
          <i className="fas fa-circle fa-lg" style={{ fontSize: 27 }}></i>
        </span>
        <div
          style={{
            fontWeight: isApproved || isExpired ? "bold" : "normal",
            color: isApproved || isExpired ? "#2175cb" : "#999999",
            marginLeft: -24,
            paddingTop: 6,
          }}
        >
          Approved
        </div>
      </div>
      <div
        className="column"
        style={{
          backgroundColor: isLive || isExpired ? "#2175cb" : "#cccccc",
          marginLeft: 0,
          padding: "0px 0px 0px 0px",
          marginTop: 20,
          height: 5,
          zIndex: isLive || isExpired ? 2 : 0,
          position: "relative",
        }}
      ></div>
      <div
        className="column is-1"
        style={{
          width: "1vw",
          padding: "13px 0px 0px 0px",
          zIndex: 1,
          position: "relative",
        }}
      >
        <span
          className="icon"
          style={{
            color: isLive || isExpired ? "#2175cb" : "#cccccc",
            width: 20,
            height: 20,
            boxShadow: isLive && !isExpired ? "0 0 8px 3px #d9d9d9" : "",
          }}
        >
          <i className="fas fa-circle fa-lg" style={{ fontSize: 27 }}></i>
        </span>
        <div
          style={{
            fontWeight: isLive || isExpired ? "bold" : "normal",
            color: isLive || isExpired ? "#2175cb" : "#999999",
            marginLeft: -3,
            paddingTop: 6,
          }}
        >
          Live
        </div>
      </div>
      <div
        className="column"
        style={{
          backgroundColor: isExpired ? "#2175cb" : "#cccccc",
          marginLeft: 0,
          padding: "0",
          marginTop: 20,
          height: 5,
          zIndex: isExpired ? 2 : 0,
          position: "relative",
        }}
      ></div>
      <div
        className="column is-1"
        style={{
          width: "1vw",
          padding: "13px 0px 0px 0px",
          zIndex: 1,
          position: "relative",
        }}
      >
        <span
          className="icon"
          style={{
            color: isExpired ? "#2175cb" : "#cccccc",
            width: 20,
            height: 20,
            boxShadow: isExpired ? "0 0 8px 3px #d9d9d9" : "",
          }}
        >
          <i className="fas fa-circle fa-lg" style={{ fontSize: 27 }}></i>
        </span>
        <div
          style={{
            fontSize: 16,
            fontWeight: isExpired ? "bold" : "normal",
            color: isExpired ? "#2175cb" : "#999999",
            marginLeft: -16,
            paddingTop: 6,
          }}
        >
          Expired
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
