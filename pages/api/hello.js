'use server'

const user = [
  {
    name: 'Miguel',
    age: 26
  }
]

export default function handler(req, res) {
      res.status(200).json(user)
  }
  
