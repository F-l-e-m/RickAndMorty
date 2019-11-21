// UI
const btnPrev = document.querySelector('.btn__prev');
const btnNext = document.querySelector('.btn__next');
const inputSearch = document.querySelector('.js-input-search');
const loader = document.querySelector('.js-loader');

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
    console.log(res);
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
		<div class="character mx-auto flex flex-col bg-gray-800 shadow-md mb-16">
			<img src="${image}" class="w-full">
            <div class="p-4 flex flex-col text-gray-500">
                <h1 class="font-bold text-xl mb-2">${name || ''}</h1>
			    <div class="character__desc-block">
				    <span class="character__desc">Status:</span>
				    <span class="character__desk-value character__desk-value--status text-teal-400 ml-2">${status || ''}</span>
			    </div>
			    <div class="character__desc-block">
				    <span class="character__desc">Species:</span>
				    <span class="character__desk-value character__desk-value--species text-teal-400 ml-2">${species || ''}</span>
			    </div>
			    <div class="character__desc-block">
				    <span class="character__desc">Gender:</span>
				    <span class="character__desk-value character__desk-value--gender text-teal-400 ml-2">${gender || ''}</span>
			    </div>
			    <a href="https://www.google.com/search?q=Rick and morty ${name}" target="_blank" class="text-orange-600">Read more</a>
			</div>
		</div>`;
};

btnPrev.addEventListener('click', function() {
    if(pageNumber <= 1) {
        return;
    }
	rickAndMortyService.topHeadlines(onGetResponse, --pageNumber);
});

btnNext.addEventListener('click', function() {
    if(pageNumber >= 20) {
        return;
    }
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
	loader.classList.add('js-loader--show');
};

function removeLoader() {
	if(loader.classList.contains('js-loader--show')) {
		loader.classList.remove('js-loader--show');
	}
}