var mongoose = require('mongoose')
var Schema = mongoose.Schema

var postSchema  = new Schema({
    categoria:String,
    conteudo:String,
    imagem:String,
    slug:String,
    titulo:String,
    autor: String,
    views: Number
},{collection:'posts'})

var Posts = mongoose.model("Posts", postSchema)

module.exports = Posts