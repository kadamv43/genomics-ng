import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionLogsListComponent } from './action-logs-list/action-logs-list.component';

const routes: Routes = [{ path: '', component: ActionLogsListComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ActionLogsRoutingModule {}
