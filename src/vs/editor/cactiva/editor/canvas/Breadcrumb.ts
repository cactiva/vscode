import html from 'vs/editor/cactiva/libs/html';
import { observer } from 'mobx-react-lite';

export default observer(() => {
	return html`
		<div className="tabs-breadcrumbs">
			<div className="breadcrumbs-control relative-path backslash-path">
				<div
					className="monaco-scrollable-element"
					role="presentation"
					style=${{
						position: 'relative',
						overflow: 'hidden'
					}}
				>
					<div
						className="monaco-breadcrumbs"
						role="list"
						style=${{
							background: 'transparent',
							overflow: 'hidden',
							width: '100%',
							height: '22px'
						}}
					>
						<div className="folder monaco-breadcrumb-item" role="listitem">
							<div
								style=${{
									width: '8px',
									height: '22px'
								}}
							></div>
							<div className="monaco-icon-label">
								<div className="monaco-icon-label-container">
									<span className="monaco-icon-name-container"><a className="label-name">src</a></span
									><span className="monaco-icon-description-container"></span>
								</div>
							</div>
							<div className="codicon codicon-chevron-right"></div>
						</div>
						<div className="folder monaco-breadcrumb-item" role="listitem">
							<div className="monaco-icon-label">
								<div className="monaco-icon-label-container">
									<span className="monaco-icon-name-container"><a className="label-name">components</a></span
									><span className="monaco-icon-description-container"></span>
								</div>
							</div>
							<div className="codicon codicon-chevron-right"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	`;
});
