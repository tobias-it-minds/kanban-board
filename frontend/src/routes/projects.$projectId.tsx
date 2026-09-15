import { createFileRoute } from '@tanstack/react-router'
import { getAuth } from 'firebase/auth';

type Card = {
  Id: string;
  Content: string;
  ColumnId: string;
}

type Column = {
  Id: string;
  Name: string;
  Cards: Card[];
}

async function createColumn(projectId: string) {
  const user = getAuth().currentUser;
  if (user == null) return;
  const idToken = await user.getIdToken(true);

  try {
    await fetch(`http://localhost:5001/projects/${projectId}/columns/newColumn`, {
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

async function getColumns(projectId: string): Promise<Column[] | undefined> {
  const user = getAuth().currentUser;
  if (user == null) {
    console.log("User is not logged in")
    return;
  }
  const idToken = await user.getIdToken(true);

  try {
    var response = await fetch(`http://localhost:5001/projects/${projectId}/columns/`, {
      headers: {
        "Authorization": `Bearer ${idToken}`
      }
    });

    var columns: Column[] = await response.json();

    console.log(`Columns: ${columns}`);

    return columns;

  } catch (error) {
    console.error(error);
  }
}

async function createCard(projectId: string, columnId: string, content: string) {
  const user = getAuth().currentUser;
  if (user == null) return;
  const idToken = await user.getIdToken(true);

  try {
    await fetch(`http://localhost:5001/projects/${projectId}/columns/${columnId}/cards/${content}`, {
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

export const Route = createFileRoute('/projects/$projectId')({
  loader: ({ params }) => getColumns(params.projectId),
  pendingComponent: () => "Loading...",
  component: RouteComponent,
})

function RouteComponent() {
  const { projectId } = Route.useParams();

  var columns = Route.useLoaderData();

  return (
    <div>
      <div>Hello "/projects/$projectId"!</div>
      <br /> <br />
      <button onClick={() => createColumn(projectId)}>Create Column</button>
      <ul>
        {columns?.map((column) => (
          <div key={column.Id}>
            <li >{column.Name}</li>
            <ul>
              {column.Cards.map((card) => (
                <li key={card.Id}>{card.Content}</li>
              ))}
            </ul>
            <button onClick={() => createCard(projectId, column.Id, "cardContent")}>New Card</button>
          </div>
        ))}
      </ul>
    </div>
  )
}
