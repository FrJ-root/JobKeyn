import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'truncate',
    standalone: true
})
export class TruncatePipe implements PipeTransform {
    transform(value: string, limit: number = 150): string {
        if (!value) return '';
        // Strip HTML tags
        const text = value.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
        if (text.length <= limit) return text;
        return text.substring(0, limit).trim() + '…';
    }
}
