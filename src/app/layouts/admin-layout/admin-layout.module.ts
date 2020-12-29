import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { TrackingComponent} from '../../tracking/tracking.component';
import { NodeTracingComponent } from '../../node-tracing/node-tracing.component';
import { DeveloperSectionComponent } from '../../developer-section/developer-section.component';
import { AnalyticsComponent } from '../../analytics/analytics.component';
import { ChangepasswordComponent } from '../../changepassword/changepassword.component';
import { UserprofileComponent } from '../../userprofile/userprofile.component';
import { ChartsModule } from 'ng2-charts';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { RouteResolver } from '../../resolvers/route.resolver';
import { TracingComponent } from '../../tracing/tracing.component';

import {
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatFormFieldModule,
  MatTooltipModule,
  MatSelectModule,
} from '@angular/material';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    NgxPaginationModule,
    ChartsModule,
    NgxGraphModule,
    NgxChartsModule
  ],
  declarations: [
    DashboardComponent,
    TrackingComponent,
    NodeTracingComponent,
    DeveloperSectionComponent,
    AnalyticsComponent,
    ChangepasswordComponent,
    UserprofileComponent,
    TracingComponent
  ],
  providers: [ RouteResolver ]
})

export class AdminLayoutModule {}
