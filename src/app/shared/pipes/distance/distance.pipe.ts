import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'distance',
})
export class DistancePipe implements PipeTransform {
  transform(value: any, arg1: any, arg2: any): any {
    const conversionKey = {
      m: {
        km: 0.001,
        m: 1,
      },
      km: {
        km: 1,
        m: 1000,
      },
    };
    if (value && typeof value === 'number') {
      const result = value * conversionKey[arg1][arg2];
      return result.toFixed(2) + arg2;
    }
  }
}
