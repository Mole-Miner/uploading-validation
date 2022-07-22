import { Injectable } from '@angular/core';
import { Subject } from "rxjs";

import { ErrorIndicatorAction } from "../models/error-indicator-action";
import { ErrorIndicatorType } from '../enums/error-indicator-type';

@Injectable()
export class ErrorIndicatorService {
  private readonly action: Subject<ErrorIndicatorAction> = new Subject<ErrorIndicatorAction>();

  get action$(): Subject<ErrorIndicatorAction> {
    return this.action;
  }

  emitMove(value: number): void {
    this.action.next({ type: ErrorIndicatorType.MOVE, value })
  }

  emitOpen(value: number[]): void {
    this.action.next({ type: ErrorIndicatorType.OPEN, value });
  }

  emitClose(): void {
    this.action.next({ type: ErrorIndicatorType.CLOSE });
  }
}
