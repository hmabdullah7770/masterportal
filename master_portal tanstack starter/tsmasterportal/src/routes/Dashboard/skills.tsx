import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/Dashboard/skills')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/Dashboard/skills"!</div>
}
