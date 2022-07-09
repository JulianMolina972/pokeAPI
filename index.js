const BASE_API = 'https://pokeapi.co/api/v2';
const POKEMON_API = `${BASE_API}/pokemon`;
let currentPokemon;
let sprites = [];
let currentSprite = 0;
let listPokemons = "";


const fetchData = async (api) => {
  const res = await fetch(api);
  const data = await res.json();
  return data;
};

const writeDescription = async (api, node) => {
  const specie = await fetchData(api);
  
  node.textContent = specie.flavor_text_entries[0].flavor_text;
}

const printPokemon = async (pokemon) => {
  window.scrollTo(0, 0);
  const data = await fetchData(`${POKEMON_API}/${pokemon}`);
  (sprites.length > 0)
  ? sprites = []
  : null;
  currentPokemon = data;
  pokeName.textContent = data.name;
  pokeImg.src = data.sprites.front_default;
  [pokeHp, pokeAtk, pokeDef, pokeAtkSp, pokeDefSp, pokeSpd].map(
    (node, index) => {
      node.style.width = `${data.stats[index].base_stat/2}%`;
      node.textContent = data.stats[index].base_stat;
    }
  );
  
  writeDescription(data.species.url, pokeDesc);
  const pokeSprites = currentPokemon.sprites; 
    
  for (const key in pokeSprites) {
    if (typeof pokeSprites[key] === 'string') {
      sprites.push(pokeSprites[key]);
    }
    
  }
  return currentPokemon;
};

const printPokemons = async (api) => {
  const loader = document.createElement('li');
  loader.classList.add('loader');
  pokemonsList.append(loader);
  const pokemons = await fetchData(api);
  loader.remove();
  listPokemons = pokemons;
  pokemons.results.map(async (pokemon) => {
    const listItem = document.createElement('li');
    const details = await fetchData(pokemon.url);
    listItem.classList.add(details.types[0].type.name);
    listItem.innerHTML = `
    <img src="${details.sprites.front_default}" alt="${details.name}" />
    <div class="pokemon-card"> 
      <h3>${details.name}</h3>
      ${details.types.map(type => `<span>${type.type.name}</span>`)}
      <p id="${details.name}" class="pokemon-description"></p>
      <button  class="details-button" onclick=printPokemon(${details.id})>Show pokemon</button>
    </div>

    `;
    pokemonsList.appendChild(listItem);
    const detailsPok = document.querySelector(`#${details.name}`);
    writeDescription(details.species.url, detailsPok);
  });

}

const prevImg = () => {
  if(currentSprite === 0) {
    currentSprite = sprites.length - 1;
  }else {
    currentSprite--;
  }
  pokeImg.src = sprites[currentSprite];
}

const nextImg = () => {
  if(currentSprite === sprites.length - 1) {
    currentSprite = 0;
  }else {
    currentSprite++;
  }
  pokeImg.src = sprites[currentSprite];
}

const nextPokemon = () => {
  const next = currentPokemon.id + 1;
  printPokemon(next);
}

const prevPokemon = () => {
  currentPokemon.id === 1 
  ? currentPokemon.id = 300
  : null 
  const prev = currentPokemon.id - 1;
  printPokemon(prev);
}

const nextPokemons = async () => {
  pokemonsList.innerHTML = "";
  const newData = await fetchData(listPokemons.next);
  printPokemons(newData.next);
}

const prevPokemons = async () => {
  try {
    pokemonsList.innerHTML = "";
    
    if(listPokemons.previous === null) {
      const newData = await fetchData(listPokemons.next);
      printPokemons(newData.previous);
    } else {
      const newData = await fetchData(listPokemons.previous);      
      printPokemons(newData.previous);
    }
  } catch (error) {
    console.log(error);
  }
}

const searchPokemon = async () => {
  event.preventDefault();
  const input = event.target.search;
  const res = await fetchData(`${POKEMON_API}/${input.value}`);
  console.log(res);
  printPokemon(res.id);
};

printPokemon(1);
printPokemons(`${BASE_API}/pokemon?limit=15&offset=0`);