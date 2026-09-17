import { createFileRoute } from '@tanstack/react-router'
import { SignUpAuthScreen, GitHubSignInButton, GoogleSignInButton, SignInAuthScreen } from "@firebase-oss/ui-react";

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate();

  return (
    <main className='w-[384px] m-auto'>
      <br />
      <h1>Welcome</h1>
      <br />
      <div className='flex flex-col'>
        <GoogleSignInButton onSignIn={() => navigate({ to: "/" })} />
      </div>
    </main>
  )
}
