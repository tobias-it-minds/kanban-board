import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { FirebaseUIProvider } from '@firebase-oss/ui-react';

import { app, ui } from '../../firebaseconfig'

interface MyRouterContext {
  queryClient: QueryClient
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <FirebaseUIProvider ui={ui}>{children}</FirebaseUIProvider>;
}


export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

const queryClient = new QueryClient();

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseUIProvider ui={ui}>
      <html lang="en">
        <head>
          <HeadContent />
        </head>
        <body className="font-inter antialiased bg-[var(--page-bg)]  text-[var(--primary)]">
          <QueryClientProvider client={queryClient}>
            {children}
            {/*
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
              TanStackQueryDevtools,
            ]}
          />
          */}
          </QueryClientProvider>
          <Scripts />
        </body>
      </html>
    </FirebaseUIProvider>
  )
}
