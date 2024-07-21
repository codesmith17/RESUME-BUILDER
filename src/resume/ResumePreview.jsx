import React, { useContext } from "react";
import { ResumeInfoContext } from "../context/ResumeInfoContext";
import PersonalDetailPreview from "./PersonalDetailPreview.jsx";
import ProfessionalExperience from "./ProfessionalExperience.jsx";
import Summary from "./Summary.jsx";
import EducationalPreview from "./EducationalPreview.jsx";
import SkillsPreview from "./SkillsPreview.jsx";
const ResumePreview = () => {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  return (
    <div
      className="shadow-lg h-full p-14 border-t-[20px] print-data"
      style={{ borderColor: resumeInfo?.themeColor }}
    >
      {/* Personal detail */}
      <PersonalDetailPreview resumeInfo={resumeInfo} />
      <Summary resumeInfo={resumeInfo}></Summary>
      {resumeInfo?.experience?.length > 0 && (
        <ProfessionalExperience resumeInfo={resumeInfo} />
      )}
      {resumeInfo?.education?.length > 0 && (
        <EducationalPreview resumeInfo={resumeInfo} />
      )}
      {resumeInfo?.skills?.length > 0 && (
        <SkillsPreview resumeInfo={resumeInfo} />
      )}
    </div>
  );
};

export default ResumePreview;
