const errores = function() {
	this.services = {
		collection: createService('get','api/error/collection')
	};
}

errores.prototype.start = async function(parent){
	this.parent = parent;
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
			row.date = luxon.DateTime.fromISO(row.date).toFormat('dd-MM-yyyy hh:mm:ss');
			return row;
		});
		
		this.parent.loader.active = false;
		
	}catch(error) {
		alert(error);
		console.log(error);
	}
}

app.modules.errores = errores;