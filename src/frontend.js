// Get constants.
let universal_values = {};
const PORT = 3000;

document.addEventListener("DOMContentLoaded", (event) => {
    const button = document.getElementById('fetch-button'); 
    button.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent the form from auto submit
        const limit = sanitize(document.getElementById('amount').value); 
        const breed = sanitize(document.getElementById('breed').value); 

        renderError(""); // Clear error message

        // Only render page if request is valid
        if(validateForm(limit,breed)) {
            getInfo(limit, breed); 
        }
        else {
            renderError("Invalid request, try again.");
        }
    });
});


fetch(`http://localhost:${PORT}/configuration`)
  .then(response => response.json())
  .then(configData => {
    // Access the configuration data
    const breeds = configData.breed_list;
    const full_names = configData.name_list;
    universal_values = {
        full_names,
        breeds,
    }
  })
  .catch(error => {
    console.error('Error loading config.json:', error);
});


// Ensure correct types, that limit_amount is between (1,100) and breed_name exists.
function validateForm(limit_amount, breed_name) {
    const digitRegex = /^\d+$/;
    if(!digitRegex.test(limit_amount) || typeof breed_name != "string") return false;
    return (parseInt(limit_amount) > 0 && parseInt(limit_amount) <= 100) && (universal_values.breeds.includes(breed_name));
}

// Renders the message 'e' in meow div on incorrect form submission
function renderError(e) {
    document.getElementById('error').textContent = e;
}
// Renders json data from backend into html pages, looping element by element and adding the generated story.
function renderOnPage(data,oneBreed) {
    document.getElementById('meow').innerHTML = "";
    document.getElementById('imagine').textContent = "";

    // Send to alternate rendering function
    if(oneBreed) {
        renderOneCat(data);
        return;
    }

    const catsInfo = data.info;
    const llmStory = data.story;

    catsInfo.forEach(element => {
        const cat = element.breeds[0];
        const breed = cat.name;
        const image_link = element.url;
        const desc = cat.description;
        const qualities = cat.temperament;
        const nation = cat.origin;
        const country_id = cat.country_code;
        const wiki = cat.wikipedia_url;
        const lbs = cat.weight.imperial;
        const kgs = cat.weight.metric;
        const lifespan = cat.life_span;

        // Create elements
        const itemDiv = document.createElement('div'); // Container for each cat
        const breedH3 = document.createElement('h3');
        const nativeFlag = document.createElement('img');
        const catImage = document.createElement('img');
        const descParagraph = document.createElement('p');
        const qualitiesParagraph = document.createElement('p');
        const wikiLink = document.createElement('a');

        // content and attributes
        itemDiv.classList.add('cat');
        breedH3.textContent = breed;
        breedH3.style.textAlign = "center";
        nativeFlag.src = `https://flagsapi.com/${country_id}/flat/64.png`;
        nativeFlag.alt = "";
        catImage.src = image_link;
        catImage.classList.add('medium'); // styling
        descParagraph.innerHTML = `${desc}<br>They are from <b>${nation}</b> and weigh between ${kgs} kgs (${lbs} lbs). The average life span is ${lifespan} years.`;
        descParagraph.classList.add('smaller-text');
        qualitiesParagraph.classList.add('smaller-text');
        qualitiesParagraph.innerHTML = `Qualities: <em>${qualities}</em>`;
        wikiLink.textContent = 'See Wikipedia';
        wikiLink.href = wiki;

        // add to div
        itemDiv.appendChild(breedH3);
        itemDiv.appendChild(nativeFlag);
        itemDiv.appendChild(catImage);
        itemDiv.appendChild(descParagraph);
        itemDiv.appendChild(qualitiesParagraph);
        itemDiv.appendChild(wikiLink);

        document.getElementById("meow").appendChild(itemDiv);
})
    document.getElementById("imagine").textContent = llmStory;
}

function renderOneCat(data) {
    const cat = data.info;
    const llmStory = data.story;
    // TODO: finish render function.

    document.getElementById("imagine").textContent = llmStory;
}

// Sends a request to server based on specified breed and amount of images wanted
function getInfo(limit, breed) { 
    // Determine if page should be rendered as one breed or has a mix
    const isOneBreed = limit != "any";
    fetch(`http://localhost:${PORT}/get-images?limit=${limit}&breed_ids=${breed}&has_breeds=1`)
        .then(response => response.json())
        .then(data => {
            renderOnPage(data,isOneBreed);
        })
        .catch(error => {
            console.error("Issue fetching cat images!");
        });
}

// From: https://stackoverflow.com/questions/2794137/sanitizing-user-input-before-adding-it-to-the-dom-in-javascript
function sanitize(string) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
    };
    const reg = /[&<>"'/]/ig;
    return string.replace(reg, (match)=>(map[match]));
  }
  