import { Component, OnInit, ViewChild } from '@angular/core';
import { KtdGridLayout, ktdGridCompact } from '@katoid/angular-grid-layout';
import { AppComponent } from '../app.component';
import { FooterComponent } from '../footer/containers/footer.component';
import { FooterButtonModel } from '../footer/models/footer-button.model';
import { FooterManagerService } from '../footer/services/footer-manager.service';
import { FooterButtonManagerModel } from '../footer/models/footer-button-manager.model';

export type ExampleLayoutFooterButtons = {
    generate: FooterButtonModel;
    toggleGenerate: FooterButtonModel;
    hideToggleButton: FooterButtonModel;
};

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

    layout: KtdGridLayout = [];

    static readonly DefaultColumnCount = 12;

    constructor(
        private footerManagerService: FooterManagerService<ExampleLayoutFooterButtons>
    ) {
        this.setupFooter();
        this.setupLayout();
    }

    ngOnInit(): void {
        if (this.footer) {
            this.footerManagerService.connectTo(this.footer);
        }
    }

    private setupFooter(): void {
        this.footerManagerService.setFooterButtons(
            new FooterButtonManagerModel({
                hideToggleButton: new FooterButtonModel(
                    'Hide Toggle Button',
                    this.hideToggleButton.bind(this)
                ),
                toggleGenerate: new FooterButtonModel(
                    'Toggle Generate Layout',
                    this.toggleGenerateButton.bind(this)
                ),
                generate: new FooterButtonModel(
                    'Generate Layout',
                    this.generateLayout.bind(this)
                ),
            })
        );
    }

    private toggleGenerateButton(): void {
        if (!this.footerManagerService.buttons) {
            return;
        }

        if (this.footerManagerService.buttons.generate.disabled) {
            this.footerManagerService.enableButton('generate');
        } else {
            this.footerManagerService.disableButton('generate');
        }
    }

    private hideToggleButton(): void {
        if (!this.footerManagerService.buttons) {
            return;
        }

        if (this.footerManagerService.isButtonHidden('toggleGenerate')) {
            this.footerManagerService.buttons.hideToggleButton.label =
                'Hide Toggle Button';
            this.footerManagerService.showButton('toggleGenerate');
        } else {
            this.footerManagerService.buttons.hideToggleButton.label =
                'Show Toggle Button';
            this.footerManagerService.hideButton('toggleGenerate');
        }
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
