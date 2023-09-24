import { FooterButtonModel } from './footer-button.model';

export type FooterButtonManager = { [key: string]: FooterButtonModel };

export class FooterButtonManagerModel<
    TFooterButtonManager extends FooterButtonManager = FooterButtonManager
> {
    buttons: TFooterButtonManager;

    private hiddenFooterButtons: Set<keyof TFooterButtonManager> = new Set();

    constructor(footerButtons: TFooterButtonManager) {
        this.buttons = footerButtons;
    }

    disableButton(buttonKey: keyof TFooterButtonManager): void {
        this.buttons[buttonKey].disabled = true;
    }

    enableButton(buttonKey: keyof TFooterButtonManager): void {
        this.buttons[buttonKey].disabled = false;
    }

    hideButton(button: keyof TFooterButtonManager): void {
        if (!this.isButtonHidden(button)) {
            this.hiddenFooterButtons.add(button);
        }
    }

    showButton(button: keyof TFooterButtonManager): void {
        if (this.isButtonHidden(button)) {
            this.hiddenFooterButtons.delete(button);
        }
    }

    isButtonHidden(button: keyof TFooterButtonManager): boolean {
        return this.hiddenFooterButtons.has(button);
    }

    toArray(filterHiddenButtons: boolean = true): Array<FooterButtonModel> {
        const footerButtonsCollection: Array<FooterButtonModel> = [];

        Object.keys(this.buttons).forEach((key) => {
            if (!filterHiddenButtons || !this.isButtonHidden(key)) {
                footerButtonsCollection.push(this.buttons[key]);
            }
        });

        return footerButtonsCollection;
    }
}
