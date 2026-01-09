import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error to the console for debugging
        console.error('Error caught by ErrorBoundary:', error, errorInfo);

        // Update state with error details
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            // Custom error UI
            return (
                <div className="min-h-screen w-full flex items-center justify-center bg-(--background-color) p-8">
                    <div className="max-w-2xl w-full bg-[rgba(26,26,26,0.8)] border border-(--link-hover-color) rounded-lg p-8">
                        <h1 className="text-3xl font-bold text-(--link-hover-color) mb-4">
                            ⚠️ Oops! Something went wrong
                        </h1>

                        <p className="text-(--white-color) mb-6">
                            An error occurred in the application. Please check the details below:
                        </p>

                        {/* Error Details */}
                        <div className="bg-[rgba(0,0,0,0.5)] border border-red-500/30 rounded-lg p-4 mb-4">
                            <h2 className="text-xl font-bold text-red-400 mb-2">Error Message:</h2>
                            <p className="text-red-300 font-mono text-sm wrap-break-word">
                                {this.state.error && this.state.error.toString()}
                            </p>
                        </div>

                        {/* Component Stack */}
                        {this.state.errorInfo && (
                            <div className="bg-[rgba(0,0,0,0.5)] border border-yellow-500/30 rounded-lg p-4 mb-6">
                                <h2 className="text-xl font-bold text-yellow-400 mb-2">Component Stack:</h2>
                                <pre className="text-yellow-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap wrap-break-word">
                                    {this.state.errorInfo.componentStack}
                                </pre>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <button
                                onClick={() => window.location.reload()}
                                className="btn-primary flex-1"
                            >
                                Reload Page
                            </button>
                            <button
                                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                                className="btn-secondary flex-1"
                            >
                                Try Again
                            </button>
                        </div>

                        {/* Development Tip */}
                        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                            <p className="text-blue-300 text-sm">
                                💡 <strong>Tip:</strong> Check the browser console (F12) for more detailed error information.
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        // If no error, render children normally
        return this.props.children;
    }
}

export default ErrorBoundary;
