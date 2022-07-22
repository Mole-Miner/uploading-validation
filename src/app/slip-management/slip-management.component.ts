import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormGroup } from "@angular/forms";
import * as xlsx from 'xlsx';
import { filter, Subject, takeUntil } from "rxjs";

import { SlipManagementService } from "../core/services/slip-management.service";
import { TABLE_COLUMNS } from "../core/constants/table";
import { ErrorIndicatorService } from "../core/services/error-indicator.service";
import { ErrorIndicatorType } from '../core/enums/error-indicator-type';
import { ErrorIndicatorAction } from '../core/models/error-indicator-action';
import { TableRow } from "../core/models/table-row";

@Component({
  selector: 'app-slip-management',
  templateUrl: './slip-management.component.html',
  styleUrls: [ './slip-management.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlipManagementComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();

  readonly tableColumns: string[] = TABLE_COLUMNS;
  tableFormGroup!: FormGroup<{ tableRows: FormArray<FormGroup> }>;

  errorIndicatorPosition = -1;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    readonly tableService: SlipManagementService,
    private readonly errorIndicatorService: ErrorIndicatorService
  ) {
  }

  ngOnInit() {
    this.initTableFormGroup();
    this.onTableFormGroupValueChanges();
    this.onErrorIndicatorMove();
    this.onErrorIndicatorClose();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get tableRows(): FormArray<FormGroup> {
    return this.tableFormGroup.get('tableRows') as FormArray<FormGroup>;
  }

  onFile(file: File): void {
    const fileReader: FileReader = new FileReader();
    fileReader.onload = (e) => {
      const data = e.target?.result;
      const workBook: xlsx.WorkBook = xlsx.read(data, { type: 'binary' });
      const workSheet: xlsx.WorkSheet = workBook.Sheets[workBook.SheetNames[0]];
      const json: (number | string)[][] = xlsx.utils.sheet_to_json(workSheet, { header: 1 })
      const tableSource: TableRow[] = this.tableService.mapTableSource(JSON.parse(JSON.stringify(json)));
      this.tableFormGroup.setControl('tableRows', this.tableService.getTableFormArray(tableSource));
      this.cdr.detectChanges();
    }
    fileReader.readAsBinaryString(file);
  }

  submitForm(): void {
    if (this.tableFormGroup.invalid) {
      this.tableFormGroup.markAsTouched();
      return;
    }
    console.log(this.tableFormGroup.getRawValue());
  }

  private initTableFormGroup(): void {
    this.tableFormGroup = new FormGroup({
      tableRows: new FormArray<FormGroup>([])
    });
  }

  private onTableFormGroupValueChanges(): void {
    this.tableFormGroup.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      const invalidRows = this.tableRows.controls.filter((fg: FormGroup) => fg.invalid).map((fg: FormGroup) => {
        const value = fg.getRawValue() as TableRow;
        return value["N°"];
      });
      if (invalidRows.length) this.errorIndicatorService.emitOpen(invalidRows);
      else this.errorIndicatorService.emitClose();
    });
  }

  private onErrorIndicatorMove(): void {
    this.errorIndicatorService.action$.pipe(
      filter(({ type }: ErrorIndicatorAction) => type === ErrorIndicatorType.MOVE),
      takeUntil(this.destroy$)
    ).subscribe(({ value }: ErrorIndicatorAction) => {
      if (value) {
        const row = this.tableRows.controls.find((fg: FormGroup) => {
          const rowNumber = (fg.getRawValue() as TableRow)["N°"];
          return rowNumber === value;
        })!;
        this.errorIndicatorPosition = this.tableRows.controls.indexOf(row);
        this.cdr.detectChanges();
      }
    });
  }

  private onErrorIndicatorClose(): void {
    this.errorIndicatorService.action$.pipe(
      filter(({ type }: ErrorIndicatorAction) => type === ErrorIndicatorType.CLOSE),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.errorIndicatorPosition = -1;
      this.cdr.detectChanges();
    });
  }
}
