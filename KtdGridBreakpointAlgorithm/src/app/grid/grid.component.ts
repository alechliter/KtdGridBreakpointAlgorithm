import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { FooterManagerService } from '../footer/services/footer-manager.service';

@Component({
    selector: 'grid',
    templateUrl: 'grid.component.html',
    providers: [GridBreakpointsService],
    styleUrls: ['grid.component.scss'],
})
export class GridComponent implements OnDestroy {
    @Input('layout') set baseLayout(layout: KtdGridLayout) {
        this.layout = layout;
        this.gridBreakpointsService.baseLayout = this.layout;
    }

    @ViewChild(KtdGridComponent) gridComponent: KtdGridComponent | undefined;

    columnCount: Observable<number>;

    layout: KtdGridLayout = [];

    trackById = ktdTrackById;

    private unsubscribe = new Subject<void>();

    constructor(private gridBreakpointsService: GridBreakpointsService) {
        this.columnCount = this.gridBreakpointsService.columnCount;

        this.setupBreakpointListener();
        this.setupWindowResizeListener();
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
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

    private setupWindowResizeListener(): void {
        fromEvent(window, 'resize')
            .pipe(debounceTime(100), takeUntil(this.unsubscribe))
            .subscribe((e) => {
                this.gridComponent?.resize();
            });
    }
}
