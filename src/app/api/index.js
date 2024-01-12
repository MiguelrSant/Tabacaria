const express = require('express')
const app = express()

const users= [
    {
        name: 'Miguel',
        age: 15
    }
]

app.get('/users', (req, res)=> {
    res.json(users[0])
})

app.listen(5000, ()=> {
    console.log('server rodando')
})