import { Notebook } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const ResumeCardItem = ({ resume }) => {
  //   console.log(resume);
  return (
    <Link to={`/dashboard/resume/${resume.resumeid}/edit`} className="block">
      <div className="p-14 bg-secondary flex items-center justify-center h-[280px] border border-primary rounded-lg hover:scale-105 transition-all hover:shadow-md shadow-primary">
        <Notebook size={48} />
      </div>
      <h2 className="text-center my-1">{resume.title}</h2>
    </Link>
  );
};

export default ResumeCardItem;
