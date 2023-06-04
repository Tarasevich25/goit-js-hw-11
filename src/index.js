import './css/main.css';
import { searchForm, gallery, btnAddLoad } from './js/const';
import { fetch } from './js/fetchFunc';
import {
  alertFound,
  alertEmptySearch,
  alertNoSuchImages,
  alertEndSearch,
} from './js/alert';
import { createCard } from './js/createCard';

// Описаний в документації
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';

let q = '';
let page = 1;
const perPage = 40;
const simpleLightbox = new SimpleLightbox('.gallery a')

searchForm.addEventListener('submit', onSearchForm);
btnAddLoad.addEventListener('click', onLoadMore);

function onSearchForm(e) {
  e.preventDefault();
  window.scrollTo({ top: 0 });
  page = 1;
  q = e.currentTarget.searchQuery.value.trim();
  gallery.innerHTML = '';
  btnAddLoad.classList.add('hidden');

  if (q === '') {
    alertEmptySearch();
    return;
  }

  fetch(q, page, perPage)
    .then(({ data }) => {
      if (data.totalHits === 0) {
        alertNoSuchImages();
      } else {
        createCard(data.hits);
        simpleLightbox.refresh();
        alertFound(data);

        if (data.totalHits > perPage) {
          btnAddLoad.classList.remove('hidden');
        }
      }
    })
    .catch(error => console.log(error))
    .finally(() => {
      searchForm.reset();
    });
}

function onLoadMore() {
  page += 1;

  fetch(q, page, perPage)
    .then(({ data }) => {
      createCard(data.hits);
      simpleLightbox.refresh();

      const pagesTotal = Math.ceil(data.totalHits / perPage);

      if (page > pagesTotal) {
        btnAddLoad.classList.add('is-hidden');
        alertEndSearch();
      }
    })
    .catch(error => console.log(error));
}