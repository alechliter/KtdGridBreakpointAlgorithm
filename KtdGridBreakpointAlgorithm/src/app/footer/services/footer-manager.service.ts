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
    get buttonManager() {
        return this.footerButtonManager;
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
        const footerButtonsCollection: Array<FooterButtonModel> = [];

        Object.keys(footerButtons.buttons).forEach((key) => {
            footerButtonsCollection.push(footerButtons.buttons[key]);
        });

        this.footerButtonManager = footerButtons;
        this._footerButtons.next(footerButtonsCollection);
    }

    disableButton(
        button: keyof TFooterButtonManager,
        isDisabled: boolean
    ): void {
        if (isDisabled) {
            this.buttonManager?.disableButton(button);
        } else {
            this.buttonManager?.enableButton(button);
        }
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
