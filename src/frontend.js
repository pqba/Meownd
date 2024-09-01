document.addEventListener("DOMContentLoaded", (event) => {
    const button = document.getElementById('fetch-button'); 
    button.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent the form from submitting
        const limit = document.getElementById('amount').value; 
        const breed = document.getElementById('breed').value; 
        getInfo(limit, breed); // Call getInfo with the values from the input fields
    });
});

function renderOnPage(data) {
    let content = '';
    data.forEach(element => {
        let item = `<img src=${element.url}> <p>${element.breeds[0].description}</p>`;
        content += item;
    });
    document.getElementById("meow").innerHTML = content;
}
function getInfo(limit, breed) { 
    const PORT = 3000;
    fetch(`http://localhost:${PORT}/get-images?limit=${limit}&breed_ids=${breed}`)
        .then(response => response.json())
        .then(data => {
            renderOnPage(data);
        })
        .catch(error => {
            console.error("Issue fetching cat images!");
        });
}
