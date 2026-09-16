import { createFileRoute, useRouter } from '@tanstack/react-router'
import { getAuth } from 'firebase/auth';
import { useForm } from '@tanstack/react-form'

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

async function createColumn(projectId: string, columnName: string) {
  console.log("from create column")
  const user = getAuth().currentUser;
  if (user == null) {
    console.log("User is not logged in")
    return;
  }
  const idToken = await user.getIdToken(true);

  try {
    const response = await fetch(`http://localhost:5001/projects/${projectId}/columns/${columnName}`, {
      method: "POST",
      headers: {
        "Access-Control-Allow-Credentials": "true", // TODO: is this necessary?
        "Access-Control-Allow-Origin": "http://localhost:3001/", // TODO: dont use wildcard
        "Authorization": `Bearer ${idToken}`
      }
    });

    console.log("createColumn response: ", response);

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

    console.log("Columns: ", columns);

    return columns;

  } catch (error) {
    console.error(error);
  }
}

async function createCard(projectId: string, columnId: string, content: string) {
  const user = getAuth().currentUser;
  if (user == null) {
    console.log("User is not logged in")
    return;
  }
  const idToken = await user.getIdToken(true);

  try {
    await fetch(`http://localhost:5001/projects/${projectId}/columns/${columnId}/cards/${content}`, {
      method: "POST",
      headers: {
        "Access-Control-Allow-Credentials": "true", // TODO: is this necessary?
        "Access-Control-Allow-Origin": "http://localhost:3001/", // TODO: dont use wildcard
        "Authorization": `Bearer ${idToken}`
      }
      // TODO: add body
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

  const columns = Route.useLoaderData();

  const router = useRouter();

  const columnForm = useForm({
    defaultValues: {
      columnName: '',
    },
    onSubmit: async (data) => {
      await createColumn(projectId, data.value.columnName);
      router.invalidate();
    },
  });

  const cardForm = useForm({
    defaultValues: {
      cardContent: '',
      columnId: '',
    },
    onSubmit: async (data) => {
      await createCard(projectId, data.value.columnId, data.value.cardContent);
      router.invalidate();
    },
  });

  return (
    <main className='h-[100vh] bg-[var(--column-bg)]'>
      <form
        className='h-[56px] border rounded-[16px] border-[var(--border)]'
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          columnForm.handleSubmit()
        }}
      >
        <columnForm.Field
          name='columnName'
          children={(field) => {
            return (
              <>
                <label>Column Name: </label>
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
        <columnForm.Subscribe
          children={() =>
            <button type='submit'>Create Column</button>
          }
        />
      </form>

      <ul className='flex flex-nowrap flex-row mx-auto overflow-scroll scrollbar-auto scrollbar-thin h-[calc(100%-56px)]'>
        {columns?.map((column) => (
          <div key={column.Id} className='min-w-[384px] bg-[var(--column-bg)] border-[var(--border)] border-1 border'>
            <br />
            <li className='border rounded-[16px] border-[var(--border)] m-[8px] p-[8px]'>{column.Name}</li>
            <ul>
              {column.Cards.map((card) => (
                <li key={card.Id} className='border border-[var(--border)] rounded-[16px] m-[8px] p-[8px]'>{card.Content}</li>
              ))}
            </ul>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                cardForm.handleSubmit()
              }}
            >
              <cardForm.Field
                name='cardContent'
                children={(field) => {
                  return (
                    <>
                      <label>Card Name: </label>
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
              <cardForm.Field
                name='columnId'
                defaultValue={column.Id}
                children={(field) =>
                  <input
                    hidden
                    readOnly
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                  />}
              />
              <cardForm.Subscribe
                children={() =>
                  <button type='submit'>Create Card</button>
                }
              />
            </form>
          </div>
        ))}
      </ul>
    </main>
  )
}
