import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { LandingpageRoutingModule } from './landingpage/landingpage-routing.module';
import { SlideshowModule } from '@slideshow';
import { AuthService } from '@services';
import { BgAnimationModule } from '@bg-animation';

@NgModule({
    declarations: [LandingpageComponent],
    imports: [
        CommonModule,
        LandingpageRoutingModule,
        SlideshowModule,
        BgAnimationModule
    ],
    providers: [AuthService],
    exports: [LandingpageComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LandingpageModule {}
