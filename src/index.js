import Notiflix from 'notiflix';
// import { getApi } from './js/pixabayapi'
import  imgAPIServer from './js/newAPIserver'
import loadmoreBtn from './js/loadmoreBtn'

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const lightbox = new SimpleLightbox(".gallery .link-card", {
        delay: 500,
        captions: true,
});

let isFirstLoad = true;
const refs = {
    form: document.getElementById('search-form'),
    gallery: document.querySelector('.gallery'),
    input: document.querySelector('.inp-search'),
    btn: document.querySelector('.custom-button'),
    lightbox: document.querySelector('.lightbox')
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




async function  fetchArtical(){
    
    loadBtn.disable() 
    try {
        

    const markup = await generateMarkUp() 
    appendList(markup);
   if (markup === undefined){
    
    onError()
}
    } catch(err){
        onError(err)
    }
    loadBtn.enable();
   
    

//    return generateMarkUp()
//    .then((markup) =>{
//         appendList(markup);
//       loadBtn.enable();
//     })

   
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
    
    server.resetPage();
    
    fetchArtical()
    .catch(onError)
    .finally(() => refs.form.reset());
    
}

async function generateMarkUp() {
    
    try{
        const {hits, totalHits} = await server.getApi()
        // Notiflix.Notify.success(`found the ${totalHits} pictures`)

        if (isFirstLoad){
            Notiflix.Notify.success(`found the ${totalHits} pictures`)
            isFirstLoad = false;
        }

        const nextPage = server.page;
        const maxPage = Math.ceil(totalHits / 40 )
        console.log(maxPage, nextPage);
        loadBtn.show()
        if(nextPage > maxPage){
            Notiflix.Notify.info(`Were sorry, but you've reached the end of search results`)
            loadBtn.hide();
            Notiflix.Report.info(
                'End',
                "We're sorry, but you've reached the end of search results.",
                'Okay',
                );
            
        }
        if (hits.length === 0) throw new Error ()




return hits.reduce((markup, currentimg) => markup + createMarkUp(currentimg) ,'')
    
} catch(err) {
    clearList()
    onError(err)
}



//    return server.getApi()
//     .then(({hits}) => {
//         if (hits.length === 0){
//             throw new Error ()
          
//         }
//         Notiflix.Notify.success(`found the pictures`)
//         console.log(hits.length);
//        return hits.reduce((markup, currentimg) => markup + createMarkUp(currentimg) ,'')
//     })
}

function createMarkUp({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) {
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
  
  `   
};

function appendList(markup) {
    
    refs.gallery.insertAdjacentHTML('beforeend', markup);
    lightbox.refresh();
}

function clearList() {
    refs.gallery.innerHTML = '';
}

function onError(){
    clearList();
    loadBtn.hide();
    // Notiflix.Report.failure(
    //     'Not Found',
    //     'Sorry, there are no images matching your search query. Please try again.'
    // );
    Notiflix.Loading.remove();
    
}


// !========Scrol==========

window.addEventListener('scroll', handleScroll);

function handleScroll(e){
    

    const {clientHeight, scrollTop, scrollHeight} = document.documentElement
    if (scrollTop + clientHeight >= scrollHeight - 5) {
        fetchArtical()
    } 
    

}