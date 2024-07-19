import React, { useContext, useEffect, useState } from "react";
import { ResumeInfoContext } from "../../context/ResumeInfoContext";
import { Button } from "../../components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { Brain } from "lucide-react";
const Summary = () => {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [summary, setSummary] = useState();
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const [aiGeneratedsummaryList, setAiGeneratesummaryList] = useState();
  useEffect(() => {
    summary &&
      setResumeInfo({
        ...resumeInfo,
        summary,
      });
  }, [summary]);
  const onSave = (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      data: {
        summary: summary,
      },
    };
  };
  return (
    <div>
      <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
        <h2 className="font-bold text-lg">Summary</h2>
        <p>Add summary for your job title</p>

        <form className="mt-7" onSubmit={onSave}>
          <div className="flex justify-between items-end">
            <label>Add summary</label>
            <Button
              variant="outline"
              //   onClick={() => GeneratesummaryFromAI()}
              type="button"
              size="sm"
              className="border-primary text-primary flex gap-2"
            >
              <Brain className="h-4 w-4" /> Generate from AI
            </Button>
          </div>
          <Textarea
            className="mt-5"
            required
            value={summary}
            defaultValue={summary ? summary : resumeInfo?.summary}
            onChange={(e) => setSummary(e.target.value)}
          />
          <div className="mt-2 flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Summary;
