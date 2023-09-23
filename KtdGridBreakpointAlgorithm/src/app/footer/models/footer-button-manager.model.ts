import { FooterButtonModel } from './footer-button.model';

export type FooterButtonManager = { [key: string]: FooterButtonModel };

export class FooterButtonManagerModel<
    TFooterButtonManager extends FooterButtonManager = FooterButtonManager
> {
    buttons: TFooterButtonManager;

    constructor(footerButtons: TFooterButtonManager) {
        this.buttons = footerButtons;
    }

    disableButton(buttonKey: keyof TFooterButtonManager): void {
        this.buttons[buttonKey].disabled = true;
    }

    enableButton(buttonKey: keyof TFooterButtonManager): void {
        this.buttons[buttonKey].disabled = false;
    }
}
