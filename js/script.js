const list = document.querySelector('.pokemon__list');
const nextBtn = document.querySelector('#next-page');
const prevBtn = document.querySelector('#prev-page');
const result = document.querySelector('.pokemon__result');
const imageDiv = document.querySelector('.pokemon__image');
const infoDiv = document.querySelector('.pokemon__info');
const loader = document.querySelector('#preloader');
const pokemonLinks = document.getElementsByClassName('pokemon__link');
const pokemonId = document.getElementsByTagName('span');
let counter = 0;

const request = async (url) => {
	const response = await fetch(url);
	if (!response.ok) {
		loader.style.display = 'none';
		alert('No information about this Pokemon!')
		throw Error('Request error' + response.status);
	};
	return await response.json();
}

const addFn = (firstParent, secondParent, value) => {
	firstParent.append(value);
	secondParent.append(firstParent);
}

const createStat = (tagname, classname, value) => {
	const tag = document.createElement(tagname);
	tag.classList.add(classname);
	infoDiv.append(tag);
	addFn(tag, infoDiv, value);
}

const mainInfo = async (url) => {
	const menu = await request(url);
	const pokemons = menu.results;
	pokemons.forEach(pokemon => {
		counter++;
		const link = document.createElement('p');
		const span = document.createElement('span');
		link.classList.add('pokemon__link');
		span.setAttribute('id', 'pokemon__number');
		addFn(span, link, counter);
		addFn(link, list, `. ${pokemon.name}`);
	});
	showInfo();
}

const showInfo = async () => {
	for (let i = 0; i < pokemonLinks.length; i++) {
		const info = await request(`https://pokeapi.co/api/v2/pokemon/${pokemonId[i].textContent}/`);
		pokemonLinks[i].addEventListener('click', async function () {
			outputInfo(info);
		})
	}
}

const outputInfo = (link) => {
	loader.style.display = 'block';
	infoDiv.innerHTML = '';
	imageDiv.innerHTML = '';
	result.style.display = 'flex';
	createStat('p', 'pokemon__stat', `Name: ${link.name}`);
	createStat('p', 'pokemon__stat', `Height: ${link.height}`);
	createStat('p', 'pokemon__stat', `Weight: ${link.weight}`);
	let types = '';
	if (link.types.length > 0) {
		for (let i = 0; i < link.types.length; i++) {
			types += `${link.types[i].type.name} `
		}
		createStat('p', 'pokemon__stat', `Type: ${types}`);
	}
	else if (link.types.length = 0) {
		createStat('p', 'pokemon__stat', `Type: no type`);
	}
	const image = document.createElement('img');
	image.classList.add('pokemon__pic');
	imageDiv.append(image);
	image.setAttribute('src', link.sprites.other["official-artwork"].front_default);
	loader.style.display = 'none';
}

mainInfo(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=20`);
nextBtn.addEventListener('click', (e) => {
	e.preventDefault();
	if (counter === 1281) {
		alert('You are on the last page!');
	}
	else {
		list.innerHTML = '';
		mainInfo(`https://pokeapi.co/api/v2/pokemon?offset=${counter}&limit=20`)
	}
})

prevBtn.addEventListener('click', (e) => {
	e.preventDefault();
	if (counter < 21) {
		alert('You are on the first page!');
	}
	else {
		counter = counter - 40;
		list.innerHTML = '';
		mainInfo(`https://pokeapi.co/api/v2/pokemon?offset=${counter}&limit=20`)
	}
})