const express = require('express')
const mongoose = require('mongoose')

const path = require('path')
const bodyParser = require('body-parser')
const app = express()

const Posts = require('./Posts.js')
var session = require('express-session')

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

app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))

app.get('/', (req,res)=>{

    if(req.query.busca == null) {
        Posts.find().sort({ '_id': -1 }).limit(3).exec(function(err, posts) {
            posts = posts.map(function(val){
                return {
                    titulo: val.titulo,
                    conteudo: val.conteudo,
                    descricaoCurta: val.conteudo.substr(0, 250),
                    descricaoMtCurta: val.conteudo.substr(0, 100),
                    imagem: val.imagem,
                    slug: val.slug,
                    categoria: val.categoria,   
                    views: val.views
                }
            })


            Posts.find({}).sort({'views': -1}).limit(3).exec(function(err,postsTop){
    
                    postsTop = postsTop.map(function(val){
    
                            return {

                                titulo: val.titulo,
                                conteudo: val.conteudo,
                                descricaoCurta: val.conteudo.substr(0,100),
                                descricaoMtCurta: val.conteudo.substr(0, 100),
                                imagem: val.imagem,
                                slug: val.slug,
                                categoria: val.categoria,
                                views: val.views
                            }
    
                    })
    
                    res.render('index',{posts:posts,postsTop:postsTop});
                    console.log(posts[0].views)
    
    
                })
            

        })

    }else {

        Posts.find({titulo: {$regex: req.query.busca,$options:"i"}},function(err,posts){

            posts = posts.map(function(val){
        
                return {

                    titulo: val.titulo,
                    conteudo: val.conteudo,
                    descricaoCurta: val.conteudo.substr(0,100),
                    descricaoMtCurta: val.conteudo.substr(0, 100),
                    imagem: val.imagem,
                    slug: val.slug,
                    categoria: val.categoria,
                    views: val.views
                }

        })

            res.render('busca', {posts: posts, contagem:posts.length, busca: req.query.busca})
        })

        
       
    }
})

app.get('/:slug', (req,res)=> {

        Posts.findOneAndUpdate({slug: req.params.slug}, {$inc : {views: 1},}, {new: true}, function(err, resposta){

            if(resposta != null){
                Posts.find({}).sort({'views': -1}).limit(3).exec(function(err,postsTop){
        
                    postsTop = postsTop.map(function(val){
       
                            return {
    
                                titulo: val.titulo,
                                conteudo: val.conteudo,
                                descricaoCurta: val.conteudo.substr(0,100),
                                descricaoMtCurta: val.conteudo.substr(0, 100),
                                imagem: val.imagem,
                                slug: val.slug,
                                categoria: val.categoria,
                                views: val.views
                            }
       
                    })
       
                    res.render('single',{noticia:resposta,postsTop:postsTop});
       
       
                })
            } else {
                res.redirect('/')
            }
        })
  
        

})

const user =[
    {
        name: "Miguel",
        senha: "123456"
    }
]

app.post('/admin/login',(req,res)=> {
    user.map(function(val){
        if(val.name == req.body.name && val.senha == req.body.senha){
            req.session.login = "Miguel"
            
        } 
    })
    res.redirect('/admin/login') 
})

app.post('/admin/cadastrar', (req,res)=> {
    console.log(req.body)
    
    Posts.create({
        categoria: req.body.categoria,
        conteudo: req.body.descricao,
        imagem: req.body.img,
        slug: req.body.slug,
        titulo: req.body.titulo,
        autor: req.body.autor,
        views: 0
    })

    res.redirect('/admin/login')
})

app.get('/admin/deletar/:id',(req,res)=>{
    Posts.deleteOne({_id:req.params.id}).then(function(){
        res.redirect('/admin/login')

    });
})

app.get('/admin/login',(req,res)=>{
    if(req.session.login == null){
        res.render('admin-login')
    }if(req.session.login == "Miguel"){
        Posts.find().sort({ '_id': -1 }).exec(function(err, posts) {
            posts = posts.map(function(val){
                return {
                    id: val._id,
                    titulo: val.titulo,
                    conteudo: val.conteudo,
                    descricaoCurta: val.conteudo.substr(0, 250),
                    descricaoMtCurta: val.conteudo.substr(0, 100),
                    imagem: val.imagem,
                    slug: val.slug,
                    categoria: val.categoria,    
                    views: val.views
                }
            })

            res.render('admin-painel', {posts: posts})
            
        })
    }
    
})

app.listen(5000, ()=> {
    console.log('server rodando')
})