import React, { useState } from "react";
import PersonalDetail from "./ResumeForm/PersonalDetail";
import Summary from "./ResumeForm/Summary";
import Education from "./ResumeForm/Education";
import Experience from "./ResumeForm/Experience";
import { Button } from "../components/ui/button";
import { ArrowLeft, ArrowRight, LayoutGrid } from "lucide-react";
const FormSection = () => {
  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const [enableNext, setEnableNext] = useState(false);
  return (
    <div>
      <div className="flex flex-row justify-between items-center mb-9">
        <Button variant="outline" size="sm" className="flex gap-2">
          <LayoutGrid></LayoutGrid> Theme
        </Button>
        <div className="flex gap-2">
          {activeFormIndex > 1 && (
            <Button
              size="sm"
              className="flex gap-2"
              onClick={() => {
                setActiveFormIndex(activeFormIndex - 1);
              }}
            >
              <ArrowLeft></ArrowLeft>Previous
            </Button>
          )}
          <Button
            className="flex gap-2"
            size="sm"
            disabled={!enableNext}
            onClick={() => {
              setActiveFormIndex(activeFormIndex + 1);
            }}
          >
            Next <ArrowRight></ArrowRight>
          </Button>
        </div>
      </div>
      {activeFormIndex === 1 ? (
        <PersonalDetail
          enabledNext={(prev) => {
            setEnableNext(prev);
          }}
        />
      ) : activeFormIndex === 2 ? (
        <Summary
          enabledNext={(prev) => {
            setEnableNext(prev);
          }}
        />
      ) : activeFormIndex === 3 ? (
        <Experience
          enabledNext={(prev) => {
            setEnableNext(prev);
          }}
        />
      ) : activeFormIndex === 4 ? (
        <Education
          enabledNext={(prev) => {
            setEnableNext(prev);
          }}
        />
      ) : null}
    </div>
  );
};

export default FormSection;
