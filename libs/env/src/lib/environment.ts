/**
 * Development environment variables
 */
import { Environment } from '@api-interfaces';

export const environment: Environment = {
    firebase: {
        apiKey: 'AIzaSyCF0w37bc980S6avy5lVCYZqHTw4RYkGjc',
        authDomain: 'mate-team.de',
        projectId: 'mate-team',
        storageBucket: 'mate-team.appspot.com',
        messagingSenderId: '848103878945',
        appId: '1:848103878945:web:2d78aef8264f87f52b0e60',
    },
    production: false,
    apiUrl: 'http://localhost:5001/mate-team/europe-west1/api',
};