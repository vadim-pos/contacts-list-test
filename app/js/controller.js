let Model = require('./model');
let View = require('./view');

module.exports = {

	setupListeners() {
		let friends    = document.querySelector('.contacts');

		friends.addEventListener('click', this.onclick);
		friends.addEventListener('input', this.oninput);

		this.dragManager();
	},

	onclick(e) {
		let mainList = document.querySelector('[data-role="main-list"]'),
			favList  = document.querySelector('[data-role="fav-list"]'),
			target   = e.target,
			selectedItem;

		if (target.dataset.action === 'add-item') {
			e.preventDefault();
			selectedItem = target.closest('.contacts__item');

			favList.appendChild(selectedItem);
			target.className = 'contacts__link contacts__link--del';
			target.dataset.action = 'del-item';

			Model.addItem(selectedItem);

		} else if (target.dataset.action === 'del-item') {
			e.preventDefault();
			selectedItem = target.closest('.contacts__item');

			mainList.appendChild(selectedItem);
			target.className = 'contacts__link contacts__link--add';
			target.dataset.action = 'add-item';

			Model.delItem(selectedItem);
		} else if (target.dataset.action === 'save') {
			Model.saveData();
		}
	},

	oninput(e) {
		let substr      = e.target.value.toLowerCase(),
			bindingElem = e.target.dataset.bind;

		function sortData(dataArr) {
			let sortedDataArr = [];
			
			for (let i = 0; i < dataArr.length; i++) {
				let str = dataArr[i].name;
				if (str.toLowerCase().substring(0, substr.length) !== substr) {
					continue;
				}
				sortedDataArr.push(dataArr[i]);
			}
			return sortedDataArr;
		}

		if (bindingElem === 'main-list') {
			View.render(bindingElem, sortData(Model.mainListModel), 'contacts__panel--main');
		}
		if (bindingElem === 'fav-list') {
			View.render(bindingElem, sortData(Model.favListModel), 'contacts__panel--fav');
		}
	},

	dragManager() {
		let dragObject = {};

		document.addEventListener('mousedown', e => {
			if (e.which != 1) { return; }
			if (e.target.dataset.action) { return; }

			let elem = e.target.closest('.draggable');
			if(!elem) { return; }

			e.preventDefault();

			dragObject.elem = elem;
			dragObject.parrent = elem.parentElement;
			dragObject.startX = e.pageX;
  			dragObject.startY = e.pageY;
		});

		document.addEventListener('mousemove', e => {
			if (!dragObject.elem) { return; }

    		if (!dragObject.avatar) {

				let moveX = e.pageX - dragObject.startX;
	    		let moveY = e.pageY - dragObject.startY;
	    		if ( Math.abs(moveX) < 3 && Math.abs(moveY) < 3 ) { return; }

	    		dragObject.avatar = createAvatar();

	    		let coords = getCoords(dragObject.elem);
	    		dragObject.shiftX = dragObject.startX - coords.left;
	    		dragObject.shiftY = dragObject.startY - coords.top;

	    		startDrag();
	    		dragObject.elem.hidden = true;
    		}
    		dragObject.avatar.style.left = e.pageX - dragObject.shiftX + 'px';
			dragObject.avatar.style.top = e.pageY - dragObject.shiftY + 'px';    		
		});

		document.addEventListener('mouseup', () => {
			if (dragObject.avatar) { finishDrag(); }
			dragObject = {};
		});

		function getCoords(elem) {
			let coords = elem.getBoundingClientRect();
			return {
				top: coords.top + pageYOffset,
				left: coords.left + pageXOffset
			};
		}

		function createAvatar() {
			let avatar = dragObject.elem.cloneNode(true);
			return avatar;
		}

		function destroyAvatar() {
			if (dragObject.avatar) {
				document.body.removeChild(dragObject.avatar);
				dragObject.elem.hidden = false;
			}
		}

		function startDrag() {
			let avatar = dragObject.avatar;

			document.body.appendChild(avatar);
			avatar.style.zIndex = 9999;
  			avatar.style.position = 'absolute';
  			avatar.style.backgroundColor = '#d1f8a7';
  			avatar.style.width = dragObject.elem.offsetWidth + 'px';
		}

		function finishDrag() {
			let dropElem = findDroppable();

			if (dropElem) {
				if (dropElem !== dragObject.parrent) {
					dragObject.elem.querySelector('[data-action]').dispatchEvent(
						new CustomEvent('click', {bubbles: true})
					);
				}
			}
			destroyAvatar();
		}

		function findDroppable() {
			dragObject.avatar.hidden = true;
			let elem = document.elementFromPoint(event.clientX, event.clientY);
			dragObject.avatar.hidden = false;

			if (elem == null) { return null; }

			return elem.closest('.droppable');
		}
	}
};