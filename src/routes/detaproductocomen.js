const express = require('express');
const router = express.Router();
const mysqlConnection = require('../database');
const multer = require('multer');
const path = require('path');
const { query } = require('../database');


//insertar comentario en la tabla detaproductocomen

router.post('/storecode/detaproductocomen',(req,res, next)=>{
    const {comentario,idUsuario, idProducto} = req.body;

    const query = `CALL psInsertComenUsuario('${comentario}',${idUsuario},${idProducto})`;

    mysqlConnection.query(query,(err,rows,fields)=>{
        if(!err){
            res.json({
                message: "Se agrego correctamente tu comentario"
            });
            console.log("Se agrego correctamente tu comentario");
            
            
        }else{
            console.log(err);
            res.json({
                message: 'Error en la petición'
            })
        }
    });

});

//insertar comentario de cliente que ya realizo una compra
router.post('/storecode/detaproductocomencliente',(req,res, next)=>{
    const {comentario,estrellas,idUsuario,idProducto,} = req.body;

    const query = `CALL psInsertComenCliente('${comentario}',${estrellas},${idUsuario},${idProducto})`;

    mysqlConnection.query(query,(err,rows,fields)=>{
        if(!err){
            res.json({
                message: "Se agrego correctamente tu comentario"
            });
            console.log("Se agrego correctamente tu comentario");
            
            
        }else{
            console.log(err);
            res.json({
                message: 'Error en la petición'
            })
        }
    });

});
//obtener todos los comentarios de un producto, filtrado por le id del producto

router.get('/storecode/detaproductocomen/:id',(req, res, next)=>{
    const {id} = req.params;
    const query = `CALL psMosComenProdu(${id})`;

    mysqlConnection.query(query,(err,rows,fields)=>{
        if(!err){
            res.json(rows[0]);
            console.log(rows[0]);
        }else{
            console.log(err);
            res.json({
                error: err
            });
        }
    });
});

//obtener todos los comentarios de clientes, filtrado por el id del producto

router.get('/storecode/detaproductocomencliente/:id',(req, res, next)=>{
    const {id} = req.params;
    const query = `CALL psMosComenCliente(${id})`;

    mysqlConnection.query(query,(err,rows,fields)=>{
        if(!err){
            res.json(rows[0]);
            console.log(rows[0]);
        }else{
            console.log(err);
            res.json({
                error: err
            });
        }
    });
});





module.exports = router;