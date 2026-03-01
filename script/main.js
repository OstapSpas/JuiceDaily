const contributors = document.getElementById("contributors_items");
// const modalText = document.querySelector(".modal-text");
// console.log(modalText);


const arrow_link = document.getElementById("arrow-link");
// console.log(arrow_link);
const latestItems = document.querySelector(".latest-items");
// console.log(latestItems);


const openModalReceip = document.querySelector(".latest-overlay-modal-link");
// console.log(openModalReceip);
const bodyModalReceip = document.querySelector(".modal");
// console.log(bodyModalReceip);
const closeModalReceip = document.querySelector(".modal__close");
// console.log(closeModalReceip);


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
        // console.log("Result: ", result);
        
    // renderModaltext(result.text);
    }catch(error){
        console.error(error.message);
        
    }
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


const API = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita`;

const listLatest = document.querySelector(".latest-items");
console.log(listLatest);


const url = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita";

// const listLatest = document.querySelector(".latest-items");

async function renderLatesReceipt(url) {
  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }

    const data = await res.json();
    
    listLatest.innerHTML = "";

    if (!data.drinks || data.drinks.length === 0) {
      listLatest.innerHTML = "<p>No recipes found</p>";
      return;
    }
   


    data.drinks.forEach((drink) => {
    
    const title = drink.strDrink || "Untitled";
      const meta = drink.strCategory || drink.strAlcoholic || "Drink";
      const img = drink.strDrinkThumb || "";

      const html = `
        <div class="latest-item">
          <div class="latest-item-img">
            <img src="${img}" alt="${title}" />

            <a href="#" class="latest-overlay-modal-link" data-id="${drink.idDrink}">
              <div class="latest-overlay">
                <img
                  src="./img/receipt.svg"
                  alt="receipt"
                  class="icon-latest-overlay"
                />
              </div>
            </a>
          </div>

          <div class="item-text">
            <p class="small-item-text"><span>${meta}</span> - 5 mins read</p>
            <p>${title}</p>
          </div>
        </div>
      `;

      listLatest.insertAdjacentHTML("beforeend", html);
    });
  } catch (error) {
    console.log("Error:", error);
  }
}


renderLatesReceipt(API) ;

const viewport = document.querySelector(".latest-viewport");
const nextBtn = document.querySelector("#arrow-link-latest");

let idx = 0;
let step = 0;
let maxIndex = 0;
let sliderBound = false;

function getVisibleCount() {
  if (window.matchMedia("(max-width: 768px)").matches) return 1;
  if (window.matchMedia("(max-width: 992px)").matches) return 2;
  return 3;
}

function recalcSlider() {
  const items = listLatest.querySelectorAll(".latest-item");
  const count = items.length;

  if (count === 0) {
    idx = 0;
    step = 0;
    maxIndex = 0;
    listLatest.style.transform = "translateX(0px)";
    if (nextBtn) nextBtn.style.opacity = "0.4";
    return;
  }

  const visibleCount = getVisibleCount();
  maxIndex = Math.max(0, count - visibleCount);

  if (count >= 2) {
    const r0 = items[0].getBoundingClientRect();
    const r1 = items[1].getBoundingClientRect();
    step = Math.round(r1.left - r0.left);
  } else {
    step = Math.round(items[0].getBoundingClientRect().width);
  }

  if (idx > maxIndex) idx = maxIndex;

  applyTransform();

  if (nextBtn) nextBtn.style.opacity = maxIndex === 0 ? "0.4" : "1";
}

function applyTransform() {
  const offset = idx * step;
  listLatest.style.transform = `translateX(${-offset}px)`;
}

function onNextClick(e) {
  if (e && typeof e.preventDefault === "function") e.preventDefault();

  if (maxIndex === 0) return;

  idx += 1;

  // ВАРІАНТ 1: циклічно 
  if (idx > maxIndex) idx = 0;

  // if (idx > maxIndex) idx = maxIndex;

  applyTransform();
}

function initLatestSlider() {
  recalcSlider();

  if (!sliderBound && nextBtn) {
    nextBtn.addEventListener("click", onNextClick);
    sliderBound = true;
  }
}

window.addEventListener("resize", () => {
  clearTimeout(window.__latestResizeT);
  window.__latestResizeT = setTimeout(recalcSlider, 100);
});


initLatestSlider();




