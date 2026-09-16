import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
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

function LoginButton({ isLoggedIn, setIsLoggedIn }: { isLoggedIn: boolean, setIsLoggedIn: (arg0: boolean) => void }) {
  if (isLoggedIn) {
    return <button className='' onClick={() => {
      getAuth().signOut();
      setIsLoggedIn(false)
      //TODO: remove cached data (queryClient.invalidateQueries()?)
    }}>Logout</button>
  } else {
    return <Link to="/login">Login</Link>
  }
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(getAuth().currentUser != null);
  // if (!isLoggedIn) throw redirect({ to: '/login' });

  const projects = Route.useLoaderData();

  const router = useRouter();

  const form = useForm({
    defaultValues: {
      projectName: '',
    },
    onSubmit: async (data) => {
      await createProject(data.value.projectName);
      router.invalidate();
    },
  });
  return (
    <main >
      <nav className='w-[var(--width)] h-[50px] flex flex-row place-content-between m-auto'>
        <h1>Kanvas</h1>
        <LoginButton isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      </nav>

      <hr className='text-[var(--border)]' />

      <div className='w-[var(--width)] m-auto'>
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

        <ul className='grid grid-cols-2 gap-[30px]'>
          {projects?.map((project) => (
            <Link to="/projects/$projectId" key={project.Id} params={{ projectId: project.Id }}>
              <div>
                <li className='bg-[var(--card-bg)] w-[484px] h-[159px] border-[var(--border)] border-3 border rounded-[16px]'>{project.Name}</li>
              </div>
            </Link>
          ))}
        </ul>
      </div>
    </main >
  )
}
