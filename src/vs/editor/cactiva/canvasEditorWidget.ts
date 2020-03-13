/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Cactiva. All rights reserved.
 *--------------------------------------------------------------------------------------------*/

import { debounce } from 'lodash';
import { Orientation, Sizing, SplitView } from 'vs/base/browser/ui/splitview/splitview';
import 'vs/css!./media/editor';
import { ICodeEditorService } from 'vs/editor/browser/services/codeEditorService';
import { CodeEditorWidget, ICodeEditorWidgetOptions } from 'vs/editor/browser/widget/codeEditorWidget';
import { CanvasPane } from 'vs/editor/cactiva/CanvasPane';
import { CodePane } from 'vs/editor/cactiva/CodePane';
import { selectNode } from 'vs/editor/cactiva/libs/morph/selectNode';
import { syncSource } from 'vs/editor/cactiva/libs/morph/syncSource';
import { cactiva } from 'vs/editor/cactiva/models/cactiva';
import { IEditorConstructionOptions } from 'vs/editor/common/config/editorOptions';
import { Range } from 'vs/editor/common/core/range';
import * as editorCommon from 'vs/editor/common/editorCommon';
import { ITextModel } from 'vs/editor/common/model';
import { IAccessibilityService } from 'vs/platform/accessibility/common/accessibility';
import { ICommandService } from 'vs/platform/commands/common/commands';
import { IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { INotificationService } from 'vs/platform/notification/common/notification';
import { IThemeService } from 'vs/platform/theme/common/themeService';

export class CanvasEditorWidget extends CodeEditorWidget {
	private readonly _domEl: HTMLElement;
	private readonly _splitView: SplitView;
	private readonly _codePane: CodePane;
	private readonly _canvasPane: CanvasPane;

	private _paneMode: 'code' | 'vertical' | 'horizontal' | 'canvas';
	private _firstPaneSize: number;

	public layout(dimension?: editorCommon.IDimension): void {
		if (dimension) {
			if (this._splitView.length > 1) {
				this.superLayout({
					...dimension,
					width: this._firstPaneSize || dimension.width / 2
				});
			} else {
				this.superLayout(dimension);
			}
		} else {
			this.superLayout();
		}
		if (this._splitView.length > 1) {
			this._splitView.layout(dimension?.width || 0);
		}
	}
	public superLayout(dimension?: editorCommon.IDimension): void {
		if (dimension) {
			const border =
				this._paneMode === 'horizontal'
					? this._codePane.element.style.borderRightWidth
					: this._codePane.element.style.borderTopWidth;
			const borderOffset = parseInt(border) || 1;
			super.layout({ ...dimension, width: dimension.width - borderOffset });
		} else {
			super.layout();
		}
	}

	constructor(
		domElement: HTMLElement,
		options: IEditorConstructionOptions,
		codeEditorWidgetOptions: ICodeEditorWidgetOptions,
		@IInstantiationService instantiationService: IInstantiationService,
		@ICodeEditorService codeEditorService: ICodeEditorService,
		@ICommandService commandService: ICommandService,
		@IContextKeyService contextKeyService: IContextKeyService,
		@IThemeService themeService: IThemeService,
		@INotificationService notificationService: INotificationService,
		@IAccessibilityService accessibilityService: IAccessibilityService
	) {
		const splitview = new SplitView(domElement, {
			orientation: Orientation.HORIZONTAL
		});
		const codePane = new CodePane({ title: 'Code' });
		const canvasPane = new CanvasPane({ title: 'Canvas' });

		super(
			codePane.element,
			options,
			codeEditorWidgetOptions,
			instantiationService,
			codeEditorService,
			commandService,
			contextKeyService,
			themeService,
			notificationService,
			accessibilityService
		);

		if (this._modelData && !cactiva.canvas[this._modelData?.model.id]) {
			cactiva.canvas[this._modelData?.model.id] = {
				breadcrumbs: [],
				modelData: undefined,
				editor: this,
				editorOptions: options,
				source: undefined,
				selectedNode: undefined,
				hoveredNode: undefined
			};
		}

		this._paneMode = 'horizontal';
		this._domEl = domElement;
		this._splitView = this._register(splitview);
		this._codePane = this._register(codePane);
		this._canvasPane = this._register(canvasPane);
		this._firstPaneSize = 0;

		this._register(
			this._splitView.onDidSashChange(() => {
				const size = this._splitView.getViewSize(0);
				this._firstPaneSize = size < 200 ? this._domEl.clientWidth / 2 : size;
				this.superLayout({
					width: size,
					height: this._domEl.clientHeight
				});
			})
		);

		splitview.addView(codePane, Sizing.Split(0));
	}

	protected _attachModel(model: ITextModel | null): void {
		super._attachModel(model);
		if (!!model) {
			if (this._modelData) {
				this._canvasPane.updateModelData(this._modelData, this);
			}
			this._changeLanguageTo(model?.getLanguageIdentifier().language);
			this._modelData?.listenersToRemove.push(
				this.onDidChangeModelLanguage(e => {
					this._changeLanguageTo(e.newLanguage);
				})
			);
			this._modelData?.listenersToRemove.push(
				this.onDidChangeCursorPosition(
					debounce(
						e => {
							const id = this._modelData?.model.id;
							if (id) {
								const canvas = cactiva.canvas[id];
								const source = canvas.source;
								if (source) {
									const range = new Range(0, 0, e.position.lineNumber, e.position.column);
									let src = this._modelData?.viewModel.getPlainTextToCopy([range], false, false);
									if (src) {
										if (Array.isArray(src)) {
											src = src.join('\n');
										}
										const rawNode = source.getDescendantAtPos(src.length);
										const node = rawNode?.compilerNode;
										if (node) {
											let cursor = node;
											while (cursor !== undefined && !(cursor as any).cactivaPath) {
												cursor = cursor.parent;
											}
											if (cursor && (cursor as any).cactivaPath) {
												selectNode(canvas, (cursor as any).cactivaPath, false);
											}
										}
									}
								}
							}
						},
						200,
						{ trailing: true }
					)
				)
			);
			this._modelData?.listenersToRemove.push(
				this.onDidChangeModelContent(
					debounce(
						e => {
							const model = this._modelData?.model;
							if (model) {
								cactiva.canvas[model.id].source = cactiva.project.createSourceFile(model.uri.fsPath, model.getValue(), {
									overwrite: true
								});
								syncSource(cactiva.canvas[model.id]);
							}
						},
						200,
						{ trailing: true }
					)
				)
			);
		}
	}

	private _changeLanguageTo(languageId: string) {
		if (languageId.indexOf('react') > 0 && this._splitView.length <= 1) {
			this._splitView.addView(this._canvasPane, Sizing.Split(1));
			this._splitView.resizeView(0, this._firstPaneSize);
			this.layout({
				width: this._domEl.clientWidth,
				height: this._domEl.clientHeight
			});
		} else if (this._splitView.length > 1 && languageId.indexOf('react') < 0) {
			this._splitView.removeView(1);
			this.layout({
				width: this._domEl.clientWidth,
				height: this._domEl.clientHeight
			});
		}
	}
}
