const express = require('express');
const router = express.Router();
const mysqlConnection = require('../database');

//obtener todos los productos
router.get('/storecode/categories',(req,res)=>{
    mysqlConnection.query('SELECT*FROM categoria',(err,rows,fields)=>{
        if(!err){
            res.json(rows);
            console.log(rows);

        }else{
            console.log(err);
        }
    });
});


//obtener categoria por el id de categoria
router.get('/storecode/categories/:id',(req,res)=>{
    const {id}= req.params;

    mysqlConnection.query(`SELECT desCategoria FROM categoria WHERE idCategoria=${id}`,(err,rows,fields)=>{
        if(!err){
            console.log(rows);
            res.json(rows[0]);
        }else{
            console.log(err);
        }
    });
});
module.exports = router;