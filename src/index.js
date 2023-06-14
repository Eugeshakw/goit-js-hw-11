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
    
    if(markup === undefined){
        throw new Error('No markup')
    }
    
    appendList(markup);

    } catch(err) {
        onError(err);
        
    }
    loadBtn.enable();
    
}




function onSubmit(event) {
    event.preventDefault();
    submitNotificationShown = false;
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

    let submitNotificationShown = false;

async function generateMarkUp() {
    
    try {
        
        const {hits, totalHits} = await server.getApi()

        // const nextPage = server.page;
        // console.log(nextPage);
        // const maxPage = Math.ceil(totalHits / 40);
        // console.log(maxPage);
        // loadBtn.show()
       
        
        

        // if(nextPage > maxPage) {
          
        //     Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        //     loadBtn.hide();
            
        // }


        if (totalHits > 0 && !submitNotificationShown) {
            Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
            submitNotificationShown = true;
        }

        if(hits.length === 0) throw new Error();
            // Notiflix.Notify.remove('success-notiflix')
        
        
        // console.log(totalHits);
        // console.log(server.perPage);


       
       
        
        if (totalHits > server.perPage) {
            window.addEventListener('scroll', handleScroll);
            
            let shouldScroll = false;

            function handleScroll() {
            const { clientHeight, scrollTop, scrollHeight } = document.documentElement;

            if (shouldScroll && scrollTop + clientHeight >= scrollHeight - 5) {
                const { height: cardHeight } = document
                .querySelector(".gallery")
                .firstElementChild.getBoundingClientRect();
                
                window.scrollBy({
                top: cardHeight * 2,
                behavior: "smooth",
                });
                // onSubmit()
                // fetchArtical();
                shouldScroll = false;
            } else {
                shouldScroll = true;
            }
            }
        } 
        const nextPage = server.page;
        console.log(nextPage);
        const maxPage = Math.ceil(totalHits / 40);
        console.log(maxPage);
        loadBtn.show()
       
        
        

        if(nextPage > maxPage) {
          
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
            loadBtn.hide();
            
        }

        return hits.reduce((markup, currentimg) => markup + createMarkUp(currentimg) ,'')
       
    } catch(err){
        
        onError(err)
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
    // clearList()
    loadBtn.hide();
    Notiflix.Report.failure("Bad Request",
        'Sorry, there are no images matching your search query. Please try again.',
        
    );
    // clearList()
    // appendList()

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