const BASE_API = 'https://pokeapi.co/api/v2';
const POKEMON_API = `${BASE_API}/pokemon`;
let currentPokemon;


const fetchData = async (api) => {
  const res = await fetch(api);
  const data = await res.json();
  return data;
}

const printPokemon = async (pokemon) => {
  const data = await fetchData(`${POKEMON_API}/${pokemon}`);
  console.log(data);
  currentPokemon = data;
  pokeImg.src = data.sprites.front_default;
  pokeDesc.textContent = data.name;
  const iteratePokemon = data.stats.map(stat => {return stat.base_stat});
  // for (item of iteratePokemon) {
  //   return item;
  // }
  // console.log(iteratePokemon);
  pokeHp.textContent = iteratePokemon[0];
  pokeAtk.textContent = iteratePokemon[1];
  pokeDef.textContent = iteratePokemon[2];
  pokeAtkSp.textContent = iteratePokemon[3];
  pokeDefSp.textContent = iteratePokemon[4];
  pokeSpd.textContent = iteratePokemon[5];
  return currentPokemon;
};

const prevImg = () => {
  pokeImg.src = currentPokemon.sprites.front_default;
}

const nextImg = () => {
  pokeImg.src = currentPokemon.sprites.back_default;
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


printPokemon(1);