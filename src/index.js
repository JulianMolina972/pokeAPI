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
  const data = await fetchData(`${POKEMON_API}/${pokemon}`);
  (sprites.length > 0)
  ? sprites = []
  : null;
  currentPokemon = data;
  pokeImg.src = data.sprites.front_default;
  // pokeDesc.textContent = data.name;
  const iteratePokemon = data.stats.map(stat => {return stat.base_stat});
    pokeHp.textContent = iteratePokemon[0];
    pokeHp.style.width = `${iteratePokemon[0]}%`;
    pokeAtk.textContent = iteratePokemon[1];
    pokeAtk.style.width = `${iteratePokemon[1]}%`;
    pokeDef.textContent = iteratePokemon[2];
    pokeDef.style.width = `${iteratePokemon[2]}%`;
    pokeAtkSp.textContent = iteratePokemon[3];
    pokeAtkSp.style.width = `${iteratePokemon[3]}%`;
    pokeDefSp.textContent = iteratePokemon[4];
    pokeDefSp.style.width = `${iteratePokemon[4]}%`;
    pokeSpd.textContent = iteratePokemon[5];
    pokeSpd.style.width = `${iteratePokemon[5]}%`;
    writeDescription(data.species.url, pokeDesc);
    const pokeSprites = currentPokemon.sprites; 
    
  for (let key in pokeSprites) {
    if (typeof pokeSprites[key] === 'string') {
      sprites.push(pokeSprites[key]);
    }
    
  }

  return currentPokemon;
};

const printPokemons = async (api) => {
  const pokemons = await fetchData(api);
  listPokemons = pokemons;
  pokemons.results.map(async (pokemon) => {
    const listItem = document.createElement('li');
    const details = await fetchData(pokemon.url);
    listItem.innerHTML = `
    <img src="${details.sprites.front_default}" alt="${details.name}" />
    <div class="pokemon-card"> 
      <h3>${details.name}</h3>
      ${details.types.map(type => `<span>${type.type.name}</span>`)}
      <p id="${details.name}"></p>
      <button onclick=printPokemon(${details.id})>Show pokemon</button>
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
  ? currentPokemon.id = 151
  : null 
  const prev = currentPokemon.id - 1;
  printPokemon(prev);
}

const nextPokemons = async () => {
  const newData = await fetchData(listPokemons.next);
  printPokemons(newData.next);
}

const prevPokemons = async () => {
  const newData = await fetchData(listPokemons.previous);
  printPokemons(newData.previous);
}


printPokemon(1);
printPokemons(`${BASE_API}/pokemon?limit=15&offset=0`);