const express = require('express')
const mongoose = require('mongoose')

const path = require('path')
const bodyParser = require('body-parser')
const app = express()

const Produtos = require('./Produtos.js')
var session = require('express-session')
app.use(session(
        { 
        secret: 'keyboard',
        cookie: {
            maxAge: 77760000 
            }
        }
        
    ))

mongoose.connect('mongodb+srv://BancoDeDados:XBrxuYb70m5jnUij@cluster0.le3akws.mongodb.net/Miguel?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true}).then(function(){
    console.log('conectado')
}).catch(function(err){
    console.log(err.message)
})


app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')
app.use('/public', express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))

app.use( bodyParser.json() )
app.use( bodyParser.urlencoded({
    extended: true
}) )

app.get('/produtos/:slug', (req,res)=> {
    Produtos.findOneAndUpdate({slug: req.params.slug}, {$inc : {views: 1}}, {new: true}, function(err,resposta) {
        console.log(resposta)
        if(resposta != null){
            res.render('slug',{produto:resposta})
        }else {
            res.redirect('/')
        }
    })

    
})

app.get('/busca/', (req,res)=> {
        Produtos.find({nome: {$regex: req.query.busca,$options:"i"}},function(err,produtos){
            res.render('busca',{produtos:produtos, contagem:produtos.length});
        })
})

app.get('/carrinho', (req,res) => {
    
    Produtos.find({}).exec(function(err, produtos) {   
        res.render('carrinho', {produtos:produtos})
    })

})

app.get('/', (req,res)=>{
        Produtos.find({nome: {$regex: 'Vape',$options:"i"}}).limit(5).exec(function(err, vapes){
            Produtos.find({nome: {$regex: 'Isqueiro',$options:"i"}}).limit(5).exec(function(err, isquerio){
                res.render('home', { vapes:vapes, isquerio: isquerio})  
            })
        })
         
})

var users = {
        login: 'Miguel',
        password: '123456'
    }

app.post('/admin/login', (req,res) => {
    if(users.login == req.body.login && users.password == req.body.password){
        req.session.login = "Miguel"
    }

    res.redirect('/admin/painel')
})

app.get('/admin/deletar/:id', (req,res) => {
    Produtos.deleteOne({_id:req.params.id}).then(function() {
        res.send('Produto deltado com o id: ' + req.params.id)
    })
    
})

app.post('/admin/cadastro', (req,res) => {
    Produtos.create({
        preco:req.body.preco,
        imagem:req.body.imagem,
        slug:req.body.slug,
        nome: req.body.titulo,
        views: 0
    })
    res.send('Cadastrada!')

})

app.get('/admin/login', (req,res)=> {
    if(req.session.login == "Miguel"){
        res.redirect('/admin/painel')
    } else{
        res.render('admin-login')
        
    }
})


app.get('/admin/painel', (req,res)=> {
    if(req.session.login == "Miguel"){
        Produtos.find({}).exec(function(err, produtos){
            res.render('admin-painel', {produtos: produtos})
        })
    } else{
        res.redirect('/admin/login')
        
    }
})


app.listen(3000, ()=> {
    console.log('server rodando')
})

