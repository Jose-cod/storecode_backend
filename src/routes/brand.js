const express = require('express');
const router = express.Router();
const mysqlConnection = require('../database');

//obtener todas las marcas
router.get('/storecode/brands',(req,res)=>{
    mysqlConnection.query('SELECT*FROM marca',(err,rows,fields)=>{
        if(!err){
            res.json(rows);
            console.log(rows);

        }else{
            console.log(err);
        }
    });
});

//obtener marca por el id de marca
router.get('/storecode/brands/:id',(req,res)=>{
    const {id}= req.params;

    mysqlConnection.query(`SELECT desMarca FROM marca WHERE idMarca=${id}`,(err,rows,fields)=>{
        if(!err){
            console.log(rows);
            res.json(rows);
        }else{
            console.log(err);
        }
    });
});


module.exports= router;