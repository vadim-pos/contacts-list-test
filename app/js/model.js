module.exports = {

	mainListModel: [],
	favListModel: [],
	
	getData(url) {

		if (localStorage.friendsListData) {

			return new Promise ((resolve) => {
				let savedData = JSON.parse(localStorage.friendsListData);
				this.mainListModel = savedData.mainList;
				this.favListModel = savedData.favList;
				resolve();
			});

		} else {

			return new Promise((resolve, reject) => {
				let xhr = new XMLHttpRequest();
				xhr.open('GET', url);
				xhr.responseType = 'json';
				xhr.addEventListener('load', () => {
					let data = xhr.response;
					this.mainListModel = data.mainList || [];
					this.favListModel = data.favList || [];
					resolve();
				});
				xhr.addEventListener('error', () => { reject(new Error('Cannot get data from server')); });
				xhr.send();
			});
		}
	},

	saveData() {
		localStorage.friendsListData = JSON.stringify({
			mainList: this.mainListModel,
			favList: this.favListModel
		});
	},

	addItem(element) {
		let name = element.querySelector('.contacts__name').textContent;
		let image = element.querySelector('.contacts__image').getAttribute('src');
		this.favListModel.push({name, image});

		for (var i = 0; i < this.mainListModel.length; i++) {
			if (this.mainListModel[i].name === name && this.mainListModel[i].image === image) {
				this.mainListModel.remove(i);
			}
		}
	},

	delItem(element) {
		let name = element.querySelector('.contacts__name').textContent;
		let image = element.querySelector('.contacts__image').getAttribute('src');
		this.mainListModel.push({name, image});

		for (var i = 0; i < this.favListModel.length; i++) {
			if (this.favListModel[i].name === name && this.favListModel[i].image === image) {
				this.favListModel.remove(i);
			}
		}
	}
};