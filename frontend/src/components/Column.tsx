import type { CardData, ColumnData } from '#/types/column';
import { useForm } from '@tanstack/react-form'
import { getAuth } from 'firebase/auth';
import { Reorder } from "motion/react"
import { useState } from 'react';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

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


// , onSubmit: () => Promise<void>
export function Column({ column, projectId, invalidate }: { column: ColumnData, projectId: string, invalidate: () => Promise<void> }) {
  const cardForm = useForm({
    defaultValues: {
      cardContent: '',
      columnId: '',
    },
    onSubmit: async (data) => {
      await createCard(projectId, data.value.columnId, data.value.cardContent);
      invalidate();
    },
  });

  const [orderedCards, setOrderedCards] = useState(column.Cards);

  return (
    <Reorder.Item as="div" value={column} className='min-w-[384px] bg-[var(--column-bg)] border-[var(--border)] border-1 border'>
      <div className='m-[16px]'>
        <Card className='mb-[16px]'>
          <CardHeader>
            <CardTitle className='my-auto text-[20px]'>{column.Name}</CardTitle>
            <CardAction className='text-[20px]'>+</CardAction>
          </CardHeader>
        </Card>

        <ul>
          <Reorder.Group axis='y' values={orderedCards} onReorder={setOrderedCards} >
            {orderedCards.map((card: CardData) => (
              <Reorder.Item as="div" value={card}>

                <li key={card.Id} className='my-[8px]'>
                  <div className='border-l-4 border-[var(--brand)] rounded-xl'>
                    <Card>
                      <CardHeader>
                        <CardTitle className=''>{card.Content}</CardTitle>
                      </CardHeader>
                    </Card>
                  </div>
                </li>

              </Reorder.Item>
            ))}
          </Reorder.Group>
        </ul>

        <Dialog>
          <DialogTrigger>
            <h1 className='section-heading text-[var(--brand)]'>+ new card</h1>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Card</DialogTitle>
              <DialogDescription>
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
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>


      </div>
    </Reorder.Item>
  )
}
