const express = require('express');
const app= express();
const cors = require('cors');

const bodyparser = require('body-parser');



const {config} = require('../config/index');


//public folder
app.use(express.static('./img'));
//
app.get('/',function(req,res){
    res.send('Servidor de storecode')
});

//

//midleware
app.use(cors());
app.use(express.json());

app.use(require('./routes/user'));
app.use(require('./routes/product'));
app.use(require('./routes/brand'));
app.use(require('./routes/category'));
app.use(require('./routes/imageProduct'));
app.use(require('./routes/detaproductocomen'));
app.use(require('./routes/card'));
app.use(require('./routes/mercadopago'));
app.use(require('./routes/venta'));
app.use(require('./routes/push_notifications'));


app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

//uploads file
//app.use(express.static(__dirname));

app.listen(config.port, function(){
    console.log(`Listening http://localhost:${config.port}`);
});