// UI
const btnMore = document.querySelector('.btn__more');
const inputSearch = document.querySelector('.header__search');
const loader = document.querySelector('.loader');

let pageNumber = 1;

function customHttp() {
  return {
    get(url, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.addEventListener('load', () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener('error', () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        xhr.send();
      } catch (error) {
        cb(error);
      }
    },
    post(url, body, headers, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.addEventListener('load', () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener('error', () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        if (headers) {
          Object.entries(headers).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value);
          });
        }

        xhr.send(JSON.stringify(body));
      } catch (error) {
        cb(error);
      }
    },
  };
};

const http = customHttp();


document.addEventListener('DOMContentLoaded', function() {
	loadCharacter();
});

const rickAndMortyService = (function() {
  const apiUrl = 'https://rickandmortyapi.com/api';

  return {
    topHeadlines(cb, page = 1) {
      http.get(`${apiUrl}/character/?page=${page}`, cb);
		},
		search(search, cb) {
      http.get(`${apiUrl}/character/?name=${search}`, cb);
		},
		getPage(page, cb) {
      http.get(`${apiUrl}/character/?page=${page}`, cb);
		}
	}
})();

inputSearch.addEventListener('input', function() {
	loadCharacter();
});

function loadCharacter() {
	showLoader();
	const searchText = inputSearch.value;
	if (searchText) {
		rickAndMortyService.search(searchText, onGetResponse)
	} else {
		rickAndMortyService.topHeadlines(onGetResponse)
	}
};

function onGetResponse(err, res) {
	removeLoader();

	if (err) {
		showAlert(err);
		return;
	}

	if(!res.results.length) {
		showAlert('Ничего не найдено');
		return;
	}

	renderCharacter(res.results);
};

function renderCharacter(characters) {
	const contentContainer = document.querySelector('.content-container');
	if(contentContainer.children.length) {
		clearContainer(contentContainer);
	}
	let fragment = '';

	characters.forEach(characterItem => {
		const el = characterTemplate(characterItem);
		fragment += el;
	});
	contentContainer.insertAdjacentHTML('beforeend', fragment);
};


function characterTemplate({ name, image, status, species, gender }) {
	return `
		<div class="character">
			<img src="${image}" class="character__img">
			<div class="character__content">
				<div class="character__desc-block">
					<span class="character__desc">Name:</span>
					<span class="character__desk-value character__desk-value--title">${name || ''}</span>
				</div>
			<div class="character__desc-block">
				<span class="character__desc">Status:</span>
				<span class="character__desk-value character__desk-value--status">${status || ''}</span>
			</div>
			<div class="character__desc-block">
				<span class="character__desc">Species:</span>
				<span class="character__desk-value character__desk-value--species">${species || ''}</span>
			</div>
			<div class="character__desc-block">
				<span class="character__desc">Gender:</span>
				<span class="character__desk-value character__desk-value--gender">${gender || ''}</span>
			</div>
			<a href="https://www.google.com/search?q=Rick and morty ${name}" target="_blank">Read more</a>
			</div>
		</div>`;
};

btnMore.addEventListener('click', function() {
	const searchText = inputSearch.value;
	rickAndMortyService.topHeadlines(onGetResponse, ++pageNumber);
});

function showAlert(msg, type='error') {
	const alertContainer = document.querySelector('.alert');
	alertContainer.textContent = msg;
	alertContainer.style.display = 'block';
};

function clearContainer(container) {
	let child = container.lastElementChild;
	while (child) {
		container.removeChild(child);
		child = container.lastElementChild;
	}
};

function showLoader() {
	loader.classList.add('loader--show');
};

function removeLoader() {
	if(loader.classList.contains('loader--show')) {
		loader.classList.remove('loader--show');
	}
}