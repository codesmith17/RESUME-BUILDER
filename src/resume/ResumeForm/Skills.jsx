import React, { useState, useContext, useEffect } from "react";
import { Rating } from "@smastrom/react-rating";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import "@smastrom/react-rating/style.css";
import { ResumeInfoContext } from "../../context/ResumeInfoContext";
import { PlusCircleIcon, MinusCircleIcon } from "lucide-react";
import { useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const Skills = () => {
  const [skillList, setSkillList] = useState([
    { skills: { name: "", rating: 0 } },
  ]);
  const { resumeId } = useParams();
  const { toast } = useToast();
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [loading, setLoading] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  useEffect(() => {
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
            : [{ skills: { name: "", rating: 0 } }];
        setSkillList(displayData);
        setResumeInfo((prevInfo) => ({
          ...prevInfo,
          skills: displayData.map((item) => item.skills),
        }));
        setInitialDataLoaded(true);
      } catch (error) {
        console.error("Error fetching skills:", error);
        toast({
          title: "Failed to fetch skills",
          description: "An error occurred while fetching the skills.",
          variant: "destructive",
        });
      }
    };

    if (!initialDataLoaded && resumeId) {
      fetchSkills();
    }
  }, [initialDataLoaded, resumeId, toast, setResumeInfo]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedSkills = skillList.map((item) => item.skills);
      const response = await fetch(
        "http://localhost:3000/api/resumes/upsertSkills",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            skillList: updatedSkills,
            resumeId,
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log("Save result:", result);
      setResumeInfo((prevInfo) => ({
        ...prevInfo,
        skills: updatedSkills,
      }));
      toast({
        title: "Data saved successfully",
        description: "Your skills have been updated.",
      });
    } catch (error) {
      console.error("Error saving skills:", error);
      toast({
        title: "Failed to save data",
        description: "An error occurred while saving the skills.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index, name, value) => {
    setSkillList((prev) => {
      const newSkillList = [...prev];
      newSkillList[index] = {
        skills: {
          ...newSkillList[index].skills,
          [name]: value,
        },
      };
      setResumeInfo((prevInfo) => ({
        ...prevInfo,
        skills: newSkillList.map((item) => item.skills),
      }));
      return newSkillList;
    });
  };

  const addNewSkill = () => {
    setSkillList((prev) => {
      const newList = [...prev, { skills: { name: "", rating: 0 } }];
      setResumeInfo((prevInfo) => ({
        ...prevInfo,
        skills: newList.map((item) => item.skills),
      }));
      return newList;
    });
  };

  const removeSkill = (index) => {
    setSkillList((prev) => {
      const newList =
        prev.length > 1 ? prev.filter((_, i) => i !== index) : prev;
      setResumeInfo((prevInfo) => ({
        ...prevInfo,
        skills: newList.map((item) => item.skills),
      }));
      return newList;
    });
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Skills</h2>
      <p>Add your top professional key skills</p>
      <form onSubmit={onSubmit}>
        <div>
          {skillList.map((item, index) => (
            <div
              key={index}
              className="mb-4 flex flex-row justify-between items-center border mt-3 rounded-lg p-3"
            >
              <div className="flex-grow mr-4">
                <label className="text-xs">Name</label>
                <Input
                  className="w-full"
                  value={item.skills.name}
                  onChange={(e) => handleChange(index, "name", e.target.value)}
                />
              </div>
              <div className="flex items-center">
                <Rating
                  style={{ maxWidth: 150 }}
                  value={item.skills.rating}
                  halfFillMode="box"
                  onChange={(value) => handleChange(index, "rating", value)}
                />
                {skillList.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removeSkill(index)}
                    className="ml-2"
                  >
                    <MinusCircleIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
          <div className="my-2">
            <div className="flex flex-row justify-between my-2">
              <Button type="button" onClick={addNewSkill}>
                <PlusCircleIcon className="mr-2" /> Add more skills
              </Button>
              <Button
                className="border-primary bg-primary text-white flex my-2"
                type="submit"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Skills;
