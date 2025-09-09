import { Pipe, PipeTransform } from '@angular/core';

@Pipe({standalone: true, name: 'phoneFormat'})
export class PhoneFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;
    return value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
}
