import { createFileRoute } from '@tanstack/react-router'
import { SignUpAuthScreen, GitHubSignInButton, GoogleSignInButton, SignInAuthScreen } from "@firebase-oss/ui-react";

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate();
  return (
    <div>
      <GoogleSignInButton onSignIn={() => navigate({ to: "/" })} />
    </div>
  )
}
