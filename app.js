const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const handlebars = require('express-handlebars');
const app = express();
const urlencodeParser = bodyParser.urlencoded({ extended: false });

const sql = mysql.createConnection({

    host: 'localhost',
    port: 3306,
    user: 'root',
    password: ''

});

sql.query("use drip_restes");

//Template engine
app.engine("handlebars", handlebars({ defaultLayout: 'main' }));

app.set('view engine', 'handlebars');
app.use('/img', express.static('img'));
app.use('/css', express.static('css'));
app.use('/js', express.static('js'));

//Routes and Templates
app.get("/", function (req, res) {
    /* res.send("teste send");*/
    /*res.sendFile(__dirname + "/index.html");*/
    // console.log(req.params.id);
    res.render('index');
});



app.get("/inserir", function (req, res) { res.render("inserir"); });


//Read - select - 
app.get("/select/:id?", function (req, res) {
    if (!req.params.id) {
        sql.query("select * from cliente order by cliente_id asc", function (err, results, fields) {
            res.render('select', { data: results })
        });
    } else {
        sql.query("select * from cliente where cliente_id=? order by cliente_id asc ", [req.params.id], function (err, results, fields) {
            res.render('select', { data: results })
        });
    }
});

//Create-Insert
app.post("/controllerForm", urlencodeParser, function (req, res) {
    // console.log(req.body.name)
    sql.query("insert into cliente values(?,?,?,?,?,?,?,?,?)", [
        req.body.id,
        req.body.endereco_cliente,
        req.body.nome_cliente,
        req.body.cel_cliente,
        req.body.email_cliente,
        req.body.senha_cliente,
        req.body.datanasc_cliente,
        req.body.rg_cliente,
        req.body.cpf_cliente
    ]);

    res.render('controllerForm');
});



//Delete
app.get('/deletar/:id', function (req, res) { sql.query("delete from cliente where cliente_id=?", [req.params.id]); res.render('deletar'); });




//Update trazer dados preenchidos
app.get("/update/:id", function (req, res) {
    sql.query("select * from cliente where cliente_id=?", [req.params.id], function (err, results, fields) {
        res.render('update', {id: req.params.id, 
            endereco_cliente: results[0].endereco_cliente, 
            nome_cliente: results[0].nome_cliente, 
            age: results[0].age, 
            cel_cliente: results[0].cel_cliente, 
            email_cliente: results[0].email_cliente, 
            senha_cliente: results[0].senha_cliente, 
            datanasc_cliente: results[0].datanasc_cliente, 
            rg_cliente: results[0].rg_cliente, 
            cpf_cliente: results[0].cpf_cliente});
    });
});

//Atualizar dados
app.post("/controllerUpdate", urlencodeParser, function (req, res) {
    sql.query("update cliente set endereco_cliente=?, nome_cliente=?, cel_cliente=?, email_cliente=?, senha_cliente=?, datanasc_cliente=?, rg_cliente=?, cpf_cliente=? where cliente_id=?",
    [req.body.endereco_cliente, 
        req.body.nome_cliente, 
        req.body.cel_cliente, 
        req.body.email_cliente, 
        req.body.senha_cliente, 
        req.body.datanasc_cliente,
        req.body.rg_cliente, 
        req.body.cpf_cliente, 
        req.body.id]);
    res.render("/controllerUpdate");
});




//Start server
app.listen(3000, function (req, res) { console.log('Servidor está rodando'); });