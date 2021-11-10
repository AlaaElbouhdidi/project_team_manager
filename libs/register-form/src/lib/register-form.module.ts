import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterFormComponent } from './register-form/register-form.component';
import { LoaderModule } from '@integrationsprojekt2/loader'
import { AlertModule} from '@integrationsprojekt2/alert'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule, FaIconLibrary, } from '@fortawesome/angular-fontawesome';
import {
    faEnvelope,
    faLock,
    faExclamationCircle,
    faCheckCircle,
    faTimesCircle,
    faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        LoaderModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        AlertModule
    ],
    declarations: [RegisterFormComponent],
    exports: [RegisterFormComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RegisterFormModule {
    constructor(library: FaIconLibrary) {
        library.addIcons(
            faEnvelope,
            faLock,
            faExclamationCircle,
            faCheckCircle,
            faTimesCircle,
            faExclamationTriangle
        );
    }
}
