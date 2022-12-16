import { NativeDateAdapter } from "@angular/material/core";

export class PickDateAdapter extends NativeDateAdapter {
    override format(date: Date, displayFormat: Object): string {
        if(displayFormat === 'input') {
            return date.toISOString().split('T')[0];
        } else {
            return date.toISOString().split('T')[0];
        }
    }
}