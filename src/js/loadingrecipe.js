import axios from "axios";
import convertTofraction from "./fractionFun";


let recipeCont = document.querySelector('.recipe')

export default class LoadRecipe {
    #id;

    constructor(recipeFun) {
        this.recipeFun = recipeFun
        window.addEventListener('hashchange', this._loadRecipe.bind(this))
    }

    async _loadRecipe() {
        let id = this._gethash()
        let regexp = /^id[a-z0-9]*/
        if (regexp.test(id)) return this._localRecipe(id)


        let recipeInfo = await axios.get(`https://forkify-api.herokuapp.com/api/v2/recipes/${id}`)
        let { data } = await recipeInfo.data
        console.log(data)
        let recipe = await data.recipe
        recipeCont.innerText = ''
        this._displayrecipe(recipe)
    }

    _gethash() {
        let hash = window.location.hash
        let id = hash.slice(1)
        return id
    }


    _displayrecipe(recipe) {
        let figure = document.createElement('figure')
        figure.classList.add('recipe-header')

        let recipeImg = document.createElement('img')
        recipeImg.classList.add('recipe-image')
        recipeImg.src = recipe.image_url

        let recipeTitle = document.createElement('h3')
        recipeTitle.classList.add('recipe-title')
        recipeTitle.innerText = recipe.title

        recipeCont.appendChild(figure)
        figure.appendChild(recipeImg)
        figure.appendChild(recipeTitle)

        //servings
        let servingInfo = document.createElement('div')
        servingInfo.classList.add('serving-info')

        let time = document.createElement('h4')


        let iconTime = document.createElement('i')
        iconTime.classList.add('fa-solid')
        iconTime.classList.add('fa-clock')

        time.innerHTML = `<h3 class ='serving-time'>${recipe.cooking_time}</h3>  Minutes  `
        recipeCont.appendChild(servingInfo)
        servingInfo.append(time)
        time.appendChild(iconTime)

        let servingCount = document.createElement('div')
        servingCount.classList.add('serving-count')

        let iconPlus = document.createElement('i')
        iconPlus.classList.add('fa-solid')
        iconPlus.classList.add('fa-plus')

        let spanText = document.createElement('span')
        spanText.innerHTML = `<h3 class='serving-num'>${recipe.servings}</h3> servings `

        let iconMinus = document.createElement('i')
        iconMinus.classList.add('fa-solid')
        iconMinus.classList.add('fa-minus')

        let iconbookmark = document.createElement('i')
        iconbookmark.classList.add('fa-regular')
        iconbookmark.classList.add('fa-bookmark')
        iconbookmark.classList.add('addBookmark')



        servingInfo.appendChild(servingCount)
        servingCount.appendChild(spanText)
        servingCount.appendChild(iconPlus)
        servingCount.appendChild(iconMinus)
        servingCount.append(iconbookmark)


        this._display_ingredients(recipe.ingredients)
        this._displayDirection(recipe)
        new this.recipeFun(recipe, this._display_ingredients)
    }

    _display_ingredients(ingredients) {

        let ul = document.querySelector('.recipe-ingredients');
        if (!ul) {
            ul = document.createElement('ul')
            ul.style.listStyle = 'none'
            ul.classList.add('recipe-ingredients')
            recipeCont.appendChild(ul)
        }
        ul.innerHTML = ''

        ingredients.forEach((item) => {
            const li = document.createElement('li')
            li.classList.add(`ingredient`)

            const icon = document.createElement('i')
            icon.classList.add('fa-solid')
            icon.classList.add('fa-check')

            const quantity = document.createElement('div')
            quantity.classList.add('recipe-quantity')
            quantity.innerText = convertTofraction(item.quantity)

            const unit = document.createElement('div')
            unit.classList.add('quantity-unit')
            unit.innerText = item.unit

            const description = document.createElement('div')
            description.classList.add('ingredients-description')
            description.innerText = item.description
            ul.appendChild(li)
            li.appendChild(icon)
            li.appendChild(quantity)
            li.appendChild(unit)
            li.appendChild(description)
        });
    }

    _displayDirection(detail) {

        let main = document.createElement('div')
        main.classList.add('recipe-direction')

        let title = document.createElement('h2')
        title.innerText = 'HOW TO COOK IT'

        let text = document.createElement('p')
        text.classList.add('derection-text')
        text.innerHTML = `This recipe was carefully designed and tested by <strong>${detail.publisher}</strong>.Please check out directions at their website.`

        let directionLink = document.createElement('a')
        directionLink.href = detail.source_url

        let button = document.createElement('button')
        button.innerText = 'Direction'

        directionLink.appendChild(button)
        recipeCont.appendChild(main)
        main.appendChild(title)
        main.appendChild(text)
        main.appendChild(directionLink)
    }

    
    /**
     * 
     * @param {recipe id from local storage} id 
     * @returns the recipe descrtiption in recipe-container
     */

    _localRecipe(id) {

        let data = JSON.parse(window.sessionStorage.getItem('bookmarks'))
        let recipe = data.find(rec => rec.id === id)
        
        recipeCont.innerText = ''
        return this._displayrecipe(recipe)

    }





}





