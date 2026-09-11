import { createFileRoute } from '@tanstack/react-router'

import { getAuth } from "firebase/auth";


export const Route = createFileRoute('/')({ component: App })

async function createProject(project: string) {
  const user = getAuth().currentUser;
  if (user == null) return;
  const idToken = await user.getIdToken(true);



  var response = await fetch("localhost:5001/projects", {
    method: "POST",
    body: JSON.stringify({ Name: project })
  });
}




function App() {
  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <button onClick={() => {
        createProject("Test Project")
      }
      }>Button</button>
    </main>
  )
}
