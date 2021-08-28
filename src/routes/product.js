const express = require('express');
const router = express.Router();
const mysqlConnection = require('../database');
const multer = require('multer');
const path = require('path');
const { query } = require('../database');


//SET STORAGE Engine
var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './img/public/products/');
    },
    filename: function(req, file, cb){
        const ext = file.mimetype.split('/')[1];
        cb(null, file.originalname + '-'+ Date.now()+path.extname(file.originalname));
        
    }
});

  //En caso de un cambio de red, editar la IP 
const baseUrlImage= 'http://192.168.1.72:3000';
const upload = multer({
    storage: storage,
    fileFilter: function(req,file,cb){
        checkFileType(file,cb);
    }
}).single('image');

//subir multiples imagenes 
const uploadImages = multer({
    storage: storage,
    fileFilter: function(req,file,cb){
        checkFileType(file,cb);
    }
}).array("images[]",4);
//Check file type
function checkFileType(file,cb){
    //allowed filetypes
    const filetypes= /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLocaleLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if(mimetype && extname){
        return cb(null, true);
    }else{
        cb('Error, solo se aceptan imágenes');
    }
}

//subir imagenes complementarias del producto
router.post('/storecode/upload/images',(req, res, next)=>{
    uploadImages(req,res,(err)=>{
        if(err){
            res.json({message: err});
        }else{
            console.log('files', req.files);
            
            
            //Guardar el producto
            
            const files = req.files;
            
            if (!files) {
                const error = new Error('Por favor, sube una imagen')
                error.httpStatusCode = 400
                return next(error)
                
            }else{
                const {idProducto} = req.body;
                const image1 = getImagePath(req.files[0]);
                const image2 = getImagePath(req.files[1]);
                const image3 = getImagePath(req.files[2]);
                const image4 = getImagePath(req.files[3]);

                console.log(image1);
                console.log(image2);
                console.log(image3);
                console.log(image4);
                //query
                const query = `CALL psInserImgs(${idProducto},'${image1}','${image2}','${image3}','${image4}')`
                mysqlConnection.query(query,(err)=>{
                    if(!err){
                        
                        res.json({
                            "idProducto": idProducto,
                            "imagen1": image1,
                            "imagen2": image2,
                            "imagen3" : image3,
                            "imagen4": image4
                        });
                        
                    }else{
                        console.log(err);
                        res.json({
                            message: err
                        });
                    }
                });
            }
        }    
    });
});

//actualizar imagenes complementarias del producto
router.put('/storecode/upload/images/update/:idProducto',(req, res, next)=>{
    const {idProducto} = req.params;

    const { img1, img2, img3, img4 } = req.body;

   
    //query
    const query = `CALL psActualizarImgsProd(${idProducto},'${img1}','${img2}','${img3}','${img4}')`
    mysqlConnection.query(query, (err) => {
        if (!err) {

            res.json({
                "idProducto": idProducto,
                "imagen1": img1,
                "imagen2": img2,
                "imagen3": img3,
                "imagen4": img4
            });

        } else {
            console.log(err);
            res.json({
                message: err
            });
        }
    });
});
//metodo para obtener la ruta de la imagen
function getImagePath(image){
    var reExp= /\\/g;
            const complementUrl= image.path.substring(3).replace(reExp,'/');
            const pathImage = `${baseUrlImage}${complementUrl}`;
            return pathImage;
}

//subir un producto
router.post('/storecode/upload', (req, res, next) => {
    upload(req,res,(err)=>{
        if(err){
            res.json({message: err});
            console.log(err);
        }else{
            var reExp= /\\/g;
            const complementUrl= req.file.path.substring(3).replace(reExp,'/');
            const imageProducto = `${baseUrlImage}${complementUrl}`;
            //Guardar el producto
            console.log(req.file);     
            console.log(imageProducto);
            const file = req.file
            if (!file) {
                const error = new Error('Por favor, sube una imagen')
                error.httpStatusCode = 400
                return next(error)
                
            }else{
                const {nombreProducto,desProducto,precioUnitario,cantidadProducto,
                marca,categoria,idUsuario}= req.body;
                const query = `CALL psInsertProducto('${nombreProducto}','${desProducto}',${precioUnitario},${cantidadProducto},
                '${imageProducto}',${marca},${categoria},${idUsuario})`;

                mysqlConnection.query(query,(err,rows)=>{
                    if(!err){
                        console.log(rows[0]);
                        res.json(rows[0]);
                        
                    }else{
                        console.log(err);
                    }
                });
                console.log(req.file);
                //res.send(req.file);
            }       
    }    
    });
    
});

//subir una imagen y regresar su ruta
router.post('/storecode/upload/image', (req, res, next) => {
    upload(req,res,(err)=>{
        if(err){
            res.json({message: err})
        }else{
            var reExp= /\\/g;
            const complementUrl= req.file.path.substring(3).replace(reExp,'/');
            const pathImage = `${baseUrlImage}${complementUrl}`;
            //Guardar el producto
            console.log(req.file);     
            console.log(pathImage);
            const file = req.file
            if (!file) {
                const error = new Error('Por favor, sube una imagen')
                error.httpStatusCode = 400
                return next(error)
                
            }else{
                res.json({
                    "pathImage": pathImage
                });
            }       
    }    
    });
    
});


//actualizar producto
router.put('/storecode/product/update/:id', (req, res, next) => {
    const {id} = req.params;
    upload(req,res,(err)=>{
        if(err){
            res.json({message: err})
        }else{
            //const baseUrlImage= 'http://192.168.1.66:3000';
            var reExp= /\\/g;
            const complementUrl= req.file.path.substring(3).replace(reExp,'/');
            const imageProducto = `${baseUrlImage}${complementUrl}`;
            //Guardar el producto
            console.log(req.file);     
            console.log(imageProducto);
            const file = req.file
            if (!file) {
                const error = new Error('Por favor, sube una imagen')
                error.httpStatusCode = 400
                return next(error)
                
            }else{
                const {nombreProducto,desProducto,precioUnitario,cantidadProducto,
                marca,categoria}= req.body;
                const query = `CALL psActualizarProdcuto('${nombreProducto}','${desProducto}',${precioUnitario},
                '${imageProducto}',${cantidadProducto},${marca},${categoria},${id})`;

                mysqlConnection.query(query,(err,rows)=>{
                    if(!err){
                        console.log(rows[0]);
                        res.json(rows[0]);
                        
                    }else{
                        console.log(err);
                    }
                });
                //res.send(req.file);
            }       
    }    
    });
    
});



//obtener todos los productos
router.get('/storecode/products',(req,res)=>{
    mysqlConnection.query('CALL psMosProducto()',(err,rows,fields)=>{
        if(!err){
            res.json(rows[0]);
            console.log(rows[0]);

        }else{
            console.log(err);
        }
    });
});

//obtener los productos filtrados por usuario
router.get('/storecode/products/byuser/:id',(req,res)=>{
    const {id} = req.params;
    mysqlConnection.query(`CALL psMosProdToUser(${id})`,(err,rows,fields)=>{
        if(!err){
            res.json(rows[0]);
            console.log(rows[0]);

        }else{
            console.log(err);
        }
    });
});

//obtener las imagenes adicionales de un producto

router.get('/storecode/products/imagesc/:idProducto',(req,res)=>{
    const {idProducto} = req.params;

    mysqlConnection.query(`CALL psMosActuImgsc(${idProducto})`,(err,rows)=>{
        if(!err){
            //Agregar un dos ceros para que devuelva el puro objeto json
            res.json(rows[0][0]);
            console.log(rows[0]);
        }else{
            console.log(err);
            res.json(
                {"Error":err}
            );
        }
    });
});

//obtener los productos filtrados por el id de usuario
router.get('/storecode/products/iduser/:iduser',(req,res)=>{
    const { iduser } = req.params;
    
    mysqlConnection.query(`CALL psMosProdaUsuario(${iduser})`,(err,rows,fields)=>{
        if(!err){
            res.json(rows[0]);
        }else{
            res.json(rows[0]);
            console.log(err);
        }
    });
});

//actualizar datos del producto filtrado por el id de producto (Cuando no se cambia la imagen)
router.put('/storecode/products/:idProducto',(req,res)=>{
    const {
          nombreProducto,desProducto, precioUnitarioProducto,
          imagenProducto, stockRealProducto,
          idMarca, idCategoria
        } =req.body;
    const { idProducto }= req.params;

    const query= `CALL psActualizarProdcuto('${nombreProducto}','${desProducto}',${precioUnitarioProducto},'${imagenProducto}',${stockRealProducto},${idMarca},${idCategoria},${idProducto})`;

    mysqlConnection.query(query,(err,rows, fields)=>{
        if(!err){
            res.json({ status: "Los datos del producto se actualizaron correctamente"});
        }else{
            console.log(err);
        }
    });
    
});

// eliminado logico
router.put('/storecode/delete/products/:id',(req,res)=>{
    
    const { id }= req.params;

    const query= `CALL psEliProduct('${id}')`;

    mysqlConnection.query(query,(err,rows,fields)=>{
        if(!err){
            res.json({status: 'Se eliminó el producto correctamente'});

        }else{
            console.log(err);
        }
    });
});



module.exports = router;