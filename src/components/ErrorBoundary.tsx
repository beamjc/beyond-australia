'use client'

import { Component, ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { hasError: boolean; error?: Error }

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <h1 className="font-display font-bold text-2xl mb-2 text-foreground">Something went wrong</h1>
            <p className="text-sm text-muted-foreground mb-6 font-mono bg-muted px-3 py-2 rounded">
              {this.state.error?.message ?? 'Unknown error'}
            </p>
            <button onClick={() => window.location.reload()} className="text-sm text-primary hover:underline">
              Reload page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
