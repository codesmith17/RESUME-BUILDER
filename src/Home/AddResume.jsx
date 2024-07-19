import { PlusSquare } from "lucide-react";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
const AddResume = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [resumeTitle, setResumeTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  const onCreate = async () => {
    setLoading(true);
    const resumeId = uuidv4();
    try {
      // console.log(id);
      const res = await fetch(
        "http://localhost:3000/api/resumes/createResume",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userEmail: user?.primaryEmailAddress?.emailAddress,
            userName: user?.fullName,
            title: resumeTitle,
            resumeid: resumeId,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to create resume");
      }

      setOpenDialog(false);
      navigate(`/dashboard/resume/${resumeId}/edit`);
      setResumeTitle("");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className="p-1 py-24 items-center flex justify-center rounded-lg border-dashed h-[280px] bg-secondary hover:scale-105 transition-all hover:shadow-md cursor-pointer"
        onClick={() => setOpenDialog(true)}
      >
        <PlusSquare size={48} />
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Resume</DialogTitle>
            <DialogDescription>
              <p>Add title for your new resume</p>
              <Input
                className="my-2"
                placeholder="e.g., Full Stack Resume"
                value={resumeTitle}
                onChange={(e) => setResumeTitle(e.target.value)}
              />
            </DialogDescription>
            <div className="flex justify-end gap-5 my-6">
              <Button
                onClick={() => setOpenDialog(false)}
                variant="destructive"
              >
                Cancel
              </Button>
              <Button disabled={!resumeTitle || loading} onClick={onCreate}>
                {loading ? "Creating..." : "Create"}
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddResume;
