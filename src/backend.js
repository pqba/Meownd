const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const gemini = new GoogleGenerativeAI(process.env.GENAI_KEY).getGenerativeModel({ model: "gemini-1.5-flash" });

const universal_values = require('./config.json');

const app = express();
const PORT = 3000;
const API_KEY = process.env.CAT_API;


app.use(cors()); // Use CORS middleware, '*' for now

/* DOCS: https://developers.thecatapi.com/view-account/API_KEY (without live_) */

// Request from this route 
app.get('/get-images', async (req, res) => {
  try {
    if (!API_KEY) {
      throw new Error('API Key is missing');
    }

    const { limit, breed_ids, has_breeds } = req.query; // Extract limit and content_id from query parameters
    if (!validateCall(limit, breed_ids, has_breeds)) {
      throw new Error('Invalid API call parameters.');
    }
    const apiUrl = `https://api.thecatapi.com/v1/images/search?api_key=${API_KEY}&limit=${limit}&breed_ids=${breed_ids}&has_breeds=${has_breeds}`

    // Get API response, form generative story.
    const response = await axios.get(apiUrl);
    const info = response.data;
    // TODO: const story = imagineStory(formatCatAPI(data),data["url"]);
    const story = "Lorem ipsum";

    const data = {
      info,
      story

    }
    res.json(data); // Send to client
  } catch (error) {
    // Log and send error response to client
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Failed to fetch images from Cat Api.', type: error });
  }
});

// Send config data over server (no CORS allowed otherwise)
app.get('/configuration', async (req,res) => {
    const config_path = path.join(__dirname,'/config.json')
    fs.readFile(config_path,'utf8', (err,data) => {
      if(err) {
        console.error("Issue fetching configuration file.",error);
        res.status(500).json({error: "Failed to fetch configuration file from server."});
      }
      else {
        res.setHeader('Content-Type', 'application/json');
        res.send(data);
      }
    }) 
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// // Ensure correct types for api request, that limit_amount is between (1,100) and breed_name exists.
function validateCall(user_limit, user_breed, want_breed) {
  const digitRegex = /^\d+$/;
  return (digitRegex.test(user_limit) && typeof user_breed == "string") && (user_limit > 0 && user_limit <= 100) && (want_breed == 1 || want_breed == 0) && (universal_values.breed_list.includes(user_breed));
}

// Take relevant fields from api response to form the text part of gemini prompt
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
