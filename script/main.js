const contributors = document.getElementById("contributors_items");
// const modalText = document.querySelector(".modal-text");
// console.log(modalText);


const arrow_link = document.getElementById("arrow-link");
// console.log(arrow_link);
const latestItems = document.querySelector(".latest-items");
console.log(latestItems);


const openModalReceip = document.querySelector(".latest-overlay-modal-link");
console.log(openModalReceip);
const bodyModalReceip = document.querySelector(".modal");
console.log(bodyModalReceip);
const closeModalReceip = document.querySelector(".modal__close");
console.log(closeModalReceip);


latestItems.addEventListener("click", function(e) {
    const link = e.target.closest(".latest-overlay-modal-link");
    if(!link) return;
    e.preventDefault();
    bodyModalReceip.classList.add("active");
});


closeModalReceip.addEventListener("click",function(){
    bodyModalReceip.classList.remove("active");
} )
// console.log(contributors);

let limit = 5;
let skip = 0;
let total = 0;


async function getData() {
  const url = `https://dummyjson.com/users?limit=${limit}&skip=${skip}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    total = result.total;

    renderUsers(result.users);
  } catch (error) {
    console.error(error.message);
  }
}

async function getReceipData(){
    const url = `https://dummyjson.com/recipes`;

    try {
        const response = await fetch(url);
        
        
        if(!response.ok){
            throw new Error(`Response status: ${response.status}`);
        }
        const result = await response.json();
        console.log("Result: ", result);
        
    renderModaltext(result.text);
    }catch(error){
        console.error(error.message);
        
    }
}


function renderModaltext(text){
    modalText.innerHTML = "";

    text(text => {
    const html = `
        <div class="recipe-modal active">
            <div class="recipe-modal__content">
                <div class="recipe-modal__body">
                    <img src="${text.image}" alt="${text.name}" class="recipe-modal__image">

                    <div class="recipe-modal__meta">
                        ${text.cuisine} • 
                        ${text.difficulty} • 
                        ${text.cookTimeMinutes} min • 
                        ⭐ ${text.rating}
                    </div>

                    <div class="recipe-modal__ingredients">
                        <strong>Ingredients:</strong>
                        <ul>
                            ${text.ingredients.slice(0,5).map(i => `<li>${i}</li>`).join("")}
                        </ul>
                    </div>

                    <div class="recipe-modal__instructions">
                        <strong>Instructions:</strong>
                        <p>${text.instructions.slice(0,200)}...</p>
                    </div>
                </div>

            </div>
        </div>
    `;


    document.body.insertAdjacentHTML("beforeend", html);

    });
}
getReceipData();

function renderUsers(users){
    contributors.innerHTML = "";
    // console.log(users.length);
    
    users.forEach(user => {
        const html = `
        <div class="contributors_item">
            <img src="${user.image}" alt="${user.firstName}">
            <div class="contributors_text"> 
                <h3>${user.firstName} ${user.lastName}</h3>
            </div>
        </div>
        `;

        contributors.insertAdjacentHTML("beforeend", html);
                
    });



}

arrow_link.addEventListener("click",() => {
        // arrow_link
        skip = skip + limit;
        
        if (skip >= total){
            skip =0;
        }
        console.log("skip:", skip, "limit:", limit)
        getData();
            
});


getData();


