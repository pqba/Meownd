// Get constants.
let universal_values = {};
const PORT = 3000;

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

document.addEventListener("DOMContentLoaded", (event) => {
    const button = document.getElementById('fetch-button'); 
    button.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent the form from auto submit
        const limit = document.getElementById('amount').value; 
        const breed = document.getElementById('breed').value; 

        // Only render page if request is valid
        if(validateForm(limit,breed)) {
            getInfo(limit, breed); 
        }
        else {
            renderError("Invalid request, try again.");
        }
    });
});

// Ensure correct types, that limit_amount is between (1,100) and breed_name exists.
function validateForm(limit_amount, breed_name) {
    const digitRegex = /^\d+$/;
    if(!digitRegex.test(limit_amount) || typeof breed_name != "string") return false;
    console.log('pass!');
    return (parseInt(limit_amount) > 0 && parseInt(limit_amount) <= 100) && (universal_values.breeds.includes(breed_name));
}

// Renders the message 'e' in meow div on incorrect form submission
function renderError(e) {
    document.getElementById('meow').innerHTML = e;
}
// Renders json data from backend into html pages, looping element by element and adding the generated story.
function renderOnPage(data) {
    let content = '';
    data.forEach(element => {
        console.log(element);
        const cat = element.breeds[0];
        const breed = cat.name;
        const image_link = element.url;
        const desc = cat.description;
        const qualities = cat.temperament;
        const nation = cat.origin;
        const wiki = cat.wikipedia_url;
        const lbs = cat.weight.imperial;
        const kgs = cat.weight.metric;
        const lifespan = cat.life_span;
        let item = 
        `<h3>${breed}</h3>
        <img src=${image_link}> 
        <p>${desc}<br>They are from <b>${nation}</b> and weigh between ${kgs} kgs (${lbs} lbs). The average life span is ${lifespan} years.</p>
        <p>Qualities: <em>${qualities}</em></p>
        <p><a href=${wiki}>See Wikipedia</a></p><br>`;
        content += item;
    });
    document.getElementById("meow").innerHTML = content;
    document.getElementById("imagine").innerHTML = data._geministory;
}

// Sends a request to server based on specified breed and amount of images wanted
function getInfo(limit, breed) { 
    fetch(`http://localhost:${PORT}/get-images?limit=${limit}&breed_ids=${breed}&has_breeds=1`)
        .then(response => response.json())
        .then(data => {
            renderOnPage(data);
        })
        .catch(error => {
            console.error("Issue fetching cat images!");
        });
}
