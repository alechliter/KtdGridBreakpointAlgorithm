import { Component, OnInit, ViewChild } from '@angular/core';
import { KtdGridLayout, ktdGridCompact } from '@katoid/angular-grid-layout';
import { AppComponent } from '../app.component';
import { FooterComponent } from '../footer/containers/footer.component';
import { FooterButtonModel } from '../footer/models/footer-button.model';
import {
    FooterManagerService,
    FooterButtonManager,
} from '../footer/services/footer-manager.service';

@Component({
    selector: 'example-layout',
    templateUrl: './example-layout.component.html',
    styleUrls: ['./example-layout.component.scss'],
    providers: [FooterManagerService],
})
export class ExampleLayoutComponent implements OnInit {
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
        for (let i = 1; i <= ExampleLayoutComponent.DefaultColumnCount; i++) {
            this.layout.push({
                w: width,
                h: height,
                x: x,
                y: y,
                id: i.toString(),
            });

            if (x + width >= ExampleLayoutComponent.DefaultColumnCount) {
                x = 0;
                y += height;
            } else {
                x += width;
            }
        }
    }

    private generateLayout() {
        const layout: KtdGridLayout = [];
        for (let i = 0; i < ExampleLayoutComponent.DefaultColumnCount; i++) {
            const y = Math.ceil(Math.random() * 4) + 1;
            layout.push({
                x:
                    Math.round(
                        Math.random() *
                            Math.floor(
                                ExampleLayoutComponent.DefaultColumnCount / 2 -
                                    1
                            )
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
            ExampleLayoutComponent.DefaultColumnCount
        );
    }
}
