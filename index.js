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
    Produtos.findOne({ slug: req.params.slug }).exec(function(err,resposta) {
        if(resposta != null){
            res.render('slug',{produto:resposta})
        }else {
            res.redirect('/')
        }
    })

    
})

app.get('/carrinho', (req,res) => {
    
    Produtos.find({}).exec(function(err, produtos) {   
        res.render('carrinho', {produtos:produtos})
    })

})

app.get('/', (req,res)=>{
    Produtos.find({}).exec(function(err, produtos){
        res.render('home', {produtos: produtos})   
    }) 
})



app.listen(3000, ()=> {
    console.log('server rodando')
})