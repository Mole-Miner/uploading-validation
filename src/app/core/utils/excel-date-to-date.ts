export function excelDateToDate(value: number): Date {
  return new Date(Math.round((value - 25569)*86400*1000))
}
