import React, { useEffect, useState, useContext } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

  const handleRichTextEditorChange = (index, value) => {
    setExperienceList((prevList) =>
      prevList.map((item, i) =>
        i === index ? { ...item, workSummary: value } : item
      )
    );
  };

  const generateAISummaries = async (index) => {
    setAiLoading(true);
    setIsDialogOpen(true);
    const aiParameter = JSON.stringify({
      firstName: resumeInfo.firstName,
      lastName: resumeInfo.lastName,
      email: resumeInfo.email,
      jobTitle: resumeInfo.jobTitle,
      experience: experienceList[index],
    });
    try {
      const response = await fetch(
        `http://localhost:3000/api/resumes/aiGenSummary/${aiParameter}`
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
    handleRichTextEditorChange(index, selectedSummary);
    setIsDialogOpen(false);
  };

  const onSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    enabledNext(false);

    try {
      const response = await fetch(
        "http://localhost:3000/api/resumes/updateExperience",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resumeId: params.resumeId,
            experience: experienceList,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to save data");
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

  useEffect(() => {
    setResumeInfo((prevInfo) => ({
      ...prevInfo,
      experience: experienceList,
    }));
  }, [experienceList, setResumeInfo]);

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
                    onChange={(event) => handleChange(index, event)}
                    value={item.title}
                  />
                </div>
                <div>
                  <label className="text-xs">Company Name</label>
                  <Input
                    name="companyName"
                    onChange={(event) => handleChange(index, event)}
                    value={item.companyName}
                  />
                </div>
                <div>
                  <label className="text-xs">City</label>
                  <Input
                    name="city"
                    onChange={(event) => handleChange(index, event)}
                    value={item.city}
                  />
                </div>
                <div>
                  <label className="text-xs">State</label>
                  <Input
                    name="state"
                    onChange={(event) => handleChange(index, event)}
                    value={item.state}
                  />
                </div>
                <div>
                  <label className="text-xs">Start Date</label>
                  <Input
                    type="date"
                    name="startDate"
                    onChange={(event) => handleChange(index, event)}
                    value={item.startDate}
                  />
                </div>
                <div>
                  <label className="text-xs">End Date</label>
                  <Input
                    type="date"
                    name="endDate"
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
                    index={index}
                    defaultValue={item.workSummary}
                    onRichTextEditorChange={(event) =>
                      handleRichTextEditorChange(index, event.target.value)
                    }
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
                      onClick={() => selectAISummary(aiSummary.summary)}
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
