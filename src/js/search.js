import axios from "axios"

const search = document.querySelector('.search')
const searchBtn = document.querySelector('.search-button')
const searchResult = document.querySelector('.search-result')
const pagenation = document.querySelector('.pagenation')
const preBtn = document.querySelector('.btn-prev')
const nextBtn = document.querySelector('.btn-next')
const currentPage = document.querySelector('.current-number')
const prePageNum = document.querySelector('.prev-number')
const nextPageNum = document.querySelector('.next-number')
const bookmarkTable = document.querySelector('.bookmark-table')
const bookmark_btn = document.querySelector('.fa-bounce')


export class Search {
    #keyword;
    #recipes;
    #pagenationNum = 1;

    constructor() {


        search.addEventListener('keydown', this._getkeywordFromSpace.bind(this))
        searchBtn.addEventListener('click', this._getkeywordFromSearchBtn.bind(this))
        nextBtn.addEventListener('click', this._nextPage.bind(this))
        preBtn.addEventListener('click', this._prevPage.bind(this))
        bookmark_btn.addEventListener('click', this._loading_bookmark)

        window.addEventListener('click', (e) => {

            if (e.target !== bookmark_btn && !bookmarkTable.classList.contains('hidden')) {
                bookmarkTable.classList.add('hidden');
                console.log('windows event is working')
            }
        });
        
       

        


        if (this.#pagenationNum === 1) preBtn.classList.add('hidden')



    }

    async _getDataFromSearch(keyword) {

        try {
            searchResult.innerText = ''
            const searchResponse = await axios.get(`https://forkify-api.herokuapp.com/api/v2/recipes?search=${keyword}&key=6c260ef7-f491-4235-a8e0-a670c446676f`)
            const { data } = searchResponse.data
            if (data.recipes.length === 0) throw new Error(`${keyword} Not Found`)
            this.#recipes = data.recipes
            this._pagenationReset()
            this._displayResult(this._getSearchResultPage(this.#pagenationNum)) /////worked previousy __> display was inside the _getsearchreasultPage function 
        }
        catch (err) {
            searchResult.innerText = err.message
        }
    }

    _getkeywordFromSpace(e) {
        this.#keyword = search.value



        if (e.key == ' ' || e.keyCode == 13) {

            this._getDataFromSearch(this.#keyword)
        }
    }

    _getkeywordFromSearchBtn() {
        this.#keyword = search.value
        this._getDataFromSearch(this.#keyword)
    }

    _displayResult(recipes) {
        recipes.forEach(n => this._createSearchhReasultElement(n))
        pagenation.classList.remove('hidden')
        this._checkingNextPagenation(this.#pagenationNum + 1)
        if (this.#pagenationNum == 1) preBtn.classList.add('hidden')
    }

    _createSearchhReasultElement(item) {
        const elementHash = document.createElement('a')
        elementHash.href = '#' + item.id
        const resultMain = document.createElement('div')
        resultMain.classList.add('results-main')
        const recipeImg = document.createElement('img')
        recipeImg.classList.add('results-recipeImg')
        recipeImg.src = item.image_url
        const recipeDetail = document.createElement('div')
        recipeDetail.classList.add('results-detail')
        const recipeName = document.createElement('h5')
        recipeName.classList.add('results-name')
        recipeName.innerText = item.title
        const recipePublisher = document.createElement('h6')
        recipePublisher.classList.add('results-publisher')
        recipePublisher.innerText = item.publisher

        searchResult.appendChild(elementHash)
        elementHash.appendChild(resultMain)
        resultMain.appendChild(recipeImg)
        resultMain.appendChild(recipeDetail)
        recipeDetail.appendChild(recipeName)
        recipeDetail.appendChild(recipePublisher)


    }
    ///extract 10 recipe as per pagination number
    _getSearchResultPage(page) {
        let start = (page - 1) * 7
        let end = page * 7
        let result = this.#recipes.slice(start, end)
        // this._displayResult(result)
        return result
    }


    //actiopn when next page button is clicked
    _nextPage() {
        console.log(this.#pagenationNum)
        searchResult.innerHTML = ''
        this.#pagenationNum += 1
        currentPage.innerText = this.#pagenationNum
        prePageNum.innerText = this.#pagenationNum - 1
        nextPageNum.innerText = this.#pagenationNum + 1
        preBtn.classList.remove('hidden')
        this._displayResult(this._getSearchResultPage(this.#pagenationNum))

    }

    _prevPage() {
        console.log(this.#pagenationNum)
        searchResult.innerHTML = ''
        this.#pagenationNum = this.#pagenationNum - 1
        currentPage.innerText = this.#pagenationNum
        prePageNum.innerText = this.#pagenationNum - 1
        nextPageNum.innerText = this.#pagenationNum + 1
        nextBtn.classList.remove('hidden');


        this._displayResult(this._getSearchResultPage(this.#pagenationNum))

    }

    //check if there is other item left for next pagenation and remove nect button if no data found
    _checkingNextPagenation(num) {
        let results = this._getSearchResultPage(num)
        if (results.length == 0) {
            nextBtn.classList.toggle('hidden');
        }
    }

    _pagenationReset() {
        this.#pagenationNum = 1
        currentPage.innerText = 1
        nextPageNum.innerText = 2
    }
    ///bookmark

    _loading_bookmark() {
      

       let bookmarkData = JSON.parse(window.sessionStorage.getItem('bookmarks'))
       

       bookmarkTable.classList.toggle('hidden')
       bookmarkTable.innerText=''
       if (bookmarkData === null) return
       
       bookmarkData.forEach(item=>{

        const elementHash = document.createElement('a')
        elementHash.href = '#' + item.id
        const resultMain = document.createElement('div')
        resultMain.classList.add('results-main')
        const recipeImg = document.createElement('img')
        recipeImg.classList.add('results-recipeImg')
        recipeImg.src = item.image_url
        const recipeDetail = document.createElement('div')
        recipeDetail.classList.add('results-detail')
        const recipeName = document.createElement('h5')
        recipeName.classList.add('results-name')
        recipeName.innerText = item.title
        const recipePublisher = document.createElement('h6')
        recipePublisher.classList.add('results-publisher')
        recipePublisher.innerText = item.publisher

        bookmarkTable.appendChild(elementHash)
        elementHash.appendChild(resultMain)
        resultMain.appendChild(recipeImg)
        resultMain.appendChild(recipeDetail)
        recipeDetail.appendChild(recipeName)
        recipeDetail.appendChild(recipePublisher)





       })

        


    }




}

////working on to align pagenarion and make it functional......





///se


