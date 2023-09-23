import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FooterComponent } from './containers/footer.component';
import { FooterViewComponent } from './views/footer-view.component';

@NgModule({
    imports: [CommonModule],
    declarations: [FooterComponent, FooterViewComponent],
    exports: [FooterComponent],
})
export class FooterModule {}
