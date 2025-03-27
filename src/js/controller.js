import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeViews from './views/recipeViews.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeViews.renderSpinner();

    // 0. update results view to mark selected searcn results
    resultsView.update(model.getSearchResultPage());
    bookmarkView.update(model.state.bookmarks);

    // 1. Loading Recipe
    await model.loadRecipe(id);

    // 2. Rendering recipe

    recipeViews.render(model.state.recipe);
  } catch (err) {
    recipeViews.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1. Get search query
    const query = searchView.getQuery();
    if (!query) return;

    //  2.Load search results
    await model.loadSearchResults(query);

    // 3. Render results
    resultsView.render(model.getSearchResultPage());

    // 4. Render initial pagination view
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 1. Result NEW results
  resultsView.render(model.getSearchResultPage(goToPage));

  // 2. Render initial pagination view
  paginationView.render(model.state.search);
};

const controlServings = function (newServing) {
  // 1. Update the recipe servings(in the state);
  model.updateServings(newServing);

  // 2. update the recipe view
  // recipeViews.render(model.state.recipe);
  recipeViews.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // Add/remove bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // update recipe views
  recipeViews.update(model.state.recipe);

  // Render bookmarks
  bookmarkView.render(model.state.bookmarks);
};

const controlBookmark = function () {
  bookmarkView.render(model.state.bookmarks);
};
const controlAddUpload = async function (newRecipe) {
  try {
    // upload loading spinner
    addRecipeView.renderSpinner();
    //  Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeViews.render(model.state.recipe);

    // Success Message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarkView.render(model.state.bookmarks);

    // Change id in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //close modal window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

const newFeatures = function () {
  console.log('Welcome back');
};

const init = function () {
  bookmarkView.addHandlerRender(controlBookmark);
  recipeViews.addHandlerRender(controlRecipe);
  recipeViews.addHandlerUpdateServings(controlServings);
  recipeViews.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddUpload);
  newFeatures();
};

init();
