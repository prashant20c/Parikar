import { concat } from "mathjs"


const inputEle = document.querySelectorAll('input')
const formContainer = document.querySelector('.form-container')
const addRecipeBtn = document.querySelector('.addRecipe-btn')
const dialog = document.querySelector('.dialog')
const closeBtn = document.querySelector('.fa-xmark')
const title = document.querySelector('.addRecipe-title')
const recipeURL = document.querySelector('.addRecipe-url')
const publisher = document.querySelector('.addRecipe-publisher')
const imageURL = document.querySelector('.addRecipe-image')
const time = document.querySelector('.addRecipe-time')
const serving = document.querySelector('.addRecipe-serving')
const ingsContainer = document.querySelector('.ingredients-data')
let ingredientsEle = document.querySelectorAll('.ingredients-data .ings')
const upload = document.querySelector('.upload')
const addIngsBtn = document.querySelector('.addIngs')



export class Addrecipe {
    ingsCount = 1
    recipeRawData = {}
    recipeDataAfterValadition = {}
    errors = {}

    constructor() {



        addRecipeBtn.addEventListener('click', _ => dialog.showModal())
        closeBtn.addEventListener('click', _ => dialog.close())
        addIngsBtn.addEventListener('click', this._addIngsElement.bind(this))
        upload.addEventListener('click', e => this.__getRecipeRawData(e));
        inputEle.forEach(ele => ele.addEventListener('focus', e => this._errormessageHandeling(e)))

    }

    _addIngsElement() {

        this.ingsCount += 1

        let lable = document.createElement('lable')
        lable.classList.add('addRecipe-ings')
        lable.classList.add(`${this.ingsCount}`)
        lable.innerHTML = `Ingredients <span class="ings-num">${this.ingsCount}</span>`

        let input = document.createElement('input')
        input.classList.add('ings')
        input.classList.add(`${this.ingsCount}`)
        input.placeholder = "'Format: 'Quantity,Unit,Description'"

        ingsContainer.insertBefore(lable, addIngsBtn)
        lable.appendChild(input)


        ingsContainer.scrolltop = ingsContainer.scrollHeight; ////copied
    }


    __getRecipeRawData(e) {


        e.preventDefault()
        this._resetPage()

        this.recipeRawData = {
            title: title.value,
            URL: recipeURL.value,
            imageURL: imageURL.value,
            publisher: publisher.value,
            time: +time.value,
            servings: + serving.value,
            ingredients: this._getRawIngs(),
        }


        this._validateData(this.recipeRawData)





    }

    _validateData(recipedata) {

        console.log('fireed')

        this._validateTitle(recipedata)
        this._validatePublisher(recipedata)
        this._validateURL(recipedata)
        this._validateImageURL(recipedata)
        this._validateTime(recipedata.time)
        this._validateServing(recipedata.servings)



        ingredientsEle = document.querySelectorAll('.ingredients-data .ings')
        this._validateIngs(ingredientsEle)

        console.log(Object.keys(this.errors).length)


        if (Object.keys(this.errors).length === 0) {
            this._CreateID()
            this._addingToBookMark(this.recipeDataAfterValadition)
            inputEle.forEach(el => el.value = '')
        }



    }

    _errormessage(element, key, message) {
        let errorElement = document.createElement('div')
        errorElement.classList.add('error')
        errorElement.innerText = message
        element.insertAdjacentElement('afterend', errorElement);
        element.value = ''

        this.errors[key] = message
    }


    _onSucess(key, value) {
        this.recipeDataAfterValadition[key] = value
    }
    //title and publisher

    _validateTitle(recipedata) {
        let errorValid = 'enter valid input'
        let errorEmpty = 'Title cannot be empty'

        let titleRegExp = /[!@#%&()+]/;
        if (recipedata.title === '') return this._errormessage(title, 'title', errorEmpty)
        if (titleRegExp.test(recipedata.title)) return this._errormessage(title, 'title', errorValid)
        if (!titleRegExp.test(recipedata.title)) return this._onSucess('title', recipedata.title)

    }

    _validatePublisher(recipedata) {
        let errorValid = 'enter valid input'
        let errorEmpty = 'Publisher cannot be empty'

        let publisherRegExp = /[!@#%&()+]/;
        if (recipedata.publisher === '') return this._errormessage(publisher, 'publisher', errorEmpty)
        if (publisherRegExp.test(recipedata.publisher)) return this._errormessage(publisher, 'publisher', errorValid)
        if (!publisherRegExp.test(recipedata.publisher)) return this._onSucess('publisher', recipedata.publisher)

    }
    ///URL ----
    _validateURL(recipedata) {
        let errorValid = 'enter valid URL'
        let errorEmpty = 'URL cannot be empty'
        let urlRegExp = /(https|http)*:*\/*\/*(www)\.[a-z0-9]+\.(com)\/+[a-z]/gi;
        if (recipedata.URL === '') return this._errormessage(recipeURL, 'URL', errorEmpty)
        if (urlRegExp.test(recipedata.URL)) return this._onSucess('source_url', recipedata.URL)
        return this._errormessage(recipeURL, 'URL', errorValid)
    }

    _validateImageURL(recipedata) {
        let errorValid = 'enter valid URL'
        let errorEmpty = 'Image URL cannot be empty'

        let imageRegExp = /(https|http)*:*\/*\/*(www)\.[a-z0-9]+\.(com)\/+[a-z]/gi;
        if (recipedata.imageURL === '') return this._errormessage(imageURL, 'ImageURL', errorEmpty)
        if (imageRegExp.test(recipedata.imageURL)) return this._onSucess('image_url', recipedata.imageURL)
        return this._errormessage(imageURL, 'ImageURL', errorValid)


    }

    _validateTime(t) {
        let errorRange = 'cooking time must be between 4 to 200 minutes'
        let errorZero = 'Please enter valid timing '
        if (t === 0) return this._errormessage(time, 'time', errorZero)
        if (t >= 4 && t <= 200) return this._onSucess('cooking_time', t)
        this._errormessage(time, 'time', errorRange)

    }

    _validateServing(s) {
        let errorRange = 'serving must be between 1 to 20 people'
        let errorZero = 'Please enter valid timing '
        if (s === 0) return this._errormessage(serving, 'serving', errorZero)
        if (s >= 1 && s <= 20) return this._onSucess('servings', s)
        this._errormessage(serving, 'serving', errorRange)
    }

    _validateIngs(ings) {
        console.log(ings)

        if (ings[0].value === '') {
            this._errormessage(ings[0], 'ingeridents', 'Please enter ingredient');
        }


        let validIngs = []
        let ingsExp = /[0-9]+,(g|tsp|ml),[a-z]+/gi
        let error = 'please enter in valid format'

        ings.forEach(element => {
            if (element.value == '') return

            if (ingsExp.test(element.value)) {
                let SepIng = element.value.split(',')
                return validIngs.push({
                    quantity: SepIng[0],
                    unit: SepIng[1],
                    description: SepIng[2]
                })
            }

            this._errormessage(element, 'ingeridents', error)

        });

        return this.recipeDataAfterValadition.ingredients = validIngs



    }

    _getRawIngs() {
        let rawings = []
        ingredientsEle.forEach(ele => {
            rawings.push(ele.value)
        })
        return rawings
    }

    _errormessageHandeling(e) {
        if (e.target.tagName === 'INPUT') {
            let errorElement = document.querySelector('.error')
            let nextSibling = e.target.nextSibling
            if (nextSibling == errorElement)
                errorElement.remove()
        }

    }


    _resetPage() {
        let errorEle = document.querySelectorAll('.error')
        errorEle.forEach(el => {
            el.remove()
        })

        this.errors = {}
        this.recipeRawData = {}
        this.recipeDataAfterValadition = {}

    }

    _addingToBookMark(data) {
        let bookmarkData = JSON.parse(window.sessionStorage.getItem('bookmarks'))
        console.log(bookmarkData)


        if (bookmarkData === null) {
            let bookmarkData = []
            bookmarkData.push(data)
            return window.sessionStorage.setItem('bookmarks', JSON.stringify(bookmarkData))
        }

        bookmarkData.push(data)
        return window.sessionStorage.setItem('bookmarks', JSON.stringify(bookmarkData))

    }

    _CreateID() {
        let Id = "id" + Math.random().toString(16).slice(2)
        return this.recipeDataAfterValadition.id = Id
    }


}
