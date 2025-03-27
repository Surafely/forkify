import preiviewView from './preiviewView.js';
import View from './View.js';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipe found for your query!please try again!';
  _message = '';

  _generateMarkUp() {
    // console.log(this._data);
    return this._data
      .map(result => preiviewView.render(result, false))
      .join('');
  }
}
export default new ResultsView();
