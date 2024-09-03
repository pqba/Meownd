const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const gemini = new GoogleGenerativeAI(process.env.GENAI_KEY).getGenerativeModel({ model: "gemini-1.5-flash" });

import universal_values from './constants';

const app = express();
const PORT = 3000;
const API_KEY = process.env.CAT_API;


app.use(cors()); // Use CORS middleware, '*' for now



/* DOCS: https://developers.thecatapi.com/view-account/API_KEY (without live_) */
app.get('/get-images', async (req, res) => {
  try {
    if (!API_KEY) {
      throw new Error('API Key is missing');
    }

    const { limit, breed_ids, has_breeds } = req.query; // Extract limit and content_id from query parameters
    if (!validCall(limit, breed_ids, has_breeds)) {
      throw new Error('Invalid API call parameters.');
    }
    const apiUrl = `https://api.thecatapi.com/v1/images/search?api_key=${API_KEY}&limit=${limit}&breed_ids=${breed_ids}&has_breeds=${has_breeds}`

    const response = await axios.get(apiUrl);
    const data = response.data;
    //     data["_geministory"] = imagineStory(formatCatAPI(data),data["url"]);
    data["_geministory"] = "TODO: generate story.";
    // Extract data from get request

    res.json(data); // Send to client
  } catch (error) {
    // Log and send error response to client
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Failed to fetch images from Cat Api.', type: error });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

function validCall(user_limit, user_breed, want_breed) {
  return (user_limit > 0 && user_limit <= 100) && (want_breed == 1 || want_breed == 0) && (user_breed in universal_values.breed_list);
}

function formatCatAPI(resp_json) {
  return "";
}

async function imagineStory(formattedText, image_url) {
  try {
    const prompt = `Generate a paragraph length story based on: ${formattedText}`;
    const image = {
      inlineData: {
        // image buffer base64 from link? http request?
        mimeType: 'image/png',
      },
    }
    const story = await model.generateContent([prompt, image]);
    return story;
  }
  catch (error) {
    return "Couldn't generate story.";
  }
}
