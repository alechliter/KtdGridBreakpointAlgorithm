import { Component, Input, OnInit } from '@angular/core';
import { FooterButtonModel } from '../models/footer-button.model';

@Component({
    selector: 'grid-footer',
    templateUrl: 'footer.component.html',
})
export class FooterComponent {
    @Input() footerButtons: Array<FooterButtonModel> = [];

    @Input() hidden: boolean = false;

    constructor() {}
}
