import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { createFileRoute, Link, redirect, useRouter } from '@tanstack/react-router'
import { getAuth, type User } from "firebase/auth";
import { SignUpAuthScreen, GitHubSignInButton, GoogleSignInButton, SignInAuthScreen } from "@firebase-oss/ui-react";
import { useState } from 'react';
import { useForm } from '@tanstack/react-form'

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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
  component: Home,
})

function LoginButton({ isLoggedIn, setUser }: { isLoggedIn: boolean, setUser: (arg0: User | null) => void }) {
  if (isLoggedIn) {
    return <button className='my-auto' onClick={() => {
      getAuth().signOut();
      setUser(null)
      //TODO: remove cached data (queryClient.invalidateQueries()?)
    }}>Logout</button>
  } else {
    return <Link className='my-auto' to="/login">Login</Link>
  }
}

function Home() {
  const [user, setUser] = useState(getAuth().currentUser);

  const navigate = Route.useNavigate();

  const projects = Route.useLoaderData();

  const router = useRouter();

  const form = useForm({
    defaultValues: {
      projectName: '',
    },
    onSubmit: async (data) => {
      // let newProject: Project = {
      //   Id = "placeholder",
      //   Name = data.value.projectName,
      //   OwnerId = "placeholder",
      // }
      // queryClient.setQueryData(['todos'], todos)
      await createProject(data.value.projectName);
      router.invalidate();
    },
  });

  if (user == null) {
    return (
      <main className='w-[384px] mx-auto pt-[40px] bg-[var(--page-bg)]'>
        <br />
        <h1 className='text-[32px]'>Welcome</h1>
        <p className='text-[16] text-[var(--tertiary)]'>Log in to your account</p>
        <br />
        <div className='grid gap-[8px]'>
          <GoogleSignInButton onSignIn={() => setUser(getAuth().currentUser)} />
          <GitHubSignInButton onSignIn={() => setUser(getAuth().currentUser)} />
        </div>
      </main>
    )
  }

  return (
    <main >
      <nav className='w-[var(--width)] h-[50px] flex flex-row place-content-between m-auto'>
        <h1 className='app-name my-auto'>Kanvas</h1>
        <button className='my-auto' onClick={() => {
          getAuth().signOut();
          setUser(null)
          //TODO: remove cached data (queryClient.invalidateQueries()?)
        }}>Logout</button>
      </nav>

      <hr className='text-[var(--border)]' />

      <div className='w-[var(--width)] m-auto'>
        <p className="page-greeting text-[var(--tertiary)] mt-[16px]">Good Morning,</p>
        <h1 className="dashboard-heading mb-[40px]">{user?.displayName}</h1>

        <div className='flex place-content-between  my-[16px]'>
          <h1 className='section-heading'>Projects</h1>
          <Dialog>
            <DialogTrigger>
              <h1 className='section-heading text-[var(--brand)]'>+ New project</h1>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Edit Project</DialogTitle>
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
            </DialogContent>
          </Dialog>

        </div>

        <ul className='grid grid-cols-2 gap-[30px]'>
          {projects?.map((project) => (
            <Link to="/projects/$projectId" key={project.Id} params={{ projectId: project.Id }}>

              <Card>
                <CardHeader>
                  <CardTitle>{project.Name}</CardTitle>
                </CardHeader>
                {/*
                  <CardDescription>Card Description</CardDescription>
                  <CardAction>Edit</CardAction>
                <CardContent>
                  <p>Card Content</p>
                </CardContent>
                <CardFooter>
                  <p>Card Footer</p>
                </CardFooter>
                */}
              </Card>

            </Link>
          ))}
        </ul>

      </div>
    </main >
  )
}
