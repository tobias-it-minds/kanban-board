import { createFileRoute } from '@tanstack/react-router'
import { SignUpAuthScreen, GitHubSignInButton, GoogleSignInButton, SignInAuthScreen } from "@firebase-oss/ui-react";

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <GoogleSignInButton />
    </div>
  )
}
