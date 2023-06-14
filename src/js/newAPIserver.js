import axios from "axios"




export default class imgAPIServer {
    #KEY_API = '37175835-76686085e99d052827f14fa60'
    #BASE_URL = 'https://pixabay.com/api/'

    constructor() {
        this.page = 1,
        this.searchValue = ''        

    }
    
    
    
    async getApi() {
        
        const options ={
            params: {
                image_type: 'photo',
                orientation: 'horizontal',
                q: this.searchValue,
                page: this.page,
                per_page: 40,
                key: this.#KEY_API,
                safesearch: true,
            },
        }
          
        const res = await axios.get(this.#BASE_URL, options);
        
        this.incrementPage();
        return res.data;      
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