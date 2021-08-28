const express = require('express');
const router = express.Router();
const mysqlConnection = require('../database');

//Insertar un carrito a usuario
router.post('/storecode/card',(req,res)=>{
    const {idUsuario,precioUnitario,cantidadProducto,statusCarrito}= req.body;
    const query= `CALL psInsertcarritoUsuario(${idUsuario},${precioUnitario},${cantidadProducto},${statusCarrito})`

    mysqlConnection.query(query, (err,rows,fields)=>{
        if(!err){
            res.json({
                 Mensaje: 'Carrito registrado con exito'
            });
        }else{
            res.json({
                Mensaje: 'Error en la petición'
           });
        }
    });
});

//Insertar un registro en la tabla productocarrito
router.post('/storecode/productocarrito',(req,res)=>{
    const {idProducto,idCarrito,cantidadProducto}= req.body;
    const query= `CALL psInsertProductoCarrito(${idProducto},${idCarrito},${cantidadProducto})`;

    mysqlConnection.query(query,(err,rows, fields)=>{
        if(!err){
            //console.log(rows[0][0]);
            res.json({
                Mensaje: 'El producto fue agregado con exito'
            }
            );
            
        }else{
            console.log(err);
            res.json({
                Mensaje :'Error en la petición'
            });
        }
    });
});


//Eliminado logico de un producto en el carrito
// eliminado logico
router.put('/storecode/delete/productcarrito/:id',(req,res)=>{
    
    const { id }= req.params;

    const query= `CALL psEliProductoCarrito('${id}')`;

    mysqlConnection.query(query,(err,rows,fields)=>{
        if(!err){
            res.json({Mensaje: 'Se eliminó el producto correctamente'});

        }else{
            console.log(err);
        }
    });
});
//Eliminado logico de un producto en el carrito


//Actualizar el stock de un producto, despues de una venta
//y eliminado logico del producto en el carrito
router.put('/storecode/updatestock',(req,res)=>{
    
    const { idProductoCarrito,idProducto,cantidadSelled }= req.body;

    const query= `CALL psUpdateStockProductSelled(${idProductoCarrito},${idProducto},${cantidadSelled})`;

    mysqlConnection.query(query,(err,rows,fields)=>{
        if(!err){
            res.json({Mensaje: 'Stock actualizado'});

        }else{
            console.log(err);
        }
    });
});
//Actualizar el stock de un producto, despues de una venta
//y eliminado logico del producto en el carrito

//servicio para consultar el id del carrito por el id del usuario
router.get('/storecode/carrito/:idUser',(req,res)=>{
    const {idUser}= req.params;
    const query= `CALL psMosCarritoByIdUser(${idUser})`;

    mysqlConnection.query(query,(err, rows)=>{
        if(!err){
            res.json(rows[0][0]);
        }else{
            res.json(rows);
            console.log(err);
        }
    });
});

//servicio para consultar datos de los productos que se encuentran en el carrito de compras
router.get('/storecode/productsInCard/:id',(req,res)=>{
    const {id} = req.params;
    const query= `CALL psMosProdInCarritoGroupByVendedor(${id})`;

    mysqlConnection.query(query,(err,rows)=>{
        if(!err){
            res.json(rows[0]);
        }else{
            res.json(rows[0]);
            console.log(err);
        }
    });
});





module.exports=router;