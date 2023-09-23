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
export class AppComponent implements OnInit {
    @ViewChild(FooterComponent) set footer(footer: FooterComponent) {
        if (footer) {
            this.footerManagerService.connectTo(footer);
        }
    }

    title = 'KtdGridBreakpointAlgorithm';

    layout: KtdGridLayout = [];

    static readonly DefaultColumnCount = 12;

    constructor(private footerManagerService: FooterManagerService) {
        this.setupFooter();
        this.setupLayout();
    }

    ngOnInit(): void {
        if (this.footer) {
            this.footerManagerService.connectTo(this.footer);
        }
    }

    private setupFooter(): void {
        const footerButtons: FooterButtonManager = {
            generate: new FooterButtonModel(
                'Generate Layout',
                this.generateLayout.bind(this)
            ),
        } as const;

        this.footerManagerService.setFooterButtons(footerButtons);
    }

    private setupLayout(): void {
        this.layout = [];

        let x = 0;
        let y = 0;
        const width = 2;
        const height = 2;
        for (let i = 1; i <= AppComponent.DefaultColumnCount; i++) {
            this.layout.push({
                w: width,
                h: height,
                x: x,
                y: y,
                id: i.toString(),
            });

            if (x + width >= AppComponent.DefaultColumnCount) {
                x = 0;
                y += height;
            } else {
                x += width;
            }
        }
    }

    private generateLayout() {
        const layout: KtdGridLayout = [];
        for (let i = 0; i < AppComponent.DefaultColumnCount; i++) {
            const y = Math.ceil(Math.random() * 4) + 1;
            layout.push({
                x:
                    Math.round(
                        Math.random() *
                            Math.floor(AppComponent.DefaultColumnCount / 2 - 1)
                    ) * 2,
                y: Math.floor(i / 6) * y,
                w: 2,
                h: y,
                id: (i + 1).toString(),
            });
        }
        this.layout = ktdGridCompact(
            layout,
            'vertical',
            AppComponent.DefaultColumnCount
        );
    }
}
