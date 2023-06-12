import Notiflix from 'notiflix';
// import { getApi } from './js/pixabayapi'
import  imgAPIServer from './js/newAPIserver'
import loadmoreBtn from './js/loadmoreBtn'



const refs = {
    form: document.getElementById('search-form'),
    gallery: document.querySelector('.gallery'),
    input: document.querySelector('.inp-search'),
    btn: document.querySelector('.custom-button')
}


const server   = new imgAPIServer()
const loadBtn = new loadmoreBtn({
    selector: '#loadmore',
    isHidden: true
})


refs.form.addEventListener('submit', onSubmit);
loadBtn.button.addEventListener('click', fetchArtical);

refs.input.addEventListener('click', dropBtn);

function dropBtn(){
    refs.btn.style.display = 'block'
}




function  fetchArtical(){
    loadBtn.disable()
   return generateMarkUp()
   .then((markup) =>{
        appendList(markup);
      loadBtn.enable();
    })
}




function onSubmit(event) {
    event.preventDefault();
    
    const inpValue = refs.form.elements.searchQuery.value.trim();

    if (inpValue === ''){
        onError()
        return;
    }
    clearList()

    server.setSearchValue(inpValue);
    loadBtn.show();
    server.resetPage();
    fetchArtical()
    .catch(onError)
    .finally(() => refs.form.reset());
    
}

function generateMarkUp() {
   return server.getApi()
    .then(({hits}) => {
        if (hits.length === 0){
            throw new Error ()
          
        }
        console.log(hits.length);
       return hits.reduce((markup, currentimg) => markup + createMarkUp(currentimg) ,'')
    })
}

function createMarkUp({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) {
    return `   
    <div class="card photo-card">
        <a href="${largeImageURL}" class="link-card">
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

function appendList(markup) {
    refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function clearList() {
    refs.gallery.innerHTML = '';
}

function onError(){
    Notiflix.Notify.failure('not found');
}