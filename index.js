const express = require('express')
const mongoose = require('mongoose')

const path = require('path')
const bodyParser = require('body-parser')
const app = express()

const Produtos = require('./Produtos.js')
var session = require('express-session')
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 77760000 }}))

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

var carrinho = [
    { quantidade: 1, produto: 'Carvão' },
    { quantidade: 1, produto: 'Isqueiro' }
]

app.post('/produtos/:slug',(req,res)=> {
    function prod(pro){
        return pro.produto === req.body.produto
    }

    if(carrinho.find(prod) == undefined){
        carrinho.push(req.body)
        req.session.car = JSON.stringify(carrinho)
        res.redirect('/carrinho') 
    } else {
        const produtoExQN = carrinho.find(prod).quantidade
        const produtoNewQN = req.body.quantidade
        const newValueQN = produtoExQN + produtoNewQN
        const newValue =  { quantidade: newValueQN, produto: req.body.produto }
        
        console.log(carrinho)

        function removeItem(arr, prop, value){
            return arr.filter(function(i) {return i[prop] !== value })
        }

        var carrinho2 = removeItem(carrinho, 'produto', req.body.produto)
        carrinho2.push(newValue)
        carrinho = carrinho2
        req.session.car = JSON.stringify(carrinho)
    }
    res.redirect('/carrinho')
})

app.get('/carrinho', (req,res) => {
    console.log(req.session.car)
    res.render('carrinho', {carrinho: req.session.car})
})

app.get('/', (req,res)=>{
    Produtos.find({}).exec(function(err, produtos){
        res.render('home', {produtos: produtos})   
    }) 
})



app.listen(3000, ()=> {
    console.log('server rodando')
})