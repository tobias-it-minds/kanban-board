import { createFileRoute } from '@tanstack/react-router'
import { SignUpAuthScreen } from "@firebase-oss/ui-react";

export const Route = createFileRoute('/signup')({
  component: SignUp,
})

function SignUp() {
  return <SignUpAuthScreen />;
}
