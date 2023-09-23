import { Component, OnInit, ViewChild } from '@angular/core';
import {
    FooterButtonManager,
    FooterManagerService,
} from './footer/services/footer-manager.service';
import { FooterComponent } from './footer/containers/footer.component';
import { FooterButtonModel } from './footer/models/footer-button.model';
import { KtdGridLayout, ktdGridCompact } from '@katoid/angular-grid-layout';
import { GridComponent } from './grid/grid.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [FooterManagerService],
})
export class AppComponent {}
