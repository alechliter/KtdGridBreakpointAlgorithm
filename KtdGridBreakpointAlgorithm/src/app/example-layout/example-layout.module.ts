import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';
import { AppComponent } from '../app.component';
import { FooterModule } from '../footer/footer.module';
import { GridModule } from '../grid/grid.module';
import { ExampleLayoutComponent } from './example-layout.component';

@NgModule({
    declarations: [ExampleLayoutComponent],
    imports: [BrowserModule, AppRoutingModule, GridModule, FooterModule],
    exports: [ExampleLayoutComponent],
})
export class ExampleLayoutModule {}
