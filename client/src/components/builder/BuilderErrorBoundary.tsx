import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * BuilderErrorBoundary - Catch and handle React errors gracefully
 *
 * Phase 4.3: UI/UX Polish
 *
 * Prevents the entire builder from crashing if a component has an error
 *
 * Usage:
 * <BuilderErrorBoundary>
 *   <YourComponent />
 * </BuilderErrorBoundary>
 */

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class BuilderErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Builder Error Boundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // Log to error reporting service (if available)
    // Example: logErrorToService(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = (): void => {
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      const isDevelopment = import.meta.env.DEV;

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full border-red-200 bg-red-50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-red-100 rounded-full p-3">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-xl text-red-900">
                    Something Went Wrong
                  </CardTitle>
                  <p className="text-sm text-red-700 mt-1">
                    {this.props.fallbackMessage || 'The module builder encountered an unexpected error'}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Error Details (Development Only) */}
              {isDevelopment && this.state.error && (
                <div className="bg-white border border-red-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-red-900 mb-2">Error Details:</h4>
                  <pre className="text-xs text-red-800 overflow-x-auto whitespace-pre-wrap break-words">
                    {this.state.error.toString()}
                  </pre>
                  {this.state.errorInfo && (
                    <details className="mt-3">
                      <summary className="text-xs font-medium text-red-700 cursor-pointer hover:text-red-900">
                        Stack Trace
                      </summary>
                      <pre className="text-xs text-red-600 mt-2 overflow-x-auto whitespace-pre-wrap break-words">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* User Guidance */}
              <div className="bg-white border border-red-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">What you can do:</h4>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>Try reloading the component (click "Try Again" below)</li>
                  <li>Check your browser console for more details</li>
                  <li>If the issue persists, return to the home page</li>
                  <li>Any unsaved work may be lost - export your module JSON regularly</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={this.handleReset}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go to Home
                </Button>
              </div>

              {/* Development Tip */}
              {isDevelopment && (
                <div className="text-xs text-gray-600 bg-gray-100 border border-gray-200 rounded p-3">
                  💡 <strong>Dev Tip:</strong> Check the browser console for the full error stack trace.
                  This error boundary is only showing detailed errors because you're in development mode.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
