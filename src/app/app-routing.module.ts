import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from './layout/app.layout.component';
import { AuthGuard } from './auth.guard';

@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                {
                    path: '',
                    component: AppLayoutComponent,
                    children: [
                        {
                            path: '',
                            canActivate: [AuthGuard],
                            loadChildren: () =>
                                import(
                                    './demo/components/dashboard/dashboard.module'
                                ).then((m) => m.DashboardModule),
                        },
                        {
                            path: 'appointments',
                            canActivate: [AuthGuard],
                            loadChildren: () =>
                                import(
                                    './appointments/appointments.module'
                                ).then((m) => m.AppointmentsModule),
                        },
                        {
                            path: 'users',
                            canActivate: [AuthGuard],
                            loadChildren: () =>
                                import('./users/users.module').then(
                                    (m) => m.UsersModule
                                ),
                        },
                        {
                            path: 'products',
                            canActivate: [AuthGuard],
                            loadChildren: () =>
                                import('./products/products.module').then(
                                    (m) => m.ProductsModule
                                ),
                        },
                        {
                            path: 'doctors',
                            canActivate: [AuthGuard],
                            loadChildren: () =>
                                import('./doctors/doctors.module').then(
                                    (m) => m.DoctorsModule
                                ),
                        },
                        {
                            path: 'patients',
                            canActivate: [AuthGuard],
                            loadChildren: () =>
                                import('./patients/patients.module').then(
                                    (m) => m.PatientsModule
                                ),
                        },
                        {
                            path: 'invoices',
                            canActivate: [AuthGuard],
                            loadChildren: () =>
                                import('./invoices/invoices.module').then(
                                    (m) => m.InvoicesModule
                                ),
                        },
                        {
                            path: 'utilities',
                            loadChildren: () =>
                                import(
                                    './demo/components/utilities/utilities.module'
                                ).then((m) => m.UtilitiesModule),
                        },
                        {
                            path: 'documentation',
                            loadChildren: () =>
                                import(
                                    './demo/components/documentation/documentation.module'
                                ).then((m) => m.DocumentationModule),
                        },
                        {
                            path: 'blocks',
                            loadChildren: () =>
                                import(
                                    './demo/components/primeblocks/primeblocks.module'
                                ).then((m) => m.PrimeBlocksModule),
                        },
                        {
                            path: 'pages',
                            loadChildren: () =>
                                import(
                                    './demo/components/pages/pages.module'
                                ).then((m) => m.PagesModule),
                        },
                    ],
                },
                {
                    path: 'auth',
                    loadChildren: () =>
                        import('./auth/auth.module').then((m) => m.AuthModule),
                },
                {
                    path: 'landing',
                    loadChildren: () =>
                        import('./demo/components/landing/landing.module').then(
                            (m) => m.LandingModule
                        ),
                },
                { path: 'notfound', component: NotfoundComponent },
                { path: '**', redirectTo: '/notfound' },
            ],
            {
                scrollPositionRestoration: 'enabled',
                anchorScrolling: 'enabled',
                onSameUrlNavigation: 'reload',
            }
        ),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
