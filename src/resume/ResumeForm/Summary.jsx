import React, { useContext, useEffect, useState } from "react";
import { ResumeInfoContext } from "../../context/ResumeInfoContext";
import { Button } from "../../components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "react-router-dom";
import { LoaderCircle, Brain } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

const Summary = ({ enabledNext }) => {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const params = useParams();
  const { toast } = useToast();
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [aiGeneratedSummaries, setAiGeneratedSummaries] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleInputChange = (e) => {
    enabledNext(false);
    const { name, value } = e.target;
    setSummary(value);
    setResumeInfo((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const getInitialSummary = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/resumes/getSummaryById/${params.resumeId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        const actualData =
          data && data?.data && data?.data.length ? data?.data[0] : null;
        if (actualData) {
          setSummary(actualData.summary);
          setResumeInfo((prev) => ({ ...prev, summary: actualData.summary }));
        } else {
          setSummary(resumeInfo?.summary || "");
        }
        setInitialDataLoaded(true);
      } catch (err) {
        console.error(err);
        throw new Error();
      }
    };
    if (!initialDataLoaded) getInitialSummary();
  }, [resumeInfo?.summary, initialDataLoaded, params.resumeId, setResumeInfo]);

  const generateAISummaries = async () => {
    setAiLoading(true);
    setIsDialogOpen(true);
    const prompt = `
      Create a concise and impactful resume summary using the above data with a strong focus on the job title. Use the following details:
  
      Name: ${resumeInfo.firstName} ${resumeInfo.lastName}
      Job Title: ${resumeInfo.jobTitle}
      Email: ${resumeInfo.email}
      
      The experience should emphasize the individual's job title and highlight their key qualifications and achievements relevant to this role. Make sure the summary is professional and tailored to showcase their expertise in the job title effectively.
      Give 2-3 options for this in JSON format. Provide an array of objects with a "summary" field.
      Don't give anything else. Just the list of summary, it breaks my app.
    `;
    try {
      const response = await fetch(
        `http://localhost:3000/api/resumes/aiGenSummary/${prompt}`
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

  const selectAISummary = (selectedSummary) => {
    setSummary(selectedSummary);
    setResumeInfo((prev) => ({ ...prev, summary: selectedSummary }));
    setIsDialogOpen(false);
    enabledNext(false);
  };

  const onSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3000/api/resumes/updateSummary",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ resumeId: params.resumeId, summary }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to save data");
      }
      toast({
        title: "Data saved successfully",
        description: "Your summary has been updated.",
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

  return (
    <div>
      <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
        <h2 className="font-bold text-lg">Summary</h2>
        <p>Add summary for your job title</p>

        <form className="mt-7" onSubmit={onSave}>
          <div className="flex justify-between items-end">
            <label>Add summary</label>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  onClick={generateAISummaries}
                  size="sm"
                  className="border-primary text-primary flex gap-2"
                >
                  <Brain className="h-4 w-4" />
                  Generate from AI
                </Button>
              </DialogTrigger>
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
          <Textarea
            className="mt-5"
            required
            name="summary"
            value={summary || ""}
            onChange={handleInputChange}
          />
          <div className="mt-2 flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? <LoaderCircle className="animate-spin mr-2" /> : null}
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Summary;
