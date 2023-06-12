const KEY_API = '37175835-76686085e99d052827f14fa60'
const BASE_URL = 'https://pixabay.com/api/'
export default class imgAPIServer {
    constructor() {
        this.page = 1,
        this.searchValue = ''        

    }
    
    
    
    getApi() {
        const url = `${BASE_URL}/?key=${KEY_API}&per_page=10&q=${this.searchValue}&page=${this.page}`
       
          return fetch(url).then((r) => r.json()).then(data => {
            this.incrementPage()
            return data
          })
       
       }


       setSearchValue(query) {
        this.searchValue = query
       }
       incrementPage(){
        this.page += 1;

       }

       resetPage(){
        this.page = 1;

       }
}