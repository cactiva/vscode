/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Cactiva. All rights reserved.
 *--------------------------------------------------------------------------------------------*/

 import { Pane } from 'vs/base/browser/ui/splitview/paneview';
import { IView, Orientation, Sizing, SplitView } from 'vs/base/browser/ui/splitview/splitview';
import 'vs/css!./media/editor';
import { ICodeEditorService } from 'vs/editor/browser/services/codeEditorService';
import { CodeEditorWidget, ICodeEditorWidgetOptions } from 'vs/editor/browser/widget/codeEditorWidget';
import { IEditorConstructionOptions } from 'vs/editor/common/config/editorOptions';
import * as editorCommon from 'vs/editor/common/editorCommon';
import { ITextModel } from 'vs/editor/common/model';
import { IAccessibilityService } from 'vs/platform/accessibility/common/accessibility';
import { ICommandService } from 'vs/platform/commands/common/commands';
import { IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { INotificationService } from 'vs/platform/notification/common/notification';
import { IThemeService } from 'vs/platform/theme/common/themeService';
import { CanvasPane } from 'vs/editor/cactiva/CanvasPane';

export class CodePane extends Pane implements IView {
	protected renderHeader(container: HTMLElement): void { }
	protected renderBody(container: HTMLElement): void {
	}
	protected layoutBody(height: number, width: number): void {
		this.element.setAttribute('style', 'width: 100%;height:100%;');
	}
}

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
				super.layout({
					...dimension,
					width: this._firstPaneSize || dimension.width / 2
				});
			} else {
				super.layout(dimension);
			}
		} else {
			super.layout();
		}
		if (this._splitView.length > 1) {
			this._splitView.layout(dimension?.width || 0);
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
		@IAccessibilityService accessibilityService: IAccessibilityService) {

		console.log(options, codeEditorWidgetOptions);
		const splitview = new SplitView(domElement, {
			orientation: Orientation.HORIZONTAL
		});
		const codePane = new CodePane();
		const canvasPane = new CanvasPane();

		super(codePane.element, options, codeEditorWidgetOptions,
			instantiationService, codeEditorService, commandService,
			contextKeyService, themeService, notificationService,
			accessibilityService);

		this._paneMode = 'horizontal';
		this._domEl = domElement;
		this._splitView = this._register(splitview);
		this._codePane = this._register(codePane);
		this._canvasPane = this._register(canvasPane);
		this._firstPaneSize = 0;

		this._register(this._splitView.onDidSashChange(() => {
			const size = this._splitView.getViewSize(0);
			this._firstPaneSize = size < 200 ? this._domEl.clientWidth / 2 : size;
			super.layout({
				width: size,
				height: this._domEl.clientHeight
			})
		}));

		splitview.addView(codePane, Sizing.Split(0));

	}

	protected _attachModel(model: ITextModel | null): void {
		super._attachModel(model);
		if (!!model) {
			if (this._modelData) {
				this._canvasPane.updateModelData(this._modelData);
			}
			this._changeLanguageTo(model?.getLanguageIdentifier().language);
			this._modelData?.listenersToRemove.push(this.onDidChangeModelLanguage((e) => {
				this._changeLanguageTo(e.newLanguage);
			}));
		}
	}

	private _changeLanguageTo(languageId: string) {
		if (languageId.indexOf('react') > 0 && this._splitView.length <= 1) {
			this._splitView.addView(this._canvasPane, Sizing.Split(1));
			this._splitView.resizeView(0, this._firstPaneSize);
			this.layout({
				width: this._domEl.clientWidth,
				height: this._domEl.clientHeight
			})
		} else if (this._splitView.length > 1 && languageId.indexOf('react') < 0) {
			this._splitView.removeView(1);
			this.layout({
				width: this._domEl.clientWidth,
				height: this._domEl.clientHeight
			})
		}
	}
}
