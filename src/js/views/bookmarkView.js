import View from './View.js';
import preiviewView from './preiviewView.js';
import icons from 'url:../../img/icons.svg';

class BookmarkView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkUp() {
    console.log(this._data);
    return this._data
      .map(bookmark => preiviewView.render(bookmark, false))
      .join('');
  }
}
export default new BookmarkView();
