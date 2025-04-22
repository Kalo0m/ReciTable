import { UserButton } from '@clerk/tanstack-react-start'
import { getAuth } from '@clerk/tanstack-react-start/server'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getWebRequest } from '@tanstack/react-start/server'

const fetchClerkAuth = createServerFn({ method: 'GET' }).handler(async () => {
  const { userId } = await getAuth(getWebRequest()!)

  return {
    userId,
  }
})

export const Route = createFileRoute('/_authed')({
  component: RouteComponent,
  beforeLoad: async () => {
    const { userId } = await fetchClerkAuth()
    if (!userId)
      throw redirect({
        to: '/sign-in',
      })
    return {
      userId,
    }
  },
})

function RouteComponent() {
  return (
    <div>
      <Outlet />
      <div className="absolute top-8 right-8">
        <UserButton />
      </div>
    </div>
  )
}
