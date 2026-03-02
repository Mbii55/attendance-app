// mark-attendance.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { MarkAttendancePage } from './mark-attendance.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: MarkAttendancePage }])
  ],
  declarations: [MarkAttendancePage]
})
export class MarkAttendancePageModule {}