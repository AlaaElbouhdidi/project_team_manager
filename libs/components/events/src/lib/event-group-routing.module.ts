import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
    redirectLoggedInTo,
    canActivate,
} from '@angular/fire/compat/auth-guard';
import {EventsGroupsPageMobileComponent} from "./events-groups-page-mobile/events-groups-page-mobile.component";
import {EventsGroupsPageComponent} from "./events-groups-page/events-groups-page.component";

const redirectAuthenticatedToHome = () => redirectLoggedInTo(['/']);

const routes: Routes = [
    {
        path: '',
        component: EventsGroupsPageComponent,
        ...canActivate(redirectAuthenticatedToHome),
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class EventGroupRoutingModule {}
