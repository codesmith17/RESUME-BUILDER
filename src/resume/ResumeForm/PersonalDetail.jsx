import React, { useContext, useState, useEffect } from "react";
import { ResumeInfoContext } from "../../context/ResumeInfoContext";
import { Input } from "@/components/ui/input";
import { Button } from "../../components/ui/button";
import { useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast.js"; // Adjust the import path as needed

const PersonalDetail = ({ enabledNext }) => {
  const params = useParams();
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    resumeId: params.resumeId,
    firstName: resumeInfo?.firstName || resumeInfo?.firstname || "",
    lastName: resumeInfo?.lastName || resumeInfo?.lastname || "",
    jobTitle: resumeInfo?.jobTitle || resumeInfo?.jobtitle || "",
    address: resumeInfo?.address || "",
    phone: resumeInfo?.phone || "",
    email: resumeInfo?.email || "",
  });

  const [loading, setLoading] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  useEffect(() => {
    const getInitialData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/resumes/getAdditionalInfoById/${params.resumeId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const result = await response.json();
        const actualData = result.data[0] || {};

        // Normalize keys
        const normalizedData = {
          firstName: actualData.firstName || actualData.firstname || "",
          lastName: actualData.lastName || actualData.lastname || "",
          jobTitle: actualData.jobTitle || actualData.jobtitle || "",
          address: actualData.address || "",
          phone: actualData.phone || "",
          email: actualData.email || "",
        };

        setResumeInfo((prev) => ({ ...prev, ...normalizedData }));
        setFormData((prev) => ({ ...prev, ...normalizedData }));
        setInitialDataLoaded(true);
      } catch (error) {
        console.error(error);
        toast({
          title: "Failed to fetch data",
          description: "An error occurred while fetching the data.",
        });
      }
    };

    if (!initialDataLoaded) getInitialData();
  }, [params.resumeId, initialDataLoaded, setResumeInfo, toast]);

  const handleInputChange = (e) => {
    enabledNext(false);
    const { name, value } = e.target;
    setResumeInfo((prev) => ({ ...prev, [name]: value }));
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    enabledNext(true);
    try {
      const response = await fetch(
        "http://localhost:3000/api/resumes/upsertAdditionalInfo",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      await response.json();
      setLoading(false);
      toast({
        title: "Data saved successfully",
        description: "Your personal details have been updated.",
      });
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
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4">
      <h2 className="font-bold text-lg">Personal Detail</h2>
      <p>Get started with the basic information</p>
      <form onSubmit={onSave}>
        <div className="grid grid-cols-2 mt-5 gap-3">
          <div>
            <label className="text-sm">First Name</label>
            <Input
              name="firstName"
              value={formData.firstName}
              required
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="text-sm">Last Name</label>
            <Input
              name="lastName"
              value={formData.lastName}
              required
              onChange={handleInputChange}
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm">Job Title</label>
            <Input
              name="jobTitle"
              value={formData.jobTitle}
              required
              onChange={handleInputChange}
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm">Address</label>
            <Input
              name="address"
              value={formData.address}
              required
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="text-sm">Phone</label>
            <Input
              name="phone"
              value={formData.phone}
              required
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="text-sm">Email</label>
            <Input
              name="email"
              value={formData.email}
              required
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PersonalDetail;
