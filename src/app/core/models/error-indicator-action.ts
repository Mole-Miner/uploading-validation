import { ErrorIndicatorType } from "../enums/error-indicator-type";

export interface ErrorIndicatorAction {
  type: ErrorIndicatorType;
  value?: number | number[];
}
