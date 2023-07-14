import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

//api.js
class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
  }

  fetchPixabay() {
    const API_KEY = '38190446-4bb1c0206a67f58024ebd8e6f';
    const BASE_URL = 'https://pixabay.com/api/';
    return fetch(
      `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation="horizontal"&safesearch=true&page=${this.page}&per_page=${this.per_page}`
    )
      .then(res => {
        if (!res.ok) {
          throw new Error(
            'Sorry, there are no images matching your search. Please try again.'
          );
        }
        return res.json();
      })
      .then(data => {
        this.nextPage();
        return data;
      });
  }

  nextPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}

// index.js

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const button = document.querySelector('.load-more');
let lastSearchQuery = '';
const imageApiService = new ImagesApiService();

form.addEventListener('submit', submit);
button.addEventListener('click', loadMore);

function submit(e) {
  e.preventDefault();
  button.classList.add('is-hidden');
  gallery.innerHTML = '';
  imageApiService.query = e.currentTarget.elements.searchQuery.value.trim();
  imageApiService.resetPage();
  if (imageApiService.query === '') {
    Notify.info('Please enter your search query!');
    return;
  } else {
    imageApiService
      .fetchPixabay()
      .then(data => {
        let queriesArray = data.hits;
        if (queriesArray.length === 0) {
          Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        } else if (queriesArray.length < 40) {
          renderImages(queriesArray);
          button.classList.add('is-hidden');
          Notify.success(`Hooray! We found ${data.totalHits} images.`);
        } else {
          renderImages(queriesArray);
          Notify.success(`Hooray! We found ${data.totalHits} images.`);
          button.classList.remove('is-hidden');
          galleryLightbox.refresh();
        }
      })
      .catch(error => {
        Notify.info(
          "We're sorry, but you've reached the end of search results."
        );

        console.log(error);
      });
  }
}

function loadMore() {
  imageApiService.fetchPixabay().then(data => {
    let queriesArray = data.hits;
    renderImages(queriesArray);
    if (queriesArray.length < 40) {
      button.classList.add('is-hidden');
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
  });
}
function renderImages(queriesArray) {
  const markup = queriesArray
    .map(item => {
      return `<div class="photo-card">
  <div class="card"><img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" /></div>
  <div class="info">
    <p class="info-item">
      <b>Likes</b><span>${item.likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b><span>${item.views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b><span>${item.comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b><span>${item.downloads}</span>
    </p>
  </div>
</div>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}

const galleryLightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});
