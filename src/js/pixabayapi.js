export {getApi};
const KEY_API = '37175835-76686085e99d052827f14fa60'
const BASE_URL = 'https://pixabay.com/api/'

function getApi(query) {

const url = `${BASE_URL}/?key=${KEY_API}&q=${query}`

fetch(url)
.then(r => r.json())
.then(console.log)

}


