import { Routes } from '@angular/router';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { TrackingComponent} from '../../tracking/tracking.component';
import { NodeTracingComponent } from '../../node-tracing/node-tracing.component';
import { DeveloperSectionComponent } from '../../developer-section/developer-section.component';
import { AnalyticsComponent } from '../../analytics/analytics.component';
import { AuthGuardService}from'../../auth-guard.service';
import { ChangepasswordComponent } from '../../changepassword/changepassword.component';
import { UserprofileComponent } from '../../userprofile/userprofile.component';
import { RouteResolver } from '../../resolvers/route.resolver';
import { TracingComponent } from '../../tracing/tracing.component';
export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',           component: DashboardComponent,canActivate:[AuthGuardService]},
    { path: 'tracking',            component: TrackingComponent,canActivate:[AuthGuardService] },
    { path: 'tracing',        component: NodeTracingComponent,canActivate:[AuthGuardService] },
    { path: 'developer-section',   component: DeveloperSectionComponent,canActivate: [AuthGuardService] },
    { path: 'analytic',            component: AnalyticsComponent,canActivate:         [AuthGuardService] },
    { path: 'userprofile',         component: UserprofileComponent ,canActivate:  [AuthGuardService] },   
    { path: 'changepassword',      component: ChangepasswordComponent ,canActivate:  [AuthGuardService] },   
    { path: 'node-tracing'      ,      component: TracingComponent,canActivate:  [AuthGuardService]  },        
];
