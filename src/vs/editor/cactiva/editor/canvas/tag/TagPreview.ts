import { observable, toJS } from 'mobx';
import { observer, useObservable } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Node } from 'ts-morph';
import 'vs/css!./TagPreview';
import html from 'vs/editor/cactiva/libs/html';
import { getImportClause } from 'vs/editor/cactiva/libs/morph/getNodeImport';
import { getStyle } from 'vs/editor/cactiva/libs/morph/getStyle';
import * as Tags from 'vs/editor/cactiva/libs/TagsPreview/index';
import { cactiva, IEditorCanvas } from 'vs/editor/cactiva/models/cactiva';

interface ITagPreview {
	canvas: IEditorCanvas;
	node: Node;
	nodePath: string;
	style?: any;
	isLast?: boolean;
	children?: any;
	onClick?: (node: Node, nodePath: string) => void;
	className?: string;
	tagName: string;
}

export const TagPreview: React.FunctionComponent<ITagPreview> = observer(
	({ node, children, className, tagName }: ITagPreview) => {
		const cache = useObservable({
			style: observable.box(null as any),
			import: null as any
		});

		useEffect(() => {
			if (!node || (node && node.wasForgotten())) {
			} else {
				cache.style.set(cactiva.mode !== 'layout' ? getStyle(node) : {});
				let importClause = '';
				switch (getImportClause(node)) {
					case 'react-native':
						importClause = 'ReactNative';
						break;
				}
				cache.import = importClause;
			}
		}, [node, cactiva.mode]);
		if (cache.import === null) return null;

		const style = toJS(cache.style.get());
		const Component = (Tags as any)[cache.import];
		if (!!Component && !!Component[tagName]) {
			return html`
				<${Component[tagName]} className=${`tag-preview ${className}`} style=${style}>
					${children}
				<//>
			`;
		}

		return html`
			<div className=${`tag-preview ${className}`} style=${style}>
				${children}
			</div>
		`;
	}
);
