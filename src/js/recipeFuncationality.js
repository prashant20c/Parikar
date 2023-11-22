import { index } from "mathjs";
import convertTofraction from "./fractionFun";



export default class RecipeFunctions {
    recipeContainer = document.querySelector('.recipe')
    servingInfo = document.querySelector('.serving-info')
    serPlus = document.querySelector('.fa-plus');
    serMinus = document.querySelector('.fa-minus')
    servingCount = document.querySelector('.serving-num')
    ings = document.querySelectorAll('.recipe-quantity')
    ingsDomElements = document.querySelector('.recipe-ingredients')
    bookmarkAdd = document.querySelector('.addBookmark')


    perviousCount;
    newServingCount;



    constructor(recipe, displayIngs) {
        this.displayFun = displayIngs
        this.recipe = recipe
        this.recipeIngredients = recipe.ingredients
        this.startingServCunt = recipe.servings
        this.serPlus.addEventListener('click', this._increaseServing.bind(this))
        console.log(this.serPlus)
        this.serMinus.addEventListener('click', this._decreaseServing.bind(this))
        this.bookmarkAdd.addEventListener('click', this._bookmark.bind(this))

        this.bookmark_SessionStorage = this._loadSession()

        this._checkAndMarkBookmarks()
        // this.ings.forEach(element => {
        //     element.addEventListener('change', () => this._convertTofraction(+element.innerText).bind(this));
        // });
    }

    _increaseServing() {
        console.log('haha')
        let currentValue = +this.servingCount.innerText
        this.perviousCount = currentValue
        this.newServingCount = currentValue + 1;
        this.servingCount.innerText = this.newServingCount;
        this.recipe.servings = this.newServingCount
        this._ingredientsAsServings(this.recipeIngredients)
        this.displayFun(this.recipeIngredients);
    }

    _decreaseServing() {
        let currentvalue = +this.servingCount.innerText
        this.perviousCount = currentvalue

        if (currentvalue == 1) return this.servingCount.innerText = 1, this.newServingCount = 1

        this.newServingCount = currentvalue - 1;
        this.servingCount.innerText = this.newServingCount;

        this._ingredientsAsServings(this.recipeIngredients)
        this.displayFun(this.recipeIngredients)
    }

    _ingredientsAsServings(ings) {
        ings.forEach(item => {
            console.log(this.newServingCount)
            if (item.quantity == null) return
            item.quantity = (item.quantity / (this.perviousCount)) * this.newServingCount
        });
    }

    ////bookmark
    _bookmark(e) {
        let element = e.target
        if (element.classList.contains('bookmarked')) {
            return this._removebookmark(this.recipe.id, element);
        }
        element.classList.remove('fa-regular')
        element.classList.add('fa-solid')
        element.classList.add('bookmarked')
        this.bookmark_SessionStorage.push(this.recipe)
        window.sessionStorage.setItem(`bookmarks`, JSON.stringify(this.bookmark_SessionStorage))
    }

    _removebookmark(id, element) {
        element.classList.add('fa-regular');
        element.classList.remove('fa-solid');
        element.classList.remove('bookmarked');

        this.bookmark_SessionStorage.forEach((recipe, index) => {
            if (recipe.id === id) {
                this.bookmark_SessionStorage.splice(index, 1);
                console.log(this.bookmark_SessionStorage);
                window.sessionStorage.removeItem(`bookmarks`);
                window.sessionStorage.setItem(`bookmarks`, JSON.stringify(this.bookmark_SessionStorage));
            }
        });
    }


    _loadSession() {
        let sessionData = JSON.parse(window.sessionStorage.getItem('bookmarks'))
        if (!sessionData) return []
        if (sessionData) return sessionData

    }

    _checkAndMarkBookmarks() {

        if (!this.bookmark_SessionStorage) return

        this.bookmark_SessionStorage.forEach(item => {
            console.log(item.id === this.recipe.id)

            if (item.id === this.recipe.id) {
                this.bookmarkAdd.classList.add('bookmarked')
                this.bookmarkAdd.classList.add('fa-solid')
                this.bookmarkAdd.classList.remove('fa-regular')
            }
        })
    }



}