import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ImagesApiService from './api';

const imageApiService = new ImagesApiService();
const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const button = document.querySelector('.load-more');
console.log(button);

form.addEventListener('submit', submit);
button.addEventListener('click', loadMore);

function submit() {}
function loadMore() {}
