import React, { useEffect, useState } from "react";
import FormSection from "./FormSection";
import ResumePreview from "./ResumePreview.jsx";
import { ResumeInfoContext } from "../context/ResumeInfoContext.jsx";
import dummy from "../data/dummy.jsx";
import Summary from "./Summary.jsx";
import { useParams } from "react-router-dom";

const EditResume = () => {
  const params = useParams();
  const [resumeInfo, setResumeInfo] = useState(null);

  useEffect(() => {
    setResumeInfo(dummy);
  }, []);

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div className="grid grid-cols-1 md:grid-cols-2 p-10 gap-10">
        <div id="print-none">
          <FormSection resumeInfo={resumeInfo} />
        </div>
        <div id="print-data">
          <ResumePreview resumeInfo={resumeInfo} />
        </div>
      </div>
    </ResumeInfoContext.Provider>
  );
};

export default EditResume;
