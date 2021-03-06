import { Component, OnDestroy } from '@angular/core';
import { AlertService, AuthService } from '@services';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

/**
 * Header component
 */
@Component({
    selector: 'mate-team-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnDestroy {
    /**
     * Authenticated State
     */
    authenticated = false;
    /**
     * Subscription of the auth state
     */
    authSubscription: Subscription;
    /**
     * Subscription of the auth state
     */
    myPhotoURL = '';

    /**
     * Constructor which subscribes the auth state
     * @param authService {AuthService}
     * @param alertService {AlertService}
     * @param router {Router}
     */
    constructor(
        private authService: AuthService,
        private alertService: AlertService,
        private router: Router
    ) {
        this.authSubscription = this.authService.authState$.subscribe(
            (state) => {
                state
                    ? (this.authenticated = true)
                    : (this.authenticated = false);
                if (state) this.myPhotoURL = state.photoURL || '';
            }
        );
    }

    /**
     * Logout the user and handle success and error case
     */
    async logout(): Promise<void> {
        try {
            await this.authService.logout();
            this.alertService.addAlert({
                type: 'success',
                message: 'Successfully logged out'
            });
        } catch (e) {
            this.alertService.addAlert({
                type: 'error',
                message: e.message
            });
        }
        await this.router.navigate(['/']);
    }

    /**
     * Unsubscribe from the auth state subscription
     */
    ngOnDestroy(): void {
        this.authSubscription.unsubscribe();
    }
}
