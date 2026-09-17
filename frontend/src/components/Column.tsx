import type { CardData, ColumnData } from '#/types/column';
import { useForm } from '@tanstack/react-form'
import { getAuth } from 'firebase/auth';

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

  return (
    <div className='min-w-[384px] bg-[var(--column-bg)] border-[var(--border)] border-1 border'>
      <br />
      <li className='border rounded-[16px] border-[var(--border)] m-[8px] p-[8px]'>{column.Name}</li>
      <ul>
        {column.Cards.map((card: CardData) => (
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
  )
}
