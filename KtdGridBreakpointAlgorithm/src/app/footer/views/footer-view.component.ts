import { Component, Input, OnInit } from '@angular/core';
import { FooterButtonModel } from '../models/footer-button.model';

@Component({
    selector: 'grid-footer-view',
    templateUrl: 'footer-view.component.html',
    styleUrls: ['footer-view.component.scss'],
})
export class FooterViewComponent {
    @Input() footerButtons: Array<FooterButtonModel> = [];

    @Input() hidden: boolean = false;

    constructor() {}
}
