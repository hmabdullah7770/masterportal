import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/users/$username/skills/$skillId')({
  component: RouteComponent,
})

function RouteComponent() {
   const {username, skillId} = Route.useParams()

  return <div>Hello "/users/{username}/skills/{skillId}"!</div>
}
