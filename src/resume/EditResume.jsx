import React, { useEffect, useState } from "react";
import FormSection from "./FormSection";
import ResumePreview from "./ResumePreview.jsx";
import { ResumeInfoContext } from "../context/ResumeInfoContext.jsx";
import dummy from "../data/dummy.jsx";
import Summary from "./Summary.jsx";
import { useParams } from "react-router-dom";
// import { use } from "../../backend/routes/resumeRoutes.js";
const EditResume = () => {
  const params = useParams();
  const [resumeInfo, setResumeInfo] = useState(null);
  useEffect(() => {
    setResumeInfo(dummy);
  }, []);
  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div className="grid grid-cols-1 md:grid-cols-2 p-10 gap-10">
        <FormSection resumeInfo={resumeInfo}></FormSection>
        <ResumePreview resumeInfo={resumeInfo}></ResumePreview>
      </div>
    </ResumeInfoContext.Provider>
  );
};

export default EditResume;
