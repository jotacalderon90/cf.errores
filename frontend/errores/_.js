const errores = function() {
	this.services = {
		collection: createService('get','api/error/collection')
	};
}

errores.prototype.start = async function(parent){
	this.parent = parent;
	this.filterDomain = '';
	this.sortColumn = 'date';
	this.sortOrder = -1;
	this.domains = [];
	this.displayCollection = [];
	await this.reload();
}

errores.prototype.reload = async function(){
	try {
		
		this.parent.loader.active = true;
		
		const response = await this.services.collection();
		
		if (response.error) {
			throw (response.error);
		}
		
		this.collection = response.data.map((row)=>{
			row.rawDate = row.date;
			row.date = luxon.DateTime.fromISO(row.date).toFormat('dd-MM-yyyy HH:mm:ss');
			return row;
		});
		
		const domainsSet = new Set(this.collection.map(row => row.host));
		this.domains = Array.from(domainsSet).sort();

		this.applyFilters();
		
		this.parent.loader.active = false;
		
	}catch(error) {
		alert(error);
		console.log(error);
	}
}

errores.prototype.applyFilters = function() {
	let result = [...this.collection];

	if (this.filterDomain) {
		result = result.filter(row => row.host === this.filterDomain);
	}

	result.sort((a, b) => {
		let valA = a[this.sortColumn];
		let valB = b[this.sortColumn];

		if (this.sortColumn === 'date') {
			valA = a.rawDate;
			valB = b.rawDate;
		}

		if (valA < valB) return -1 * this.sortOrder;
		if (valA > valB) return 1 * this.sortOrder;
		return 0;
	});

	this.displayCollection = result;
}

errores.prototype.toggleSort = function(column) {
	if (this.sortColumn === column) {
		this.sortOrder = this.sortOrder * -1;
	} else {
		this.sortColumn = column;
		this.sortOrder = 1;
	}
	this.applyFilters();
}

app.modules.errores = errores;