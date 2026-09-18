import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { getAuth } from 'firebase/auth';
import { useForm } from '@tanstack/react-form'
import { Column } from '#/components/Column';
import type { ColumnData } from '#/types/column';

import { Reorder } from "motion/react"
import { useState } from 'react';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '#/components/ui/card';
import { Button } from '#/components/ui/button';
import { ChevronLeftIcon, PlusIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '#/components/ui/dialog';

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

async function getColumns(projectId: string): Promise<ColumnData[] | undefined> {
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

    var columns: ColumnData[] = await response.json();

    console.log("Columns: ", columns);

    return columns;

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

  const columns: ColumnData[] = Route.useLoaderData();
  const [orderedColumns, setOrderedColumns] = useState(columns)

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

  return (
    <main className='h-[100vh] bg-[var(--column-bg)]'>
      <nav className='h-[56px] flex flex-row border border-[var(--border)]'>
        <Link className='my-auto mx-[16px] text-[20px] text-[var(--tertiary)] font-bold' to='/'>
          <ChevronLeftIcon />
        </Link>
        <h1 className='my-auto'>project.name</h1>
      </nav>

      <Reorder.Group axis='x' className='flex flex-nowrap flex-row mx-auto overflow-scroll scrollbar-auto scrollbar-thin h-[calc(100%-56px)]' values={orderedColumns} onReorder={setOrderedColumns}>
        {orderedColumns?.map((column) => (
          <Column key={column.Id} column={column} projectId={projectId} invalidate={router.invalidate} />
        ))}
        <li className='min-w-[384px] bg-[var(--column-bg)] border-[var(--border)] border-1 border'>

          <Dialog>
            <DialogTrigger className='min-w-[384px]'>
              <div className='m-[16px]'>
                <Card className='mb-[16px] border-dashed'>
                  <CardHeader>
                    <CardTitle className='my-auto text-[20px]'></CardTitle>
                    <Button variant="outline" size="icon" aria-label="Add" className='border-[var(--border)] border-[var(--tertiary)] m-auto'>
                      <PlusIcon className='text-[var(--tertiary)]' />
                    </Button>
                    <CardContent className='text-[16px] text-[var(--tertiary)] m-auto'>
                      Add new Column
                    </CardContent>
                  </CardHeader>
                </Card>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Card</DialogTitle>
                <DialogDescription>

                  <form
                    className='border rounded-[16px] border-[var(--border)]'
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

                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

        </li>
      </Reorder.Group>
    </main>
  )
}
