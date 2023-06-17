import { Injectable, OnDestroy } from '@angular/core';
import { GridScreenBreakpoints } from '../enums/grid-screen-breakpoints.enum';
import { Observable, ReplaySubject, Subject, takeUntil } from 'rxjs';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

@Injectable()
export class GridBreakpointsService implements OnDestroy {
  columnCount: Observable<number>;

  private static readonly breakpoints: Map<GridScreenBreakpoints, number> =
    new Map([
      [GridScreenBreakpoints.XSmall, 2],
      [GridScreenBreakpoints.Small, 4],
      [GridScreenBreakpoints.Medium, 8],
      [GridScreenBreakpoints.Large, 12],
    ]);

  private _columnCount = new ReplaySubject<number>(1);

  private unsubscribe = new Subject<void>();

  constructor(private breakpointObserver: BreakpointObserver) {
    this.columnCount = this._columnCount.asObservable();

    this.setupBreakpointListeners();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
  }

  private setupBreakpointListeners(): void {
    this.breakpointObserver
      .observe([
        GridScreenBreakpoints.XSmall,
        GridScreenBreakpoints.Small,
        GridScreenBreakpoints.Medium,
        GridScreenBreakpoints.Large,
      ])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          let currentBreakpoint = GridScreenBreakpoints.Large;
          if (state.breakpoints[GridScreenBreakpoints.XSmall]) {
            currentBreakpoint = GridScreenBreakpoints.XSmall;
          } else if (state.breakpoints[GridScreenBreakpoints.Small]) {
            currentBreakpoint = GridScreenBreakpoints.Small;
          } else if (state.breakpoints[GridScreenBreakpoints.Medium]) {
            currentBreakpoint = GridScreenBreakpoints.Medium;
          } else if (state.breakpoints[GridScreenBreakpoints.Large]) {
            currentBreakpoint = GridScreenBreakpoints.Large;
          }
          this._columnCount.next(
            GridBreakpointsService.breakpoints.get(currentBreakpoint) ?? 0
          );
        }
      });
  }
}
