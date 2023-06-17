import { Component, OnInit } from '@angular/core';
import { GridBreakpointsService } from './services/grid-breakpoints.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'grid',
    templateUrl: 'grid.component.html',
    providers: [GridBreakpointsService],
    styleUrls: ['grid.component.scss'],
})
export class GridComponent implements OnInit {
    columnCount: Observable<number>;

    constructor(private gridBreakpointsService: GridBreakpointsService) {
        this.columnCount = this.gridBreakpointsService.columnCount;
    }

    ngOnInit() {}
}
