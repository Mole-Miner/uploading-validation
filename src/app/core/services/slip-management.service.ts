import { Injectable } from '@angular/core';
import { formatDate } from "@angular/common";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";

import { TABLE_COLUMNS, TABLE_DATE_COLUMNS } from "../constants/table";
import { excelDateToDate } from "../utils/excel-date-to-date";
import { TableRow } from "../models/table-row";
import { requireNotEmptyValidator, requireNumberValidator } from "../validators/require.validator";

@Injectable()
export class SlipManagementService {

  mapTableSource(json: (number | string)[][]): TableRow[] {
    const tableShift = 7;
    const table: (string | number)[][] = json.splice(tableShift).filter((row: (string | number)[]) => row.length);
    return table.map((row: (string | number)[]) => {
      row.shift();
      return row.reduce((acc: { [p: string]: string | number | Date }, curr: number | string, i: number) => {
        const property = TABLE_COLUMNS[i];
        let value: string | number | Date = curr;
        if (this.isDateColumn(property)) value = formatDate(excelDateToDate(value as number), 'yyyy-MM-dd', 'en');
        acc[property] = value;
        return acc;
      }, {});
    }) as unknown[] as TableRow[];
  }

  isDateColumn(column: string): boolean {
    return TABLE_DATE_COLUMNS.includes(column);
  }

  getTableFormArray(tableSource: TableRow[]): FormArray<FormGroup> {
    return new FormArray<FormGroup>(tableSource.map((row: TableRow) => new FormGroup({
      'N°': new FormControl(row["N°"], [ Validators.required, requireNotEmptyValidator, requireNumberValidator ]),
      'Police Number': new FormControl(row["Police Number"], [ Validators.required, requireNotEmptyValidator, requireNumberValidator ]),
      'Branch': new FormControl(row["Branch"], [ Validators.required, requireNotEmptyValidator ]),
      'Category': new FormControl(row["Category"], [ Validators.required, requireNotEmptyValidator ]),
      'Nature of Risk / Activity': new FormControl(row["Nature of Risk / Activity"], [ Validators.required, requireNotEmptyValidator ]),
      'Effective Date': new FormControl(row["Effective Date"], [ Validators.required, requireNotEmptyValidator ]),
      'Deadline Date': new FormControl(row["Deadline Date"], [ Validators.required, requireNotEmptyValidator ]),
      'Transaction date / seized': new FormControl(row["Transaction date / seized"], [ Validators.required, requireNotEmptyValidator ]),
      'Subscriber': new FormControl(row["Subscriber"], [ Validators.required, requireNotEmptyValidator ]),
      'insured': new FormControl(row["insured"], [ Validators.required, requireNotEmptyValidator ]),
      'Location / Regis. Veh.': new FormControl(row["Location / Regis. Veh."], [ Validators.required, requireNotEmptyValidator ]),
      'Sum insured': new FormControl(row["Sum insured"], [ Validators.required, requireNotEmptyValidator, requireNumberValidator ]),
      'Prime HT': new FormControl(row["Prime HT"], [ Validators.required, requireNotEmptyValidator ]),
      'Commission paid': new FormControl(row["Commission paid"], [ Validators.required, requireNotEmptyValidator ]),
      'Part Cedant CoIns (%)': new FormControl(row["Part Cedant CoIns (%)"], [ Validators.required, requireNotEmptyValidator, requireNumberValidator ]),
    })));
  }
}
