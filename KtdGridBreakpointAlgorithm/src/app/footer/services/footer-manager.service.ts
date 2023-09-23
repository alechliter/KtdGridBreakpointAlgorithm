import { Injectable, OnDestroy } from '@angular/core';
import { FooterModule } from '../footer.module';
import { FooterComponent } from '../containers/footer.component';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { FooterButtonModel } from '../models/footer-button.model';

export type FooterButtonManager = { [key: string]: FooterButtonModel };

@Injectable({
    providedIn: FooterModule,
})
export class FooterManagerService implements OnDestroy {
    get currentFooterButtons() {
        return this.footerButtonsHash;
    }

    footerButtons: Observable<Array<FooterButtonModel>>;

    private footerButtonsHash?: FooterButtonManager;

    private footerComponent?: FooterComponent;

    private _footerButtons = new BehaviorSubject<Array<FooterButtonModel>>([]);

    private unsubscribe = new Subject<void>();

    constructor() {
        this.footerButtons = this._footerButtons.asObservable();
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
    }

    connectTo(footerComponent: FooterComponent): void {
        this.footerComponent = footerComponent;
        this.startSubscriptions();
    }

    startSubscriptions(): void {
        this.unsubscribe.next();

        this.footerButtons.pipe(takeUntil(this.unsubscribe)).subscribe({
            next: this.onFooterButtonsChange.bind(this),
        });
    }

    setFooterButtons(
        footerButtons: FooterButtonManager | Array<FooterButtonModel>
    ): void {
        let footerButtonsHash: FooterButtonManager;
        let footerButtonsCollection: Array<FooterButtonModel>;

        if (this.isFooterButtonManager(footerButtons)) {
            footerButtonsHash = footerButtons;
            footerButtonsCollection = [];
            Object.keys(footerButtons).forEach((key) => {
                footerButtonsCollection.push(footerButtons[key]);
            });
        } else {
            footerButtonsCollection = footerButtons;
            footerButtonsHash = {};
            footerButtons.forEach((footerButton, index) => {
                footerButtonsHash[`FooterButton-${index}`] = footerButton;
            });
        }

        this.footerButtonsHash = footerButtonsHash;
        this._footerButtons.next(footerButtonsCollection);
    }

    private onFooterButtonsChange(footerButtons: Array<FooterButtonModel>) {
        if (this.footerComponent) {
            this.footerComponent.footerButtons = footerButtons;
        }
    }

    private isFooterButtonManager(
        footerButtons: unknown
    ): footerButtons is FooterButtonManager {
        if (footerButtons == null || !(footerButtons instanceof Object)) {
            return false;
        }

        if (Object.keys(footerButtons).some((key) => typeof key !== 'string')) {
            return false;
        }

        if (
            Object.values(footerButtons).some(
                (value) => !(value instanceof FooterButtonModel)
            )
        ) {
            return false;
        }

        return true;
    }
}
