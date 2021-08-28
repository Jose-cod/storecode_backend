const express = require('express');
const router = express.Router();
//var google = require("google-oauth-jwt");
const admin = require("firebase-admin");
const mysqlConnection = require('../database')

var serviceAccount= require("../storecode1-4b3ba-firebase-adminsdk-djxby-8ff5485467.json")






  //var accessToken= getAccessToken();
  
  /*headers= {
    'Authorization': 'Bearer ' + accessToken
  }*/

  //const key ="AAAARUq1Cnk:APA91bGybAknORgLjxV0_2M1ZrmoyTdsj5Ae9mVpK3RSM671lZH8gUdyj5-jriDP_W4OFK07lIAABykhPd_3bSNYIzQZQKrLMT5FWYIpn2szXLyTaK3kFxeE5t6aRUzxWfjIE3TbE5Xo";

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fir-storage-82d0f.firebaseio.com"
  });



  router.post('/storecode/push_notification',(req, res)=>{

   
    // This registration token comes from the client FCM SDKs.
    const {claveTransaccion,totalVendido,items,idVendedor,tokenFCM}= req.body;
    
    productos = JSON.stringify(items);
    console.log("productos");
    console.log(productos);
    console.log(tokenFCM);
    
    const message = {
      "data":{
          "body": "Detalles de tu compra",
          "title": "Detalles de tu compra",
          "message":"Notificacion", 
          "idVendedor":`${idVendedor}`,
          "claveTransaccion":`${claveTransaccion}`,
          "items": productos, 
          "totalVendido": `${totalVendido}`
          }
    };
    console.log("-----------items de la notificacion------------")
    console.log(message);
    console.log(items);
    // Send a message to the device corresponding to the provided
    // registration token.
    admin.messaging().sendToDevice(tokenFCM, message)
      .then((response) => {
        // Response is a message ID string.
        console.log('Successfully sent message:', response);
        res.json(response);
      })
      .catch((error) => {
        console.log('Error sending message:', error);
        res.json(error);
      });

  });

  //Enviar notificación por tema
  router.post('/storecode/push_notification/bytopic',(req, res)=>{

   
    // This registration token comes from the client FCM SDKs.
    const {idProducto,nombreProducto, desProducto,precioUnitarioProducto,
    imagenProducto, stockRealProducto, statusProducto, idMarca, idCategoria, idUsuario}= req.body;
    
  
    console.log(req.body);
    
    const message = {
      "data":{
          "title": "Nuevo producto",
          "message":"NotificacionVendedor", 
          "idProducto": `${idProducto}`,
          "nombreProducto": nombreProducto,
          "desProducto": desProducto,
          "precioUnitarioProducto":  `${precioUnitarioProducto}`,
          "imagenProducto": imagenProducto,
          "stockRealProducto": `${stockRealProducto}`,
          "statusProducto": statusProducto,
          "idMarca": `${idMarca}`,
          "idCategoria": `${idCategoria}`,
          "idUsuario": `${idUsuario}`
          }
    };
    console.log("-----------items de la notificacion------------")
    console.log(message);
    // Send a message to the device corresponding to the provided
    // registration token.
    
    admin.messaging().sendToDevice(`/topics/${idUsuario}`, message)
      .then((response) => {
        // Response is a message ID string.
        console.log('Successfully sent message:', response);
        res.json(response);
      })
      .catch((error) => {
        console.log('Error sending message:', error);
        res.json(error);
      });

  });
  //Enviar notificación por tema


  router.put('/storecode/tokenfcm',(req,res)=>{
    const {idUsuario,tokenFCM}= req.body;

    const query = `CALL psInsertTokenFCM(${idUsuario},'${tokenFCM}')`;

    mysqlConnection.query(query,(err,flieds)=>{
      if(!err){
        console.log(`Token registrado: ${tokenFCM} asociado al id: ${idUsuario}`);
        res.json({
          Mensaje: "Token registrado con éxito"
        });
      }else{
        console.log(err);
      }
    });
  });



module.exports = router;