import React, { ComponentType, ReactNode } from 'react'

interface ErrorBoundaryProps {
  /** Reanders on error */
  children:ReactNode
  error?: ComponentType
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends React.PureComponent<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false
  }

  static getDerivedStateFromError () {
    return { hasError: true }
  }

  render () {
    if (this.state.hasError) {
      if (this.props.error) {
        return React.createElement(this.props.error)
      }
      return null
    }
    return this.props.children

    // return this.state.hasError
    // ? this.props.error
    //   ? React.createElement(this.props.error)
    //   : null
    // : this.props.children
  }
}
