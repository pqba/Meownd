import universal_values from './constants';

document.addEventListener("DOMContentLoaded", (event) => {
    const button = document.getElementById('fetch-button'); 
    button.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent the form from submitting
        const limit = document.getElementById('amount').value; 
        const breed = document.getElementById('breed').value; 
        getInfo(limit, breed); // Call getInfo with the values from the input fields
    });
});

// Ensure limit_amount is between (1,100) and breed_name exists.
function validateForm(limit_amount, breed_name) {
    return (limit_amount > 0 && limit_amount <= 100) && (breed_name in universal_values.breed_list);
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
    const PORT = 3000;
    fetch(`http://localhost:${PORT}/get-images?limit=${limit}&breed_ids=${breed}&has_breeds=1`)
        .then(response => response.json())
        .then(data => {
            renderOnPage(data);
        })
        .catch(error => {
            console.error("Issue fetching cat images!");
        });
}
