"use strict";

const mongodb = require('cl.jotacalderon.cf.framework/lib/mongodb');

module.exports = {
	
	//@route('/api/error')
	//@method(['post'])
	create: async function(req,res){
		/*info:
		Este servicio si bien es publico valida API-KEY 
		por el momento, es usado por la libreria logger a travez del framework
		*/
		try{
			
			if(!req.headers['x-api-key'] || req.headers['x-api-key'].trim()===''){
				throw('no-x-api-key');
			}
			
			if( req.headers['x-api-key'] === process.env.X_API_KEY ) {
				
				req.body.date = new Date();
				await mongodb.insertOne('errores',req.body);
				
			}
			res.send({data: true});
		}catch(error){
			console.log(error);
			res.send({data: true});
		}
	},
	
	//@route('/api/error/collection')
	//@method(['get'])
	//@roles(['root'])
	collection: async function(req,res){
		try{
			res.send({data: await mongodb.find('errores')});
		}catch(error){
			console.log(error);
			res.send({error: error});
		}
	}
};