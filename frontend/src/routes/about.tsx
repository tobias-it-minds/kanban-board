import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  loader: async () => {
    const res = await fetch('localhost:5000/weatherforecast')
    // if (!res.ok) throw new Error('Failed to fetch posts')
    if (!res.ok) console.log("failed")
    console.log("failed")
    return res.json()
  },
  component: About,
})

function About() {
  const data = Route.useLoaderData()
  console.log(data)
  return (
    <h1>about</h1>
  )
}
