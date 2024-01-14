const user = [
  {
    name: 'Miguel',
    age: 15
  }
]

export default function handler(req, res) {
    if (req.method === 'GET') {
      res.status(200).json(user)
    }
  
  }
  
