import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { filter, Subject, takeUntil } from "rxjs";

import { ErrorIndicatorService } from "../../core/services/error-indicator.service";
import { ErrorIndicatorType } from '../../core/enums/error-indicator-type';
import { ErrorIndicatorAction } from '../../core/models/error-indicator-action';

@Component({
  selector: 'app-error-indicator',
  templateUrl: './error-indicator.component.html',
  styleUrls: ['./error-indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorIndicatorComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();

  isShown = false;

  invalidRows: number[] = [];
  currentRow = -1;
  currentRowNumber = -1;

  constructor(private readonly cdr: ChangeDetectorRef, private readonly errorIndicatorService: ErrorIndicatorService) { }

  ngOnInit(): void {
    this.onOpen();
    this.onClose();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  emitUpClick(): void {
    const minRowNumber = 1;
    if (this.currentRowNumber <= minRowNumber) return;
    this.decreaseCurrentRowNumber();
    this.updateCurrentRow()
    this.cdr.detectChanges();
    this.errorIndicatorService.emitMove(this.currentRow);
  }

  emitDownClick(): void {
    if (this.currentRowNumber >= this.invalidRows.length) return;
    this.increaseCurrentRowNumber();
    this.updateCurrentRow();
    this.cdr.detectChanges();
    this.errorIndicatorService.emitMove(this.currentRow);
  }

  emitCloseClick(): void {
    this.errorIndicatorService.emitClose();
  }

  private increaseCurrentRowNumber(): void {
    this.currentRowNumber++;
  }

  private decreaseCurrentRowNumber(): void {
    this.currentRowNumber--;
  }

  private updateCurrentRow(): void {
    const shift = 1;
    this.currentRow = this.invalidRows[this.currentRowNumber - shift];
  }

  private onOpen(): void {
    this.errorIndicatorService.action$.pipe(
      filter(({ type }: ErrorIndicatorAction) => type === ErrorIndicatorType.OPEN),
      takeUntil(this.destroy$)
    ).subscribe(({ value }: ErrorIndicatorAction) => {
      if (value) {
        this.invalidRows = value as number[];
        this.currentRow = this.invalidRows[0];
        this.currentRowNumber = 1;
        this.isShown = true;
        this.cdr.detectChanges();
        this.errorIndicatorService.emitMove(this.currentRow);
      }
    });
  }

  private onClose(): void {
    this.errorIndicatorService.action$.pipe(
      filter(({ type }: ErrorIndicatorAction) => type === ErrorIndicatorType.CLOSE),
      takeUntil(this.destroy$)
    ).subscribe(({ value }: ErrorIndicatorAction) => {
      if (!value) {
        this.isShown = false;
        this.cdr.detectChanges();
      }
    });
  }
}
