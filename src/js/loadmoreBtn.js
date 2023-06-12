import Notiflix from 'notiflix';

export default class loadmoreBtn {

    constructor({ selector, isHidden = false }) {
        this.button = document.querySelector(selector)
        // if(isHidden) this.hide();
        isHidden && this.hide();
        
    }

    enable() {
        this.button.disabled = false
        this.button.textContent = 'loadMore'
        Notiflix.Loading.remove();
    }

    disable() {
        this.button.disabled = true
        Notiflix.Loading.pulse();
    }

    show(){
        this.button.classList.remove('hidden')
    }

    hide(){
        this.button.classList.add('hidden')
    }
} 

