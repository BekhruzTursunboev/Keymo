import type { Metadata } from 'next'
import './globals.css'
import { ActivityTracker } from '@/components/ActivityTracker'

export const metadata: Metadata = {
  title: 'Keymo Web - Typing & Health Tracker',
  description: 'Turn typing into a skill-building activity and health metric',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ActivityTracker />
        {children}
      </body>
    </html>
  )
}

