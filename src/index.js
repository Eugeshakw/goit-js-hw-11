import Notiflix from 'notiflix';
import imgAPIServer from './js/newAPIserver';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const lightbox = new SimpleLightbox('.gallery .link-card', {
  delay: 500,
  captions: true,
});
let onSearch = false;
let submitNotificationShown = false;
const refs = {
  form: document.getElementById('search-form'),
  gallery: document.querySelector('.gallery'),
  input: document.querySelector('.inp-search'),
  btn: document.querySelector('.custom-button'),
  lightbox: document.querySelector('.lightbox'),
};
const server = new imgAPIServer();
const observer = new IntersectionObserver(
  (entries, observer) => {
    if (entries[0].isIntersecting && onSearch) {
      fetchArtical();
    }
  },
  {
    root: null,
    rootMargin: '600px',
    threshold: 1,
  }
);
refs.form.addEventListener('submit', onSubmit);
refs.input.addEventListener('click', dropBtn);
function dropBtn() {
  refs.btn.style.display = 'block';
}
async function fetchArtical() {
  try {
    const markup = await generateMarkUp();
    appendList(markup);
  } catch (err) {
    onError(err);
  }
}
function onSubmit(event) {
  event.preventDefault();
  submitNotificationShown = false;
  clearList();
  Notiflix.Loading.pulse();
  const inpValue = refs.form.elements.searchQuery.value.trim();
  if (inpValue === "") {
    Notiflix.Report.failure("Empty search", "Please put your request");
    Notiflix.Loading.remove();
    return;
  }
  server.setSearchValue(inpValue);
  server.resetPage();
  fetchArtical()
    .catch(onError)
    .finally(() => {
      refs.form.reset();
      onSearch = true;
    });
  observer.observe(document.querySelector('.target-element'));
  onSearch = false;
}
async function generateMarkUp() {
    Notiflix.Loading.pulse();
  try {
    const { hits, totalHits } = await server.getApi();
    Notiflix.Loading.remove();
    if (totalHits > 0 && !submitNotificationShown) {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      submitNotificationShown = true;
    }
    const nextPage = server.page - 1;
    const maxPage = Math.ceil(totalHits / 40);
    if (nextPage === maxPage && onSearch) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      observer.unobserve(document.querySelector('.target-element'));
    }
    if (totalHits < server.perPage) {
      observer.unobserve(document.querySelector('.target-element'));
    }
    return hits.reduce(
      (markup, currentimg) => markup + createMarkUp(currentimg),
      ""
    );
  } catch (err) {
    onError(err);
  }
}
function createMarkUp({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `
    <div class="card photo-card">
        <a href="${largeImageURL}" class="link-card" class="lightbox">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" width="300px" heigth="200px"/>
        </a>
         <div class="info">
            <p class="info-item">
            <b>Likes:</br>${likes}</b>
            </p>
            <p class="info-item">
            <b>Views:</br>${views}</b>
            </p>
            <p class="info-item">
            <b>Comments:</br>${comments}</b>
            </p>
            <p class="info-item">
            <b>Downloads:</br>${downloads}</b>
            </p>
        </div>
    </div>
  `;
}
function appendList(markup) {
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
function clearList() {
  refs.gallery.innerHTML = "";
}
function onError() {
  Notiflix.Report.failure(
    "Bad Request",
    "Sorry, there are no images matching your search query. Please try again."
  );
  Notiflix.Loading.remove();
}