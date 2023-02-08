import { NonCriticalError } from 'errors/NonCriticalError';
import React from 'react';
import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from 'react-error-boundary';

export interface ErrorBoundaryProps {
  children: React.ReactNode;
}
export const ErrorBoundary: React.VFC<ErrorBoundaryProps> = (props) => {
  return (
    <ReactErrorBoundary fallbackRender={(fallbackProps: FallbackProps) => <h1>Something wrong...</h1>}>
      {props.children}
    </ReactErrorBoundary>
  );
};
