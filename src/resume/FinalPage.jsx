import React, { useState, useEffect } from "react";
import { ResumeInfoContext } from "../context/ResumeInfoContext";
import { useToast } from "@/components/ui/use-toast.js";
import ResumePreview from "./ResumePreview";
import { Printer } from "lucide-react";
import { Button } from "../components/ui/button";
import { useParams } from "react-router-dom";
import dummy from "../data/dummy.jsx";
import {
  EmailShareButton,
  EmailIcon,
  FacebookShareButton,
  FacebookIcon,
  WhatsappIcon,
  TelegramShareButton,
  TelegramIcon,
  WhatsappShareButton,
} from "react-share";
const FinalPage = () => {
  const HandleDownload = () => {
    window.print();
  };
  const { resumeId } = useParams();
  const shareUrl = `http://localhost:5173/myResume/${resumeId}`;
  //   console.log(dummy);
  const [resumeInfo, setResumeInfo] = useState();

  //   console.log(useParams());
  const { toast } = useToast();
  useEffect(() => {
    const getPersonalDetail = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/resumes/getAdditionalInfoById/${resumeId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const result = await response.json();
        const emptyObject = {};
        const actualData = result.data[0] || emptyObject;

        // Normalize keys

        const normalizedData = {
          firstName:
            actualData.firstName || actualData.firstname || dummy.firstName,
          lastName:
            actualData.lastName || actualData.lastname || dummy.lastName,
          jobTitle:
            actualData.jobTitle || actualData.jobtitle || dummy.jobTitle,
          address: actualData.address || dummy.address,
          phone: actualData.phone || dummy.phone,
          email: actualData.email || DocumentTimeline.email,
        };

        setResumeInfo((prev) => ({ ...prev, ...normalizedData }));
      } catch (error) {
        console.error(error);
        toast({
          title: "Failed to fetch data",
          description: "An error occurred while fetching the data.",
        });
      }
    };
    const fetchExperience = async () => {
      const response = await fetch(
        ` http://localhost:3000/api/resumes/getExperience/2b295add-6237-473f-ae3d-ed74d131f9e3`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      //   console.log(response);
      if (!response.ok) {
        throw new Error(response.status);
      }
      const data = await response.json();
      console.log(data);
      if (data.message !== "FETCHED SSUCCESSFULLY")
        throw new Error(response.status);
      const dummyArray = dummy.experience;

      const actualData =
        data && data?.data && data?.data.length ? data.data : dummyArray;
      if (actualData === dummyArray) {
        setResumeInfo((prev) => ({ ...prev, experience: dummyArray }));

        return;
      }
      const parsedExperienceList = actualData.map((item) => item.experience);
      console.log(parsedExperienceList);
      setResumeInfo((prev) => ({ ...prev, experience: parsedExperienceList }));
    };
    const fetchEducation = async () => {
      const response = await fetch(
        `http://localhost:3000/api/resumes/getEducation/${resumeId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      if (!response.ok) {
        throw new Error(response.status);
      }
      //   console.log(resumeInfo.education);
      const data = await response.json();
      if (data.message !== "FETCHED SSUCCESSFULLY")
        throw new Error(response.status);

      const dummyArray = resumeInfo.education;
      //   console.log(resumeInfo);
      const actualData =
        data && data?.data && data?.data.length ? data.data : dummyArray;
      if (actualData === dummyArray) {
        setResumeInfo((prev) => ({ ...prev, education: dummyArray }));

        return;
      }
      const parsedEducationList = actualData.map((item) => item.education);
      console.log(parsedEducationList);
      setResumeInfo((prev) => ({ ...prev, education: parsedEducationList }));
    };
    const fetchSkills = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/resumes/getSkills/${resumeId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const actualData = await response.json();
        console.log("Fetched skills:", actualData);
        const displayData =
          actualData.data && actualData.data.length
            ? actualData.data
            : dummy.skills;

        setResumeInfo((prevInfo) => ({
          ...prevInfo,
          skills: displayData.map((item) => item.skills),
        }));
      } catch (error) {
        console.error("Error fetching skills:", error);
        toast({
          title: "Failed to fetch skills",
          description: "An error occurred while fetching the skills.",
          variant: "destructive",
        });
      }
    };
    const getInitialSummary = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/resumes/getSummaryById/${resumeId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        const actualData =
          data && data?.data && data?.data.length
            ? data?.data[0]
            : dummy.summary;

        setResumeInfo((prev) => ({ ...prev, summary: actualData.summary }));

        setInitialDataLoaded(true);
      } catch (err) {
        console.error(err);
        throw new Error();
      }
    };
    setResumeInfo((prev) => ({ ...prev, themeColor: "#ff6666" }));
    getPersonalDetail();
    getInitialSummary();
    fetchExperience();
    fetchEducation();
    fetchSkills();
  }, []);
  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div id="no-print">
        <div className="my-10 mx-10 md:mx-20 lg:mx-36" id="print-none">
          <h2 className="text-center text-2xl font-medium">
            Congrats! Your Ultimate AI generates Resume is ready !{" "}
          </h2>
          <p className="text-center text-gray-400">
            Now you are ready to download your resume and you can share unique
            resume url with your friends and family{" "}
          </p>
          <div className="flex justify-between px-44 my-10 w-fit gap-6 mx-auto">
            <Button
              variant="outline"
              size="sm"
              className="flex gap-2"
              onClick={HandleDownload}
            >
              <Printer></Printer> Download
            </Button>
            <FacebookShareButton
              url={shareUrl}
              className="Demo__some-network__share-button"
            >
              <FacebookIcon
                size={32}
                className="hover:scale-110 transition-all"
                round
              />
            </FacebookShareButton>
            <WhatsappShareButton url={shareUrl}>
              <WhatsappIcon
                className="hover:scale-110 transition-all"
                size={32}
                round
              />
            </WhatsappShareButton>
            <TelegramShareButton url={shareUrl}>
              <TelegramIcon
                className="hover:scale-110 transition-all"
                size={32}
                round
              />
            </TelegramShareButton>
            <EmailShareButton url={shareUrl}>
              <EmailIcon
                className="hover:scale-110 transition-all"
                size={32}
                round
              />
            </EmailShareButton>
          </div>
        </div>
      </div>
      <div className="my-10 mx-10 md:mx-20 lg:mx-60">
        <div id="print-area">
          <ResumePreview />
        </div>
      </div>
    </ResumeInfoContext.Provider>
  );
};

export default FinalPage;
