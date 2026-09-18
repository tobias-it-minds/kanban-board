import { createFileRoute } from '@tanstack/react-router'
import { SignUpAuthScreen, GitHubSignInButton, GoogleSignInButton, SignInAuthScreen } from "@firebase-oss/ui-react";

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate();

  return (
    <main className='w-[384px] mx-auto pt-[40px] bg-[var(--page-bg)]'>
      <br />
      <h1 className='text-[32px]'>Welcome</h1>
      <p className='text-[16] text-[var(--tertiary)]'>Log in to your account</p>
      <br />
      <div className='grid gap-[8px]'>
        <GoogleSignInButton onSignIn={() => navigate({ to: "/" })} />
        <GitHubSignInButton onSignIn={() => navigate({ to: "/" })} />
      </div>
    </main>
  )
}
