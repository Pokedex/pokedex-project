document.addEventListener('DOMContentLoaded', () => {


  const pokedexdisplay = document.getElementById('pokedex-display');
  const pikachuload = document.getElementById('pikachu-load');
  const loadbox = document.getElementById('load-box');
  const capturedArr = document.getElementById('data-transport').innerText.split('-');
  let counter = 0;

  const loadGifArr = ['../images/charmander-load.gif', '../images/gengar-gif.gif', '../images/mew-load.gif', '../images/undertale-gif.gif', '../images/ash-pikachu.gif'];
  let randomIndex = (Math.floor(Math.random()*loadGifArr.length));
  const loadGif = document.createElement('img');
  loadGif.setAttribute('alt', 'Transition pokemon loading page image');
  loadGif.setAttribute('src', loadGifArr[randomIndex]);
  pikachuload.append(loadGif);

  

  setInterval(()=>{
    counter = 0;
    [...pokedexdisplay.children].forEach((item)=>{
          if(item.childNodes[0].complete){
          counter++;
        }
        if(counter===151){
          pikachuload.style.display = 'none';
          loadbox.style.display = 'block';
        }  
      });
  },100);
      
  axios.get(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=151`)
  .then((result)=>{
    result.data.results.forEach((pokemon, index)=>{
      const number = index + 1;
      const pokeImg = document.createElement('img');
      const pokeAnchor = document.createElement('a');

      if(capturedArr.includes(pokemon.name)){
        pokeImg.setAttribute('style', 'opacity: 1;');
      } else {
        pokeImg.setAttribute('style', 'opacity: .25;');
      }
      pokeImg.setAttribute('class', 'pokedex-pkmn');
      pokeAnchor.setAttribute('href', `/pokemon/${number}`);
      pokeImg.setAttribute('src', `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${number}.png`);
      pokeImg.setAttribute('alt', `${pokemon.name} image`);
      pokeAnchor.append(pokeImg);
      pokedexdisplay.append(pokeAnchor);
      
    });
    
  })
  .catch((err)=>{
    console.log(err);
  });

}, false);