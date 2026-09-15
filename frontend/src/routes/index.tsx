import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { getAuth } from "firebase/auth";
import { useState } from 'react';
import { useForm } from '@tanstack/react-form'

type Project = {
  Id: string;
  OwnerId: string;
  Name: string;
}

async function getProjects(): Promise<Project[] | undefined> {
  const user = getAuth().currentUser;
  if (user == null) return;
  const idToken = await user.getIdToken(true);

  try {
    var response = await fetch(`http://localhost:5001/projects`, {
      headers: {
        "Authorization": `Bearer ${idToken}`
      }
    });

    var result = await response.json();

    var projects: Project[] = result.Result;

    return projects;

  } catch (error) {
    console.error("GetProjects() FAILED");
    console.error(error);
  }
}

async function createProject(projectName: string) {
  const user = getAuth().currentUser;
  if (user == null) return;
  const idToken = await user.getIdToken(true);

  try {
    await fetch(`http://localhost:5001/projects/${projectName}`, {
      method: "POST",
      headers: {
        "Access-Control-Allow-Credentials": "true", // TODO: is this necessary?
        "Access-Control-Allow-Origin": "http://localhost:3001/", // TODO: dont use wildcard
        "Authorization": `Bearer ${idToken}`
      }
    });
  } catch (error) {
    console.error(error);
  }
}

export const Route = createFileRoute('/')({
  loader: () => getProjects(),
  pendingComponent: () => 'Loading...',
  component: App,
})

export function LoginButton({ isLoggedIn, setIsLoggedIn }: { isLoggedIn: boolean, setIsLoggedIn: (arg0: boolean) => void }) {
  if (isLoggedIn) {
    return <button onClick={() => {
      getAuth().signOut();
      setIsLoggedIn(false)
      //TODO: remove cached data
    }}>Logout</button>
  } else {
    return <Link to="/login">Login</Link>
  }
}

function App() {
  const projects = Route.useLoaderData();
  const [isLoggedIn, setIsLoggedIn] = useState(getAuth().currentUser != null);

  const form = useForm({
    defaultValues: {
      projectName: '',
    },
    onSubmit: async (data) => {
      createProject(data.value.projectName);
    },
  });
  return (
    <main className="page-wrap px-4 pb-8 pt-14">

      <LoginButton isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      <br /> <br />

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <form.Field
          name='projectName'
          children={(field) => {
            return (
              <>
                <label>Project Name: </label>
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </>
            )
          }}
        />
        <form.Subscribe
          children={() =>
            <>
              <button type='submit'>Create Project</button>
            </>
          }
        />
      </form>

      <ul>
        {projects?.map((project) => (
          <Link to="/projects/$projectId" key={project.Id} params={{ projectId: project.Id }}>
            <li>{project.Name}</li>
          </Link>
        ))}
      </ul>

    </main >
  )
}
