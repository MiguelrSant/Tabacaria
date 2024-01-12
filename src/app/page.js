import axios from "axios"

const app = async ()=>{
  const data = await fetch('http://localhost:5000/users')
  const todos = await data.json()
  return todos
}


export default async function Home() {
  const user = await app()
  console.log(user)
  return (
    <>
      <h1>{user.name}</h1>
      <h1>{user.age}</h1>
    </>
  )
}
