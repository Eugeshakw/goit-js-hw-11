export default class loadMoreBtn {

    constructor({ selector, isHidden = false }) {
        this.button = document.querySelector(selector)
        // if(isHidden) this.hide();
        isHidden && this.hide();
        
    }

    enable() {
        this.button.disabled = false
        this.button.textContent = 'loadMore'

    }

    disable() {
        this.button.disabled = true
        this.button.textContent = 'loading...'
    }

    show(){
        this.button.classList.remove('hidden')
    }

    hide(){
        this.button.classList.add('hidden')
    }
} 

