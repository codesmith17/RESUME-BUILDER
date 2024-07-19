import React, { useState, useEffect } from "react";
import AddResume from "./AddResume";
import ResumeCardItem from "./ResumeCardItem.jsx";
import GetUserResume from "../GlobalApi/api";
import { useUser } from "@clerk/clerk-react";

const Dashboard = () => {
  const { user } = useUser();
  const [resumeList, setResumeList] = useState([]);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const data = await GetUserResume(
          user?.primaryEmailAddress?.emailAddress
        );
        setResumeList(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (user) {
      fetchResumes();
    }
  }, [user]);

  return (
    <div className="p-10 md:px-20 lg:px-32">
      <h2 className="font-bold text-3xl">My Resume</h2>
      <p>Start creating AI Resume for your next job role</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mt-10 gap-10">
        <AddResume />
        {resumeList.length > 0 &&
          resumeList.map((resume, index) => (
            <ResumeCardItem resume={resume} key={index} />
          ))}
      </div>
    </div>
  );
};

export default Dashboard;
