// attendance-log.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { AttendanceLogPage } from './attendance-log.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: AttendanceLogPage }])
  ],
  declarations: [AttendanceLogPage]
})
export class AttendanceLogPageModule {}