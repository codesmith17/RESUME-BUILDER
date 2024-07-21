const { GoogleGenerativeAI } = require("@google/generative-ai");


const fetchResumeSummaries = async(data) => {
    const GOOGLE_API_KEY = process.env.VITE_GEMINI_API_KEY;

    const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    // const { firstName, lastName, jobTitle, email } = data;
    // const prompt = `
    // Create a concise and impactful resume summary with a strong focus on the job title. Use the following details:

    // Name: ${firstName} ${lastName}
    // Job Title: ${jobTitle}
    // Email: ${email}

    // The summary should emphasize the individual's job title and highlight their key qualifications and achievements relevant to this role. Make sure the summary is professional and tailored to showcase their expertise in the job title effectively. 
    // Give 2-3 options for this in JSON format. Provide an array of objects with a "summary" field.
    // Dont give anything else. Just the list of summary, it breaks my app.
    // `;

    try {
        const result = await model.generateContent(data);
        let response = await result.response.text();

        // Sanitize the response to remove any extra characters
        console.log(typeof response);
        response = response.replace("```json", "");
        response = response.replace("```", "");
        // const sanitizedResponse = response.replace(/^```json\s*|\s*```$/g, '').trim();
        console.log(response);
        console.log("Sanitized response text:", response);

        // Parse the sanitized JSON response
        const summaries = JSON.parse(response);

        return summaries;
    } catch (error) {
        console.error("Error fetching resume summaries:", error);
        return [];
    }
};


module.exports = { fetchResumeSummaries };