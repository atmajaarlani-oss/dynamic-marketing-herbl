import { Suspense } from 'react'
import ResumeClient from './resume-client'

export default function ResumePage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Memuat token pembayaran...</p>
        </div>
      </main>
    }>
      <ResumeClient />
    </Suspense>
  )
}
