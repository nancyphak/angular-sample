import { Component } from '@angular/core';

let MODE = '';
let LABEL = '';
let TOOLTIP = '';

const mode = localStorage.getItem('VIEW_MODE');
if (mode === 'Preview') {
    MODE = 'Preview';
    LABEL = 'Preview';
    TOOLTIP = 'Switch to default mode';
} else {
    MODE = 'Default';
    LABEL = 'Default';
    TOOLTIP = 'Switch to preview mode';
}

@Component({
    selector: 'app-preview-toggle',
    templateUrl: './preview-toggle.component.html',
    styles: [`
        ::ng-deep .mat-slide-toggle-content{
            font: 400 14px/20px Roboto,"Helvetica Neue",sans-serif
        }
    `]
})
export class PreviewToggleComponent {
    mode = MODE;
    label = LABEL;
    tooltip = TOOLTIP;

    onToggleChange(event) {
        if (event.checked) {
            this.label = 'Preview';
            this.mode = 'Preview';
            this.tooltip = 'Switch to default mode';
        } else {
            this.mode = 'Default';
            this.label = 'Default';
            this.tooltip = 'Switch to preview mode';
        }
        this.saveToStorage();
        this.forceReload();
    }

    forceReload() {
        window.location.reload();
    }

    saveToStorage() {
        localStorage.setItem('VIEW_MODE', this.mode);
    }
}
