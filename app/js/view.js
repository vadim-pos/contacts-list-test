let Handlebars = require('handlebars');

module.exports = {

	render(elementRole, model, dest) {
		let templateDest = document.querySelector('.' + dest),
			templateNode = document.querySelector('[data-role=' + elementRole + '-Template]'),
			templateSrc  = templateNode.innerHTML,
			templateFunc = Handlebars.compile(templateSrc);

		let itemForInsert = templateDest.querySelector('[data-role=' + elementRole + ']');
		if (itemForInsert) {
			itemForInsert.parentElement.removeChild(itemForInsert);
		}

		templateDest.insertAdjacentHTML('beforeEnd', templateFunc({list: model}));
	}
};