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
    try{
    const markup = await generateMarkUp() 
    if(markup === undefined) {
      
    }
    
    appendList(markup);

    } catch(err) {
        onError(err);
    }
    loadBtn.enable();
    
}




function onSubmit(event) {
    event.preventDefault();
    clearList()
    const inpValue = refs.form.elements.searchQuery.value.trim();

    if (inpValue === ''){
        Notiflix.Report.failure("Empty search", "Please put your request");
        return;
    } 
    

    server.setSearchValue(inpValue);
    
    server.resetPage();
    

    fetchArtical()
    .catch(onError)
    .finally(() => refs.form.reset());
    
}

async function generateMarkUp() {
    
    try {

        const {hits, totalHits} = await server.getApi()

        
        console.log(totalHits);
        console.log(server.perPage);
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`)
        if (totalHits > server.perPage) {
            window.addEventListener('scroll', handleScroll);
            
            function handleScroll(){
                    

                    const {clientHeight, scrollTop, scrollHeight} = document.documentElement
                if (scrollTop + clientHeight >= scrollHeight - 5) {
                    fetchArtical() 
       
                }
            }
        } else if(totalHits > 0){
            
            Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
               
        }
            
        
            
        
        
        if(hits.length === 0){
            // clearList();
        }
            
        
        return hits.reduce((markup, currentimg) => markup + createMarkUp(currentimg) ,'')

    } catch(err){

        onError(err)
    }
        
    
        // if (isFirstLoad){
        //     Notiflix.Notify.success(`found the ${totalHits} pictures`)
        //     isFirstLoad = false;
        // }

        const nextPage = server.page;
        const maxPage = Math.ceil(totalHits / 40 )
        console.log(maxPage, nextPage);
        loadBtn.show()
        if(nextPage > maxPage) {
            
            
            loadBtn.hide();
            
        }    
        
      


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
    clearList()
    loadBtn.hide();
    Notiflix.Report.failure("Bad Request",
        'Sorry, there are no images matching your search query. Please try again.',
        
    );
    clearList()
    appendList()

    // Notiflix.Loading.remove();
    
}


// !========Scrol==========

// window.addEventListener('scroll', handleScroll);

// function handleScroll(){
    

//     const {clientHeight, scrollTop, scrollHeight} = document.documentElement
//     if (scrollTop + clientHeight >= scrollHeight - 5) {
//        fetchArtical() 
       
//     }
    

// }