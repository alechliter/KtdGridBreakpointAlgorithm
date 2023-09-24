import { ChangeDetectorRef, Injectable, OnDestroy } from '@angular/core';
import { FooterModule } from '../footer.module';
import { FooterComponent } from '../containers/footer.component';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { FooterButtonModel } from '../models/footer-button.model';
import {
    FooterButtonManager,
    FooterButtonManagerModel,
} from '../models/footer-button-manager.model';

@Injectable()
export class FooterManagerService<
    TFooterButtonManager extends FooterButtonManager = FooterButtonManager
> implements OnDestroy
{
    get buttonManager():
        | FooterButtonManagerModel<TFooterButtonManager>
        | undefined {
        return this.footerButtonManager;
    }

    get buttons(): TFooterButtonManager | undefined {
        return this.footerButtonManager?.buttons;
    }

    footerButtons: Observable<Array<FooterButtonModel>>;

    private footerButtonManager?: FooterButtonManagerModel<TFooterButtonManager>;

    private footerComponent?: FooterComponent;

    private _footerButtons = new BehaviorSubject<Array<FooterButtonModel>>([]);

    private unsubscribe = new Subject<void>();

    constructor(private changeDetector: ChangeDetectorRef) {
        this.footerButtons = this._footerButtons.asObservable();
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
    }

    connectTo(footerComponent: FooterComponent): void {
        this.footerComponent = footerComponent;
        this.startSubscriptions();
        this.changeDetector.detectChanges();
    }

    setFooterButtons(
        footerButtons: FooterButtonManagerModel<TFooterButtonManager>
    ): void {
        this.footerButtonManager = footerButtons;
        this._footerButtons.next(footerButtons.toArray());
    }

    disableButton(button: keyof TFooterButtonManager): void {
        this.buttonManager?.disableButton(button);
    }

    enableButton(button: keyof TFooterButtonManager): void {
        this.buttonManager?.enableButton(button);
    }

    hideButton(button: keyof TFooterButtonManager): void {
        if (
            this.footerButtonManager &&
            !this.footerButtonManager.isButtonHidden(button)
        ) {
            this.footerButtonManager.hideButton(button);
            this._footerButtons.next(this.footerButtonManager.toArray());
        }
    }

    showButton(button: keyof TFooterButtonManager): void {
        if (
            this.footerButtonManager &&
            this.footerButtonManager.isButtonHidden(button)
        ) {
            this.footerButtonManager.showButton(button);
            this._footerButtons.next(this.footerButtonManager.toArray());
        }
    }

    isButtonHidden(button: keyof TFooterButtonManager): boolean {
        if (!this.footerButtonManager) {
            return true;
        }

        return this.footerButtonManager.isButtonHidden(button);
    }

    private startSubscriptions(): void {
        this.unsubscribe.next();

        this.footerButtons.pipe(takeUntil(this.unsubscribe)).subscribe({
            next: this.onFooterButtonsChange.bind(this),
        });
    }

    private onFooterButtonsChange(footerButtons: Array<FooterButtonModel>) {
        if (this.footerComponent) {
            this.footerComponent.footerButtons = footerButtons;
        }
    }
}
