import { createFileRoute } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'

import { getAuth } from "firebase/auth";

type Project = {
  Id: string;
  OwnerId: string;
  Name: string;
}
export const Route = createFileRoute('/')({ component: App })

async function getProjects(): Promise<Project[] | undefined> {
  const user = getAuth().currentUser;
  if (user == null) throw new Error();
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
    console.error(error);
  }

}

async function createProject(projectName?: string) {
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

function App() {
  // localStorage.getItem

  // const [token, setToken] = useState(null);
  // useEffect(() => {
  //   const auth = getAuth();
  //   const user = auth.currentUser;
  //   // var idToken: string | null = null;
  //   if (user != null) {
  //     (async () => {
  //     setToken(await user.getIdToken(true));
  //     })()
  //   } else {
  //     setToken(null);
  //   }
  // }, [token]);

  // const navigate = Route.useNavigate();
  // navigate({ to: "/login" });

  const { data, isSuccess, isPending, error } = useQuery({
    queryKey: ['fetch-projects'],
    queryFn: () => getProjects()
    // queryFn: () => Promise.resolve(5),
  })

  if (error) {
    return 'An error has occurred: ' + error.message
  }


  if (isPending) {
    return 'Loading...'
  }


  if (isSuccess) {
    return (<ul>
      {data?.map((project) => (
        <Link to="/projects/${project.Id}"><li key={project.Id}>{project.Name}</li></Link>
      ))}
    </ul>)
  }
  // A component was suspended by an uncached promise. Creating promises inside a Client Component or hook is not yet supported, except via a Suspense-compatible library or framework.

  // const createProjectForm = useForm({
  //   defaultValues: {
  //     projectName: 'DefaultProjectName',
  //   },
  //   onSubmit: async ({ value }) => {
  //     createProject("TANSTACK");
  //     console.log(value);
  //   },
  // })

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <Link to="/login">Login</Link>
      <br /> <br />
      <button onClick={() => getAuth().signOut()}>Logout</button>
      <br /> <br />
      <button onClick={() => createProject("newProject")}>Create Project</button>
      <br /> <br />
      <button onClick={() => getProjects()}>Get Projects</button>
      <br /> <br />

      {/*
      <ul>
        {data?.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
      */}

      {/*
      <form onSubmit={(e) => {
        createProjectForm.handleSubmit()
        console.log(e);
      }}>
        <createProjectForm.Field name="projectName" children={(field) => {
          return (
            <>
              <input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <br />
            </>
          )
        }} />
        <createProjectForm.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <>
              <button type="submit" disabled={!canSubmit}>
                {isSubmitting ? '...' : 'Submit'}
              </button>
            </>
          )}
        />
      </form>
      */}

    </main >
  )
}
