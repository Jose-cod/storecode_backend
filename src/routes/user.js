const express = require('express');
const router = express.Router();
const mysqlConnection = require('../database')


// Autenticar usuario

router.post('/storecode/login/',(req,res)=>{
    const{emailUsuario,contraUsuario} = req.body;
    console.log('Los datos ingresados son:')
    console.log(emailUsuario,contraUsuario);
    const query = `call psLoginUserv2('${contraUsuario}','${emailUsuario}')`;
    //const query = `SELECT*FROM usuario WHERE emailUsuario='${emailUsuario}'`;

    mysqlConnection.query(query,(err,rows,fields)=>{
        if(!err){
        
            res.json(rows[0][0]);
            
        }else{
            console.log(err);
            res.json({
                message: 'Error en la petición',
                status: false
            });
        }
    });

});
//registrar un nuevo usuario
router.post('/storecode/users/',(req,res)=>{
    const {nombreUsuario,apellido1Usuario,
        emailUsuario,contraUsuario, confirmaContraUsuario,codeActive} = req.body;
    console.log(req.body);

    const query=`CALL psInsertUsuariov1('${nombreUsuario}','${apellido1Usuario}','${emailUsuario}','${contraUsuario}','${confirmaContraUsuario}','${codeActive}')`;

    mysqlConnection.query(query,(err,rows,fields)=>{
        if(!err){
            res.json(rows[0][0]);
            console.log(rows[0]);
            //res.json({status: "Usuario registrado correctamente"})
            
        }else{
            console.log(err);
            res.json({
                message: 'Error en la petición'
            })
        }
    });
});

//registrar usuario de google
router.post('/storecode/users/google',(req,res)=>{
    const {nombreUsuario,apellido1,apellido2,emailUsuario,contraUsuario,urlFoto} = req.body;
    console.log(req.body);

    const query=`CALL psInsertUsuariov2('${nombreUsuario}','${apellido1}','${apellido2}','${emailUsuario}','${contraUsuario}','${urlFoto}')`;

    mysqlConnection.query(query,(err,rows,fields)=>{
        if(!err){
            res.json(rows[0]);
            console.log(rows[0]);
            //res.json({status: "Usuario registrado correctamente"})
            
        }else{
            console.log(err);
            res.json({
                message: 'Error en la petición'
            })
        }
    });
});
//Insertar rol de usuario
router.post('/storecode/users/rolpermiso',(req, res)=>{
    const {idUsuario} = req.body;
    const query = `CALL psInsertRolPermisoMovil(${idUsuario})`;

    mysqlConnection.query(query,(err, rows)=>{
        if(!err){
            res.json({message: "Rol agregado correctamente"});
        }else{
            console.log(err);
            res.json({
                Aviso: "Error en la petición"
            })
        }
    });
});
//obtener un usuario por su id
router.get('/storecode/users/:id',(req,res)=>{
    const { id } = req.params;
    
    mysqlConnection.query(`CALL psMosVendedor(${id})`,(err,rows,fields)=>{
        if(!err){
            res.json(rows[0][0]);
        }else{
            res.json(rows[0]);
            console.log(err);
        }
    });
});


//obtener todos los usuarios
router.get('/storecode/users',(req,res)=>{
    mysqlConnection.query('SELECT*FROM usuario',(err,rows,fields)=>{
        if(!err){
            res.json(rows);

        }else{
            console.log(err);
        }
    });
});
//actualizar todos los datos del usuario
router.put('/storecode/users/:id',(req,res)=>{
    const {
         nombreUsuario, apellido1Usuario,apellido2Usuario, contraUsuario, 
         confirmaContraUsuario, telefonoUsuario,rfeUsuario, fechaNacimiento
        } =req.body;
    const { id }= req.params;

    const query= `CALL psUpdateUsuarioT('${nombreUsuario}','${apellido1Usuario}','${apellido2Usuario}','${contraUsuario}','${confirmaContraUsuario}','${telefonoUsuario}','${rfeUsuario}','${fechaNacimiento}',${id})`;

    mysqlConnection.query(query,(err,rows, fields)=>{
        if(!err){
            res.json({ status: "Los datos se actualizaron correctamente"});
        }else{
            console.log(err);
        }
    });
    
});

//insertar o actualizar los datos mercado pago del usuario
router.put('/storecode/user/mpagocredentials',(req,res)=>{
    const {
         idUsuario,
         pk_mercadopago,
         accessTokenMpago
        } =req.body;

    const query= `CALL psIMpagoData('${idUsuario}','${pk_mercadopago}','${accessTokenMpago}')`;

    mysqlConnection.query(query,(err,rows, fields)=>{
        if(!err){
            res.json({ Mensaje: "Datos de mercado pago guardados"});
        }else{
            console.log(err);
        }
    });
    
});
//Eliminado lógico
router.put('/storecode/delete/users/:id',(req,res)=>{
    
    const { id }= req.params;

    const query= `CALL psUpdateStatusUser('${id}')`;

    mysqlConnection.query(query,(err,rows,fields)=>{
        if(!err){
            res.json({status: 'Eliminado lógico realizado'});

        }else{
            console.log(err);
        }
    });
});


//Servicio para activar la cuenta del usuario
router.get('/storecode/linkactivacion',(req,res)=>{
    const link = req.query.link;
    const email = req.query.email;

    mysqlConnection.query(`SELECT idUsuario FROM usuario WHERE emailUsuario='${email}';`,(err, result)=>{
        if(!err){
            console.log(result[0].idUsuario);
            const id= result[0].idUsuario;
            const query= `CALL psEmailConfirm(${id},'${link}','${email}')`;
            mysqlConnection.query(query,(err,result)=>{
            if(!err){
               //res.json(result);
               console.log(result);
               if(result.serverStatus===2){
                  res.json({
                    message: "Cuenta activada"
                 });
               }else{
                   res.json(result);
               }
               
            
            }else{
               console.log(err);
            }
             });

        }else{
            console.log(err);
        }

    });

    
});

//obtener el Id del usuario
router.get('/storecode/getIdUserByEmail/:email',(req,res)=>{
    const {email}= req.params;

    const query =`CALL psMosIdUser('${email}')`;

    mysqlConnection.query(query,(err, result)=>{
        if(!err){
            console.log(result);
            res.json(result[0][0]);
        }else{
            console.log(err);
        }
    });
});





module.exports = router;