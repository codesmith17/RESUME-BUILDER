import React, { useEffect, useState, useContext, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Brain,
  LoaderCircle,
  PlusCircleIcon,
  MinusCircleIcon,
  SquareCheck,
} from "lucide-react";
// import { useParams } from "react-router-dom";
import RichTextEditor from "../../Home/RichTextEditor";
import { ResumeInfoContext } from "../../context/ResumeInfoContext";
import { useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

const Experience = ({ enabledNext }) => {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const { toast } = useToast();
  const params = useParams();

  const [experienceList, setExperienceList] = useState([
    {
      title: "",
      companyName: "",
      city: "",
      state: "",
      startDate: "",
      endDate: "",
      workSummary: "",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiGeneratedSummaries, setAiGeneratedSummaries] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    setExperienceList((prevList) =>
      prevList.map((item, i) =>
        i === index ? { ...item, [name]: value } : item
      )
    );
  };

  const addNewExperience = () => {
    setExperienceList((prevList) => [
      ...prevList,
      {
        title: "",
        companyName: "",
        city: "",
        state: "",
        startDate: "",
        endDate: "",
        workSummary: "",
      },
    ]);
  };

  const removeNewExperience = () => {
    setExperienceList((prevList) => prevList.slice(0, -1));
  };

  const handleRichTextEditorChange = useCallback((newValue, name, index) => {
    setExperienceList((prevList) => {
      const newList = prevList.map((item, i) =>
        i === index ? { ...item, [name]: newValue } : item
      );
      return newList;
    });
  }, []);
  // const handleRichTextEditor = (e, name, index) => {
  //   const newEntries = experienceList.slice();
  //   newEntries[index][name] = e.target.value;
  //   console.log(newEntries[index]);
  //   setExperienceList(newEntries);
  //   // console.log(experienceList);
  // };
  const [currentExpIndexAI, setCurrentExpIndexAI] = useState(0);
  const generateAISummaries = async (index) => {
    const currentExperience = experienceList[index];
    const requiredFields = [
      "title",
      "companyName",
      "city",
      "state",
      "startDate",
      "endDate",
    ];
    const emptyFields = requiredFields.filter(
      (field) => currentExperience[field] === ""
    );

    if (emptyFields.length > 0) {
      toast({
        title: "Incomplete Information",
        description: `Please fill in all required fields: ${emptyFields.join(
          ", "
        )}`,
        variant: "destructive",
      });
      return;
    }

    setAiLoading(true);
    setIsDialogOpen(true);
    setCurrentExpIndexAI(index);

    const prompt = `
      Create a concise and impactful resume experience using the above data with a strong focus on the job title. Use the following details:
  
      Name: ${resumeInfo.firstName} ${resumeInfo.lastName}
      Job Title: ${resumeInfo.jobTitle}
      Email: ${resumeInfo.email}
      Experience and Company Name: ${currentExperience.title}, ${currentExperience.companyName}
      
      The experience should emphasize the individual's job title and highlight their key qualifications and achievements relevant to this role. Make sure the summary is professional and tailored to showcase their expertise in the job title effectively.
      Give 2-3 options for this in JSON format. Provide an array of objects with a "summary" field.
      Don't give anything else. Just the list of summary, it breaks my app.
    `;

    try {
      const response = await fetch(
        `http://localhost:3000/api/resumes/aiGenSummary/${prompt}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate AI summaries");
      }

      const data = await response.json();
      setAiGeneratedSummaries(data);
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to generate AI summaries",
        description: "An error occurred while generating summaries.",
      });
    }

    setAiLoading(false);
  };

  const selectAISummary = (index, selectedSummary) => {
    // console.log(selectedSummary);
    handleRichTextEditorChange(
      selectedSummary,
      "workSummary",
      currentExpIndexAI
    );

    setIsDialogOpen(false);
  };

  const onSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    enabledNext(false);

    try {
      const response = await fetch(
        "http://localhost:3000/api/resumes/upsertExperience",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resumeId: params.resumeId,
            experienceList,
          }),
        }
      );
      console.log(response);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to save data: ${errorData.message}`);
      }
      toast({
        title: "Data saved successfully",
        description: "Your experience details have been updated.",
      });
      setLoading(false);
      enabledNext(true);
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast({
        title: "Failed to save data",
        description: "An error occurred while saving the data.",
      });
    }
  };
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  useEffect(() => {
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
      console.log(response);
      if (!response.ok) {
        throw new Error(response.status);
      }
      const data = await response.json();
      if (data.message !== "FETCHED SSUCCESSFULLY")
        throw new Error(response.status);
      const dummyArray = resumeInfo.experience;
      console.log(resumeInfo);
      const actualData =
        data && data?.data && data?.data.length ? data.data : dummyArray;
      if (actualData === dummyArray) {
        setExperienceList(actualData);
        setInitialDataLoaded(true);
        return;
      }
      const parsedExperienceList = actualData.map((item) => item.experience);

      setExperienceList(parsedExperienceList);
      setInitialDataLoaded(true);
    };
    if (!initialDataLoaded) fetchExperience();
    setResumeInfo((prevInfo) => ({
      ...prevInfo,
      experience: experienceList,
    }));
    console.log(experienceList);
  }, [experienceList, initialDataLoaded]);

  return (
    <div>
      <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
        <h2 className="font-bold text-lg">Professional Experience</h2>
        <p>Add your previous job experience</p>
        <form onSubmit={onSave}>
          {experienceList.map((item, index) => (
            <div key={index}>
              <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
                <div>
                  <label className="text-xs">Position Title</label>
                  <Input
                    name="title"
                    required
                    onChange={(event) => handleChange(index, event)}
                    value={item.title}
                  />
                </div>
                <div>
                  <label className="text-xs">Company Name</label>
                  <Input
                    name="companyName"
                    required
                    onChange={(event) => handleChange(index, event)}
                    value={item.companyName}
                  />
                </div>
                <div>
                  <label className="text-xs">City</label>
                  <Input
                    name="city"
                    required
                    onChange={(event) => handleChange(index, event)}
                    value={item.city}
                  />
                </div>
                <div>
                  <label className="text-xs">State</label>
                  <Input
                    name="state"
                    required
                    onChange={(event) => handleChange(index, event)}
                    value={item.state}
                  />
                </div>
                <div>
                  <label className="text-xs">Start Date</label>
                  <Input
                    type="date"
                    name="startDate"
                    required
                    onChange={(event) => handleChange(index, event)}
                    value={item.startDate}
                  />
                </div>
                <div>
                  <label className="text-xs">End Date</label>
                  <Input
                    type="date"
                    name="endDate"
                    required
                    onChange={(event) => handleChange(index, event)}
                    value={item.endDate}
                  />
                </div>
                <div className="col-span-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary text-primary flex my-2"
                    onClick={() => generateAISummaries(index)}
                    disabled={aiLoading}
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    {aiLoading ? "Generating..." : "Generate from AI"}
                  </Button>

                  <RichTextEditor
                    key={`editor-${index}`}
                    index={index}
                    defaultValue={item.workSummary}
                    name="workSummary"
                    onRichTextEditorChange={handleRichTextEditorChange}
                  />
                </div>
              </div>
            </div>
          ))}
          <div className="my-10 flex justify-between">
            <div className="flex flex-row gap-2">
              <Button type="button" onClick={addNewExperience}>
                <PlusCircleIcon className="mr-2" /> Add more experience
              </Button>
              {experienceList.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={removeNewExperience}
                >
                  <MinusCircleIcon className="mr-2" /> Remove
                </Button>
              )}
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <LoaderCircle className="animate-spin mr-2" />
              ) : (
                <SquareCheck className="mr-2" />
              )}
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md w-full">
          <DialogHeader>
            <DialogTitle>Choose an AI-generated summary</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto pr-2">
            {aiLoading ? (
              <>
                <Skeleton className="w-full h-24 mb-2 animate-pulse" />
                <Skeleton className="w-full h-24 mb-2 animate-pulse" />
                <Skeleton className="w-full h-24 mb-2 animate-pulse" />
              </>
            ) : (
              <AnimatePresence>
                {aiGeneratedSummaries.map((aiSummary, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full mb-2 text-left h-auto whitespace-normal"
                      onClick={() => selectAISummary(index, aiSummary.summary)}
                    >
                      {aiSummary.summary}
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Experience;
