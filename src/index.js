import './js/search'
import { getApi } from './js/pixabayapi'


const refs = {
    form: document.querySelector('#search-form'),
    input: document.querySelector('input[type="text"]'),
    btn: document.querySelector('button[type="submit"]'),
}

console.log(refs.form, refs.btn, refs.input);


getApi('cat')


