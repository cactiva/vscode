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
import EditorSource from 'vs/editor/cactiva/models/EditorSource';
import { cactiva } from 'vs/editor/cactiva/models/store';
import { IEditorConstructionOptions } from 'vs/editor/common/config/editorOptions';
import * as editorCommon from 'vs/editor/common/editorCommon';
import { ITextModel } from 'vs/editor/common/model';
import { IAccessibilityService } from 'vs/platform/accessibility/common/accessibility';
import { ICommandService } from 'vs/platform/commands/common/commands';
import { IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { INotificationService } from 'vs/platform/notification/common/notification';
import { IThemeService } from 'vs/platform/theme/common/themeService';
import EditorCanvas from 'vs/editor/cactiva/models/EditorCanvas';
import { Range } from 'vs/editor/common/core/range';

export class CanvasEditorWidget extends CodeEditorWidget {
	private readonly _domEl: HTMLElement;
	private readonly _splitView: SplitView;
	private readonly _codePane: CodePane;
	private readonly _canvasPane: CanvasPane;

	private _canvasPaneSize: number;
	private _canvasPaneSizeStoreKey: string;
	private _paneMode: 'code' | 'vertical' | 'horizontal' | 'canvas';

	public layout(dimension?: editorCommon.IDimension): void {
		if (dimension) {
			if (this._splitView.length > 1) {
				this.superLayout({
					...dimension,
					width: this._splitView.getViewSize(0)
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

		this._canvasPaneSizeStoreKey = `cactiva-sash-${this.getId()}`;
		const _canvasPaneSize = localStorage[this._canvasPaneSizeStoreKey];
		this._canvasPaneSize = _canvasPaneSize ? parseInt(_canvasPaneSize) : 0;

		if (this._modelData && !cactiva.canvas[this._modelData?.model.id]) {
			cactiva.canvas[this._modelData?.model.id] = new EditorCanvas(this._modelData?.model.id);
		}

		this._paneMode = 'horizontal';
		this._domEl = domElement;
		this._splitView = this._register(splitview);
		this._codePane = this._register(codePane);
		this._canvasPane = this._register(canvasPane);

		const onResize = () => {
			if (this._splitView.length === 1) {
				this.superLayout({
					width: this._domEl.clientWidth,
					height: this._domEl.clientHeight
				});
			} else {
				this.superLayout({
					width: this._splitView.getViewSize(0),
					height: this._domEl.clientHeight
				});
			}
		};
		window.addEventListener('resize', onResize);
		this._register({
			dispose: () => {
				window.removeEventListener('resize', onResize);
			}
		});

		this._register(
			this._splitView.onDidSashChange(() => {
				this.superLayout({
					width: this._splitView.getViewSize(0),
					height: this._domEl.clientHeight
				});
				localStorage[`cactiva-sash-${this.getId()}`] = this._splitView.getViewSize(1);
			})
		);

		const onWindowResize = () => {
			console.log('window on resize');
		};
		window.addEventListener('onresize', onWindowResize);
		this._register({
			dispose: () => {
				window.removeEventListener('onresize', onWindowResize);
			}
		});

		splitview.addView(codePane, Sizing.Distribute);
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
						async e => {
							const id = this._modelData?.model.id;
							if (id) {
								const canvas = cactiva.canvas[id];
								const source = canvas.source;

								// prevent selecting loop between select from canvas and select from code editor.
								if (canvas.selectingFromCanvas) {
									canvas.selectingFromCanvas = false;
									return;
								}

								if (source) {
									// select source in editor
									const range = new Range(0, 0, e.position.lineNumber, e.position.column);
									let src = this._modelData?.viewModel.getPlainTextToCopy([range], false, false);
									if (src) {
										if (Array.isArray(src)) {
											src = src.join('\n');
										}
										const nodePath = await source.getNodePathAtPos(src.length);
										await canvas.selectNode(nodePath, 'code');
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
								const canvas = cactiva.canvas[model.id];
								if (canvas) {
									if (canvas.source.fileName === model.uri.fsPath) {
										canvas.source.updateContent(model.getValue());
									} else {
										canvas.source.dispose();
										canvas.source = new EditorSource(model.uri.fsPath, model.getValue(), canvas);
									}
									cactiva.propsEditor.node = undefined;
								}
							}
						},
						200,
						{ trailing: true }
					)
				)
			);
			if (this._splitView.length === 1) {
				this.superLayout({
					width: this._domEl.clientWidth,
					height: this._domEl.clientHeight
				});
			} else {
				this.superLayout({
					width: this._splitView.getViewSize(0),
					height: this._domEl.clientHeight
				});
			}
		}
	}

	private _changeLanguageTo(languageId: string) {
		if (languageId.indexOf('react') > 0) {
			if (this._splitView.length <= 1) {
				const domElWidth = this._domEl.clientWidth;
				this._splitView.layout(domElWidth);
				this._splitView.addView(this._canvasPane, this._canvasPaneSize, 1);
			} else {
				this._splitView.setViewVisible(1, true);
			}
			this.superLayout({
				width: this._splitView.getViewSize(0),
				height: this._domEl.clientHeight
			});
		} else if (this._splitView.length > 1 && languageId.indexOf('react') < 0) {
			cactiva.propsEditor.hidden = true;
			this._splitView.setViewVisible(1, false);
			this.layout({
				width: this._domEl.clientWidth,
				height: this._domEl.clientHeight
			});
		}
	}
}
