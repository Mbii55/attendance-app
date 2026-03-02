import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'add-person',
        loadChildren: () => import('../add-person/add-person.module').then(m => m.AddPersonPageModule)
      },
      {
        path: 'mark-attendance',
        loadChildren: () => import('../mark-attendance/mark-attendance.module').then(m => m.MarkAttendancePageModule)
      },
      {
        path: 'attendance-log',
        loadChildren: () => import('../attendance-log/attendance-log.module').then(m => m.AttendanceLogPageModule)
      },
      {
        path: '',
        redirectTo: 'add-person',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}