import { Pipe, PipeTransform } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Pipe({ name: 'highlight' })
export class HighlightPipe implements PipeTransform {
  transform(text: string, search: string) {
    const pattern = search
      .replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
      .split(' ')
      .filter(t => t.length > 0)
      .join('|');
    const regex = new RegExp(pattern, 'gi');

    return search ? text.replace(regex, match => `<b>${match}</b>`) : text;
  }
}

@Pipe({
  name: 'convertNumberToVND',
  standalone: true
})
export class NumberToVNDPipe implements PipeTransform {
  constructor(private translate: TranslateService) {

  }

  transform(value: number): string {
    const billion = 1000000000
    const billionText = this.translate.instant('generics.billion')
    const shortenedValue = value / billion
    return `${shortenedValue} ${billionText}`
  }
}