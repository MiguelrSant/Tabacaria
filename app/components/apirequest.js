const getUser = async () => {
    try{
      const res = await fetch('http://localhost:3000/api/hello')
      const repo = await res.json()
      return repo
    } catch (error) {
      console.error(error);
    }
    
  }
  export default async function ApiRequest() {
    const data = await getUser()
    return (
        <>
            {data.map((users) => (
              <ul key={'lista'}>
                <li key={'name'}>{users.name}</li>
                <li key={'age'}>{users.age}</li>
              </ul> 
            ))}
        </>
    )
  }
  
  