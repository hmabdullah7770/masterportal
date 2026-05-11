import { createFileRoute } from '@tanstack/react-router'
import { getUser } from '../server/user'
export const Route = createFileRoute('/')({ component: App, 

  pendingComponent: () => <div>Loading...</div>,
  pendingMs:300,
  loader:async ()=>{
    const data = await getUser()
    return data
  },
  errorComponent: () => <div>Error...</div>,

  notFoundComponent(props) {
    return <div>Not Found</div>
  },
})

function App() {
  const data = Route.useLoaderData()

  return (

    <>
    <main>

      <h1>User List</h1>
      <ul>
        {data.map((user: any) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </main>
    </>
  )
}
