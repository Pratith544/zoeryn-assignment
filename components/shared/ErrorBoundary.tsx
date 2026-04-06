'use client'

import React from 'react'
import { AlertCircle } from 'lucide-react'

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error) {
    console.error('Error caught by boundary:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="border border-hairline rounded-sm p-6 bg-card flex items-center gap-4">
          <AlertCircle className="w-5 h-5 text-expense flex-shrink-0" />
          <div>
            <p className="font-semibold text-sm mb-1">Something went wrong</p>
            <p className="text-xs text-muted-foreground">
              An error occurred while loading this section. Please refresh the page or try again.
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
