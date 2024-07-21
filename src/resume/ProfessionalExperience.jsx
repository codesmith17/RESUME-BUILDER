import React from "react";
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { month: "short", year: "numeric" };
  return date.toLocaleDateString("en-GB", options).replace(/ /g, " ");
}
function ProfessionalExperience({ resumeInfo }) {
  // console.log(resumeInfo);
  return (
    <div className="my-6">
      <h2
        className="text-center font-bold text-sm mb-2"
        style={{
          color: resumeInfo?.themeColor,
        }}
      >
        Professional Experience
      </h2>
      <hr
        style={{
          borderColor: resumeInfo?.themeColor,
        }}
      />

      {resumeInfo?.experience?.map((experience, index) => (
        <div key={index} className="my-5">
          <h2
            className="text-sm font-bold"
            style={{
              color: resumeInfo?.themeColor,
            }}
          >
            {experience?.title}
          </h2>
          <h2 className="text-xs flex justify-between">
            {experience?.companyName},{experience?.city},{experience?.state}
            <span>
              {formatDate(experience?.startDate)} -{" "}
              {formatDate(experience.endDate)}
            </span>
          </h2>
          {/* <p className='text-xs my-2'>
                    {experience.workSummary}
                </p> */}
          <div
            className="text-xs my-2"
            dangerouslySetInnerHTML={{ __html: experience?.workSummary }}
          />
        </div>
      ))}
    </div>
  );
}

export default ProfessionalExperience;
