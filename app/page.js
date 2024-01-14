async function getUser() {
  const res = await fetch('http://localhost:3000/api/hello', { next: { revalidate: 10 } })  
  const repo = await res.json()
  return repo
}
export default async function Home() {
  const data = await getUser()

  return (
   <>
    <ul>
    {data.map((users) => (
      <>
        <li key={'name'}>{users.name}</li>
        <li key={'age'}>{users.age}</li>

      </>  
      ))}
    </ul>
   </>
  )
}

