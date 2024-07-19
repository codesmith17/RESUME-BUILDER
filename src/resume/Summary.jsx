import React from "react";

const Summary = ({ resumeInfo }) => {
  return <p className="text-xs">{resumeInfo?.summary}</p>;
};

export default Summary;
