import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GridBreakpointsService } from './services/grid-breakpoints.service';
import { Observable, Subject, debounceTime, fromEvent, takeUntil } from 'rxjs';
import { Layout } from '@katoid/angular-grid-layout/lib/utils/react-grid-layout.utils';
import {
    KtdGridComponent,
    KtdGridLayout,
    ktdGridCompact,
    ktdTrackById,
} from '@katoid/angular-grid-layout';
import { wrapLayout } from './utils/layout-manipulation.utils';

@Component({
    selector: 'grid',
    templateUrl: 'grid.component.html',
    providers: [GridBreakpointsService],
    styleUrls: ['grid.component.scss'],
})
export class GridComponent implements OnInit, OnDestroy {
    @ViewChild(KtdGridComponent) gridComponent: KtdGridComponent | undefined;

    columnCount: Observable<number>;

    layout: KtdGridLayout = [];

    trackById = ktdTrackById;

    private static readonly DefaultColumnCount = 12;

    private unsubscribe = new Subject<void>();

    constructor(private gridBreakpointsService: GridBreakpointsService) {
        this.columnCount = this.gridBreakpointsService.columnCount;

        this.setupBreakpointListener();
        this.setupWindowResizeListener();
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
    }

    ngOnInit() {
        this.setupLayout();
    }

    onLayoutChanges(layoutChanges: KtdGridLayout): void {
        this.layout = [...layoutChanges];
        this.gridBreakpointsService.baseLayout = this.layout;
    }

    private setupBreakpointListener(): void {
        this.gridBreakpointsService.columnCount
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((columnCount) => {
                this.layout = [
                    ...this.gridBreakpointsService.getBreakpointLayout(
                        columnCount
                    ),
                ];
            });
    }

    generateLayout() {
        const layout: KtdGridLayout = [];
        for (let i = 0; i < GridComponent.DefaultColumnCount; i++) {
            const y = Math.ceil(Math.random() * 4) + 1;
            layout.push({
                x:
                    Math.round(
                        Math.random() *
                            Math.floor(GridComponent.DefaultColumnCount / 2 - 1)
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
            GridComponent.DefaultColumnCount
        );

        this.gridBreakpointsService.baseLayout = this.layout;
    }

    private setupLayout(): void {
        this.layout = [];

        let x = 0;
        let y = 0;
        const width = 2;
        const height = 2;
        for (let i = 1; i <= 12; i++) {
            this.layout.push({
                w: width,
                h: height,
                x: x,
                y: y,
                id: i.toString(),
            });

            if (x + width >= 12) {
                x = 0;
                y += height;
            } else {
                x += width;
            }
        }

        this.gridBreakpointsService.baseLayout = this.layout;
    }

    private setupWindowResizeListener(): void {
        fromEvent(window, 'resize')
            .pipe(debounceTime(100), takeUntil(this.unsubscribe))
            .subscribe((e) => {
                this.gridComponent?.resize();
            });
    }
}
