import Notiflix from 'notiflix';
// import { getApi } from './js/pixabayapi'
import  imgAPIServer from './js/newAPIserver'




const refs = {
    form: document.getElementById('search-form'),
    gallery: document.querySelector('.gallery')
}

const server   = new imgAPIServer()

refs.form.addEventListener('submit', onSubmit);

function onSubmit(event) {
    event.preventDefault();
    const inpValue = refs.form.elements.searchQuery.value.trim();

    if (inpValue === ''){
        onError()
        return;
    }
    server.setSearchValue(inpValue);
    server.getApi().then(({hits}) => {
        if (hits.length === 0){
            throw new Error ()
          
        }
        console.log(hits.length);
       return hits.reduce((markup, currentimg) => markup + createMarkUp(currentimg) ,'')
    }).then((markup) => updateList(markup))
    .catch(onError)
    
    .finally(() => refs.form.reset());
    
}


function createMarkUp({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) {
    return `   
    <div class="photo-card">
        <a href="${largeImageURL}">
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
  
  `   
};

function updateList(markup) {
    refs.gallery.innerHTML = markup
}


function onError(){
    Notiflix.Notify.failure('not found');
}