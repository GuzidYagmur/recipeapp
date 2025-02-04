const foodMenus = document.querySelector(".foodMenu");
let recipes = [];


async function fetchRecipes() {
    try {
        foodMenus.innerHTML = `<i id="loading" class="fa-solid fa-spinner fa-spin"></i>`;

        const res = await fetch("https://dummyjson.com/recipes");
        if (!res.ok) {
            throw new Error("Veri alınırken hata oluştu");
        }
        foodMenus.innerHTML = "";
        const data = await res.json();
        const apiRecipes = data.recipes;

        const storedRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
        const allRecipes = [...apiRecipes, ...storedRecipes];

        renderRecipes(allRecipes); 
        return allRecipes;
    } catch (error) {
        foodMenus.innerHTML = "Bir Hata Oluştu :/";
        console.error(error);
    }
}


fetchRecipes();


function productTemplate({ id, name, image, caloriesPerServing, cookTimeMinutes }) {
    return `
        <div class="menu-content">
            <div class="img-head">
                <img src="${image}" alt="">
                <div class="food-head">
                    <h4>${name}</h4>
                   <button class="favorite-btn" data-id="${id}">
                        <i class="fa-regular fa-heart"></i>
                    </button>
                </div>
            </div>
            <div class="kcal-min">
                <div class="kcal">
                    <i class="fa-sharp fa-solid fa-fire"></i>
                    <p>${caloriesPerServing} Kcal  ·</p>
                </div>
                <div class="min">
                    <i class="fa-regular fa-clock"></i>
                    <p>${cookTimeMinutes} min</p>
                </div>
            </div>
        </div>
    `;
}


const foods = document.querySelectorAll(".foods");

foods.forEach(food => {
    food.addEventListener("click", async (event) => {
        const category = event.currentTarget.querySelector("h4").textContent.toLowerCase();

        try {
            const res = await fetch("https://dummyjson.com/recipes");
            if (!res.ok) {
                throw new Error("Veri alınamadı");
            }
            const data = await res.json();

            const filteredRecipes = data.recipes.filter(recipe =>
                recipe.mealType.some(type => type.toLowerCase() === category)
            );

            localStorage.setItem("filteredRecipes", JSON.stringify(filteredRecipes));
            localStorage.setItem("selectedCategory", category);

            window.location.href = "./recipeofcategory.html";
        } catch (error) {
            console.error("Tarifleri çekerken hata oluştu:", error);
        }
    });
});


if (window.location.pathname.includes("recipeofcategory.html")) {
    const recipeList = document.getElementById("recipe-list");
    const categoryTitle = document.getElementById("category-title");

    const recipes = JSON.parse(localStorage.getItem("filteredRecipes")) || [];
    const selectedCategory = localStorage.getItem("selectedCategory") || "Recipes";

    categoryTitle.textContent = selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) + " Recipes";

    recipeList.innerHTML = recipes.map(recipe => `
        <div class="category-container">
        <div class="content-cat">
            <div class="cat-head">
            <img src="${recipe.image}" alt="${recipe.name}" />
                <h3>${recipe.name}</h3>
            </div>
                <p><strong>Category:</strong> ${recipe.mealType.join(", ")}</p>
                <p><strong>Ingredients:</strong> ${recipe.ingredients.join(", ")}</p>
                <p><strong>Instructions:</strong> ${recipe.instructions}</p>
            </div>
        </div>
    `).join("");
}


function toggleFavorite(recipe) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    const isFavorite = favorites.some(fav => fav.id === recipe.id);

    if (isFavorite) {
        favorites = favorites.filter(fav => fav.id !== recipe.id);
    } else {
        favorites.push(recipe);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    updateFavoriteIcons();
}


function updateFavoriteIcons() {
    const favoriteBtns = document.querySelectorAll(".favorite-btn");
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    favoriteBtns.forEach(btn => {
        const recipeId = btn.getAttribute("data-id");
        const isFavorite = favorites.some(fav => fav.id === recipeId);

        if (isFavorite) {
            btn.innerHTML = `<i class="fa-solid fa-heart"></i>`; 
        } else {
            btn.innerHTML = `<i class="fa-regular fa-heart"></i>`; 
        }
    });
}


function renderRecipes(recipes) {
    const foodMenus = document.querySelector(".foodMenu");

    foodMenus.innerHTML = ""; 

    recipes.forEach(recipe => {
        const template = productTemplate(recipe);
        foodMenus.innerHTML += template;
    });

    
    const favoriteBtns = document.querySelectorAll(".favorite-btn");
    favoriteBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const recipeId = e.currentTarget.getAttribute("data-id");
            const recipe = recipes.find(r => r.id == recipeId);
            toggleFavorite(recipe); 
        });
    });

    
    updateFavoriteIcons();
}


if (window.location.pathname.includes("favorites.html")) {
    updateFavoriteIcons();
    const favoritesList = document.getElementById("favorites-list");
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    favorites.forEach(recipe => {
        favoritesList.innerHTML += `
            <div class="fav-container">
                <div class="favcontent">
                    <div class="favimg-head">
                        <img src="${recipe.image}" alt="${recipe.name}" />
                        <h3>${recipe.name}</h3>
                        <button class="favorite-btn" data-id="${recipe.id}">
                            <i class="fa-regular fa-heart"></i> 
                        </button>
                    </div>
                    <p><strong>Category:</strong> ${recipe.mealType ? recipe.mealType.join(", ") : "N/A"}</p>
                    <p><strong>Ingredients:</strong> ${recipe.ingredients ? recipe.ingredients.join(", ") : "N/A"}</p>
                    <p><strong>Instructions:</strong> ${recipe.instructions || "N/A"}</p>
                </div>
            </div>
        `;
    });

    
    const favoriteBtns = document.querySelectorAll(".favorite-btn");
    favoriteBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const recipeId = e.currentTarget.getAttribute("data-id");
            const recipe = favorites.find(r => r.id == recipeId);
            toggleFavorite(recipe); 
            window.location.reload(); 
        });
    });
}


//***************************** */


newTaskForm.addEventListener("submit", function(e){
    e.preventDefault();
    const formObj = Object.fromEntries(new FormData(e.target));
    let newId = 1;

    const storedRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
    if (storedRecipes.length > 0) {
        newId = storedRecipes[storedRecipes.length - 1].id + 1;
    }

    const newTask = {
        id: newId,
        name: formObj.name,
        caloriesPerServing: formObj.caloriesperserving,
        cookTimeMinutes: formObj.cooktime,
        
    };

    storedRecipes.push(newTask);
    localStorage.recipes = JSON.stringify(storedRecipes);

    e.target.reset();
    fetchRecipes();
    renderRecipes();
})

console.log(recipes);
