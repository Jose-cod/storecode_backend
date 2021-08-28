const express = require('express');
const router = express.Router();
const mysqlConnection = require('../database');

//Insertar una venta
router.post('/storecode/venta',(req,res)=>{
    const {claveTransaccion,paypalDatos,correo,totalVendido}= req.body;
    const query= `CALL psInsVentav2('${claveTransaccion}','${paypalDatos}','${correo}',${totalVendido})`

    mysqlConnection.query(query, (err,rows,fields)=>{
        if(!err){
            res.json(rows[0][0]);
        }else{
            console.log(err);
            res.json({
                Mensaje: 'Error en la petición'
           });
        }
    });
});
//Insertar una venta- fin

//Insertar carritoventa
router.post('/storecode/carritoventa',(req,res)=>{
    const {idCarrito,FolioVenta}= req.body;
    const query= `CALL psInsCarritoVenta(${idCarrito},'${FolioVenta}')`

    mysqlConnection.query(query, (err,rows,fields)=>{
        if(!err){
            res.json(rows[0][0]);
        }else{
            console.log(err);
            res.json({
                Mensaje: 'Error en la petición'
           });
        }
    });
});
//Insertar carritoventa- fin

//obtener los productos vendidos a través del id del usuario
router.get('/storecode/myshopping/:id',(req,res)=>{

    const {id} = req.params;
    mysqlConnection.query(`CALL psMosVentaByUser(${id})`,(err,rows,fields)=>{
        if(!err){
            res.json(rows[0]);
            console.log(rows[0]);

        }else{
            console.log(err);
        }
    });

})
//obtener los productos vendidos a través del id del usuario

module.exports=router;