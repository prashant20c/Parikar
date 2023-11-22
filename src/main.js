import './styles.scss'
import axios from 'axios';
import { Search } from './js/search';
import  loadRecipe  from './js/loadingrecipe';
import recipeFunction from './js/recipeFuncationality'
import { Addrecipe } from './js/addRecipe';


new Search()
new loadRecipe(recipeFunction)

new Addrecipe()














