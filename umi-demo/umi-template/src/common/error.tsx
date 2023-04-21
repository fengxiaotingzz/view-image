import * as React from 'react';

// import {clearCurrentPageRequest} from '@request/interceptor';

class WrapComponent extends React.Component {
  componentWillUnmount(): void {
    // clearCurrentPageRequest();
  }

  render(): React.ReactNode {
    return <div>{this.props.children}</div>;
  }
}

class DefaultFallback extends React.Component {
  render() {
    return (
      <div>
        出错啦
      </div>
    );
  }
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: {
        message: '',
        stack: '',
        name: ''
      },
      errorInfo: {
        componentStack: ''
      }
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      hasError: true,
      error,
      errorInfo
    });
  }

  render() {
    const {hasError, error, errorInfo} = this.state;
    const FallbackComponent = this.props.FallbackComponent || DefaultFallback;
    return hasError ? (
      <FallbackComponent
        title={error.name}
        componentStack={errorInfo.componentStack}
        errorMessage={error.message}
        stack={error.stack}
      />
    ) : (
      <React.Fragment>{this.props.children}</React.Fragment>
    );
  }
}

// export const withFallback: WithFallback =
//   (Component, FallbackComponent) => (props) =>
//     (
//       <ErrorBoundary FallbackComponent={FallbackComponent}>
//         <Component {...props} />
//       </ErrorBoundary>
//     )

export type WithFallback = <P = {}>(
  Component: React.ComponentType<P>,
  FallbackComponent?: React.ComponentType<any>
) => React.ComponentType<P>;

export type ErrorBoundaryFallbackProps = {
  errorMessage: string;
  componentStack: string;
  stack: string;
  title: string;
};

export type ErrorBoundaryProps = {
  FallbackComponent?: React.ComponentType<ErrorBoundaryFallbackProps>;
};

export type ErrorBoundaryState = {
  hasError: boolean;
  error: {message: string; stack: string; name: string};
  errorInfo: {componentStack: string};
};

export const withErrorBoundary: WithFallback = (
  Component,
  FallbackComponent
) => {
  const Wrapped = (props: any) => (
    <ErrorBoundary FallbackComponent={FallbackComponent}>
      <WrapComponent>
        <Component {...props} />
      </WrapComponent>
    </ErrorBoundary>
  );
  // const name = Component.displayName || Component.name || 'Unknown';
  // Wrapped.displayName = `withErrorBoundary(${name})`;
  return Wrapped;
};
// /**
//  * with 写法
//  * @param Component 业务组件
//  * @param errorBoundaryProps error boundary 的 props
//  */
// export function withErrorBoundary(
//   Component,
//   errorBoundaryProps?: ErrorBoundaryProps
// ) {
//   const Wrapped = (props) => {
//     return (
//       <ErrorBoundary {...errorBoundaryProps}>
//         <Component {...props} />
//       </ErrorBoundary>
//     )
//   }
