const express = require('express');
const router = express.Router();
const mysqlConnection = require('../database');


router.get('/storecode/imgproducto/:idProducto',(req,res)=> {
    const { idProducto } = req.params;
    
    mysqlConnection.query(`CALL psMosActuImgsc(${idProducto})`,(err,rows,fields)=>{
        if(!err){
            res.json(rows[0]);
        }else{
            res.json(rows[0]);
            console.log(err);
        }
    });
});

module.exports = router;