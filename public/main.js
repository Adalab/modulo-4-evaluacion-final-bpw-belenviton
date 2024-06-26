'use strict';

//query selector

const iptName = document.querySelector('.ipt-name');
const iptIngredients = document.querySelector('.ipt-ingredients');
const iptInstructions = document.querySelector('.ipt-instructions');
const buttonAdd = document.querySelector('.button-add');
const cardName = document.querySelector('.card-name');
const cardIngredients = document.querySelector('.card-ingredients');
const cardInstructions = document.querySelector('.card-instructions');
const buttonChange = document.querySelector('.button-change');
const buttonDelete = document.querySelector('.button-delete');
const cardText = document.querySelector('.card-text');
const cardSection = document.querySelector('.second-section-main');

//variables

let recetas = {
  id: '',
  nombre: '',
  ingredientes: '',
  instrucciones: '',
};

const createCard = (recipe) => {
  cardSection.innerHTML += `
  <article class="card">
  <div class="card-text">
     <h2 class="card-name">${recipe.nombre}</h2>
     <p class="card-ingredients">${recipe.ingredientes}</p>
     <p class="card-instructions">${recipe.instrucciones}</p>
  </div>
  <div class="buttons">
     <button class="button-change">MODIFICAR</button>
     <button class="button-delete">ELIMINAR</button>
  </div>
</article>
  `;
};

const renderAllRecipes = () => {
  cardSection.innerHTML = '';
  for (const recipe of recetas) {
    createCard(recipe);
  }
};

const handleCreateRecipe = (event) => {
  const newName = iptName.value;
  const newIngredient = iptIngredients.value;
  const newInstructions = iptInstructions.value;

  fetch('//localhost:4000/api/recetas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nombre: newName,
      ingredientes: newIngredient,
      instrucciones: newInstructions,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.success) {
        const newId = recetas.id;
        const nuevaReceta = {
          id: newId,
          nombre: newName,
          ingredientes: newIngredient,
          instrucciones: newInstructions,
        };
        recetas.push(nuevaReceta);
        renderAllRecipes();
        console.log(nuevaReceta);
      }
    });
};
buttonAdd.addEventListener('click', handleCreateRecipe);
//AL CARGAR LA PÁGINA

fetch('//localhost:4000/api/recetas')
  .then((response) => response.json())
  .then((data) => {
    recetas = data.results;
    renderAllRecipes();
  });
