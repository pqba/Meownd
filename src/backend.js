const express = require('express'); 
const axios = require('axios'); 
const cors = require('cors');

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

      const { limit, breed_ids } = req.query; // Extract limit and content_id from query parameters

      const apiUrl = `https://api.thecatapi.com/v1/images/search?api_key=${API_KEY}&limit=${limit}&breed_ids=${breed_ids}`

      const response = await axios.get(apiUrl); 
      const data = response.data; 
      // Extract data from get request

      res.json(data); // Send to client
  } catch (error) {
      // Log and send error response to client
      console.error('Error fetching images:', error); 
      res.status(500).json({ error: 'Failed to fetch images from Cat Api.' }); 
  }
});

app.listen(PORT, () => { 
  console.log(`Server is running on http://localhost:${PORT}`); 
});


