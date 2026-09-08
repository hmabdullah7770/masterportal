import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
  notFoundComponent(props) {
    return <div>Not Found</div>
  },
})

function App() {
  return (
    <>
      <main>
        <h1>Home</h1>
      </main>
    </>
  )
}