import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/Dashboard/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/Dashboard/settings"!</div>
}
