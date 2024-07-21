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
import RichTextEditor from "../../Home/RichTextEditor";
import { ResumeInfoContext } from "../../context/ResumeInfoContext";
import { useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

const Education = ({ enabledNext }) => {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const { toast } = useToast();
  const params = useParams();

  const [educationList, setEducationList] = useState([
    {
      universityName: "",
      degree: "",
      major: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiGeneratedSummaries, setAiGeneratedSummaries] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    setEducationList((prevList) =>
      prevList.map((item, i) =>
        i === index ? { ...item, [name]: value } : item
      )
    );
  };

  const addNewEducation = () => {
    setEducationList((prevList) => [
      ...prevList,
      {
        universityName: "",
        degree: "",
        major: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ]);
  };

  const removeNewEducation = () => {
    setEducationList((prevList) => prevList.slice(0, -1));
  };

  const handleRichTextEditorChange = useCallback((newValue, name, index) => {
    setEducationList((prevList) => {
      const newList = [...prevList];
      newList[index] = { ...newList[index], [name]: newValue };
      return newList;
    });
  }, []);

  const [currentEduIndexAI, setCurrentEduIndexAI] = useState(0);
  const generateAISummaries = async (index) => {
    const currentEducation = educationList[index];
    const requiredFields = [
      "universityName",
      "degree",
      "major",
      "startDate",
      "endDate",
    ];
    const emptyFields = requiredFields.filter(
      (field) => currentEducation[field] === ""
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
    setCurrentEduIndexAI(index);

    const prompt = `
      Create a concise and impactful resume education entry using the following details:
  
      University Name: ${currentEducation.universityName}
      Degree: ${currentEducation.degree}
      Major: ${currentEducation.major}
      Start Date: ${currentEducation.startDate}
      End Date: ${currentEducation.endDate}
      
      The summary should highlight the key aspects of the educational experience, including any notable achievements or relevant coursework. Provide 2-3 options for this in JSON format. Provide an array of objects with a "summary" field.
      Don't give anything else. Just the list of summaries, it breaks my app.
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
    handleRichTextEditorChange(
      selectedSummary,
      "description",
      currentEduIndexAI
    );

    setIsDialogOpen(false);
  };

  const onSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    enabledNext(false);

    try {
      const response = await fetch(
        "http://localhost:3000/api/resumes/upsertEducation",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resumeId: params.resumeId,
            educationList,
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
        description: "Your education details have been updated.",
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
    const fetchEducation = async () => {
      const response = await fetch(
        `http://localhost:3000/api/resumes/getEducation/${params.resumeId}`,
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
      console.log(resumeInfo.education);
      const data = await response.json();
      if (data.message !== "FETCHED SSUCCESSFULLY")
        throw new Error(response.status);

      const dummyArray = resumeInfo.education;
      console.log(resumeInfo);
      const actualData =
        data && data?.data && data?.data.length ? data.data : dummyArray;
      if (actualData === dummyArray) {
        setEducationList(actualData);
        setInitialDataLoaded(true);
        return;
      }
      const parsedEducationList = actualData.map((item) => item.education);

      setEducationList(parsedEducationList);
      setInitialDataLoaded(true);
    };
    if (!initialDataLoaded) fetchEducation();
    setResumeInfo((prevInfo) => ({
      ...prevInfo,
      education: educationList,
    }));
    console.log(educationList);
  }, [educationList, initialDataLoaded]);

  return (
    <div>
      <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
        <h2 className="font-bold text-lg">Education</h2>
        <p>Add your education</p>
        <form onSubmit={onSave}>
          {educationList.map((item, index) => (
            <>
              <div key={index}>
                <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
                  <div>
                    <label className="text-xs">University Name</label>
                    <Input
                      name="universityName"
                      required
                      onChange={(event) => handleChange(index, event)}
                      value={item.universityName}
                    />
                  </div>

                  <div>
                    <label className="text-xs">Degree</label>
                    <Input
                      name="degree"
                      required
                      onChange={(event) => handleChange(index, event)}
                      value={item.degree}
                    />
                  </div>
                  <div>
                    <label className="text-xs">Major</label>
                    <Input
                      name="major"
                      required
                      onChange={(event) => handleChange(index, event)}
                      value={item.major}
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
                      {aiLoading ? "Generating..." : "Generate AI Summary"}
                    </Button>
                    <RichTextEditor
                      key={`editor-${index}`}
                      index={index}
                      defaultValue={item.description}
                      name="description"
                      onRichTextEditorChange={handleRichTextEditorChange}
                    />
                  </div>
                </div>
              </div>
            </>
          ))}
          <div className="my-2">
            <div className="flex flex-row justify-between my-2">
              <div className="flex flex-row gap-2">
                <Button type="button" onClick={addNewEducation}>
                  <PlusCircleIcon className="mr-2" /> Add more education
                </Button>
                {educationList.length > 1 && (
                  <Button variant="destructive" onClick={removeNewEducation}>
                    <MinusCircleIcon className="h-4 w-4 mr-2" />
                    Remove Education
                  </Button>
                )}
              </div>
              <Button
                className="border-primary bg-primary text-white flex my-2"
                type="submit"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
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

export default Education;
