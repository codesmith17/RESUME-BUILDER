const GetUserResume = async(userEmail) => {
    try {
        const response = await fetch(`http://localhost:3000/api/resumes/getResumes/${userEmail}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch resumes');
        }

        const data = await response.json();
        return data;
    } catch (err) {
        console.error("Error fetching resumes", err);
        throw new Error(err);
    }
};
export default GetUserResume;