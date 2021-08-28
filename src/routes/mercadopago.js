const express = require('express');
const router = express.Router();
const mysqlConnection = require('../database')
var mercadopago = require('mercadopago');



//REPLACE WITH YOUR ACCESS TOKEN AVAILABLE IN: https://developers.mercadopago.com/panel/credentials
/*mercadopago.configure({
  access_token: "TEST-610754876220495-072005-da22f948a8a3819f5a1169a0bde2d205-794041051"
});*/



//var preference = {}

var item = {
  title: 'Blue shirt',
  quantity: 10,
  currency_id: 'MXN',
  unit_price: 150
}



//preference.items = [item]




 router.post("/storecode/create_preference", (req, res) => {
  var payer={
    email: req.body[0].clientEmail
      //email: "test_user_96449529@testuser.com",
  }

  var access_token = req.body[0].accessToken;

  mercadopago.configure({
    access_token: access_token
  });

  var products=[];

  req.body.forEach(product => {
    products.push({
      title: product.nombreProducto,
      quantity : product.quantity,
      currency_id: 'MXN',
      unit_price: product.price	
    });
  });

	var preference = {
    items:products,
		/*items: [{
			title: req.body.description,
      quantity : req.body.quantity,
      currency_id: 'MXN',
      unit_price: req.body.price			,
		}],
    */

    /*payment_methods: {
      
      excluded_payment_types:[
          {"id":"ticket"},
          {"id":"atm"},
      ]
    }*/
  
	};
  preference.payer = payer;

  console.log(preference);

	mercadopago.preferences.create(preference)
		.then(function (response) {
      console.log(req.body);
			res.json({id :response.body.id})
		}).catch(function (error) {
			console.log(error);
		});
});

 /*var payer={
    
   "payer": {
     "name": "Carlota",
     "surname": "Castellanos",
     "email": "cheche1430@gmail.com",
     "date_created": "2015-06-02T12:58:41.425-04:00",
     "phone": {
       "area_code": "11",
       "number": "619 911 306"
     },
     
     "address": {
       "street_name": "Insurgentes Sur",
       "street_number": 7304,
       "zip_code": "52"
     }
   },
   
 }*/

 module.exports=router;