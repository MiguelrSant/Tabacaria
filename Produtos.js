var mongoose = require('mongoose')
var Schema = mongoose.Schema

var postSchema  = new Schema({
    preco:Number,
    imagem:String,
    slug:String,
    nome: String,
    views: Number
},{collection:'posts'})

var Produtos = mongoose.model("Produtos", postSchema)

module.exports = Produtos