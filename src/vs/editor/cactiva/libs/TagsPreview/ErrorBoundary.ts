import * as React from 'react';
import html from 'vs/editor/cactiva/libs/html';

type ErrorHandler = (error: Error, info: React.ErrorInfo) => void;
type ErrorHandlingComponent<Props> = (props: Props, error?: Error) => React.ReactNode;

type ErrorState = { error?: Error };

function Catch<Props extends {}>(
	component: ErrorHandlingComponent<Props>,
	errorHandler?: ErrorHandler
): React.ComponentType<Props> {
	return class extends React.Component<Props, ErrorState> {
		state: ErrorState = {
			error: undefined
		};

		static getDerivedStateFromError(error: Error) {
			return { error };
		}

		componentDidCatch(error: Error, info: React.ErrorInfo) {
			if (errorHandler) {
				errorHandler(error, info);
			}
		}

		render() {
			return component(this.props, this.state.error);
		}
	};
}

export const ErrorBoundary = Catch(function(props: any, error?: Error) {
	if (error) {
		return html`
			<div className="error-screen">
				<h2>An error has occured</h2>
				<h4>{error.message}</h4>
			</div>
		`;
	} else {
		return html`
			<${React.Fragment}>${props.children}<//>
		`;
	}
});
