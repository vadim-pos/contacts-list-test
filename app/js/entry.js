let Model = require('./model');
let View = require('./view');
let Controller = require('./controller');

// ---------- Adjustments START
// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};
// ---------- Adjustments END

// Initialization
Model.getData('../data/data.json')
.then(() => {
	View.render('main-list', Model.mainListModel, 'contacts__panel--main');
	View.render('fav-list', Model.favListModel, 'contacts__panel--fav');
	Controller.setupListeners();
})
.catch(data => console.log(data));