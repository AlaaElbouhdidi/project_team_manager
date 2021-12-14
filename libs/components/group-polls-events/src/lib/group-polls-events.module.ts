import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupPollsEventsComponent } from './group-polls-events/group-polls-events.component';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
    faPoll,
    faCalendarAlt,
    faTimesCircle
} from '@fortawesome/free-solid-svg-icons';
import { CreatePollFormModule } from '@create-poll-form';

@NgModule({
    imports: [
        CommonModule,
        FontAwesomeModule,
        CreatePollFormModule
    ],
    declarations: [
      GroupPollsEventsComponent
    ],
    exports: [GroupPollsEventsComponent]
})
export class GroupPollsEventsModule {
    constructor(library: FaIconLibrary) {
        library.addIcons(
            faPoll,
            faCalendarAlt,
            faTimesCircle
        );
    }
}
