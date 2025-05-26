import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="p-4">
      <div className="text-3xl">프로젝트 시작중..</div>
      <div className="mt-4"></div>
    </div>
  )
}
