"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var core_1 = require("@angular/core");
var app_component_1 = require("./app.component");
var app_routing_module_1 = require("./app-routing.module");
var _core_1 = require("@core");
var compat_1 = require("@angular/fire/compat");
var firestore_1 = require("@angular/fire/firestore");
var service_worker_1 = require("@angular/service-worker");
var _env_1 = require("@env");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [app_component_1.AppComponent],
            imports: [
                _core_1.CoreModule,
                app_routing_module_1.AppRoutingModule,
                service_worker_1.ServiceWorkerModule.register('ngsw-worker.js', {
                    enabled: _env_1.environment.environment.production,
                    registrationStrategy: 'registerWhenStable:30000',
                }),
                compat_1.AngularFireModule.initializeApp(_env_1.environment.environment.firebase),
                firestore_1.FirestoreModule
            ],
            bootstrap: [app_component_1.AppComponent],
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
