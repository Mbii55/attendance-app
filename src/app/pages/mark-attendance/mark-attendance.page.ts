import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AttendanceService } from '../../services/attendance.service';
import { Person } from '../../models/person.model';

@Component({
  selector: 'app-mark-attendance',
  templateUrl: './mark-attendance.page.html',
  styleUrls: ['./mark-attendance.page.scss'],
  standalone: false
})
export class MarkAttendancePage {

  days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  persons: Person[] = [];

  constructor(
    private attendanceService: AttendanceService,
    private alertController: AlertController
  ) {}


  ionViewWillEnter() {
    this.attendanceService.getPersons().subscribe(data => {
      this.persons = data;
    });
  }

  // check if person already checked in today
  hasCheckedIn(personId: string): boolean {
    return this.attendanceService.hasCheckedInToday(personId);
  }

  // mark attendance for a person
  async onPersonClick(person: Person) {
    if (this.hasCheckedIn(person.id)) {
      return;
    }

    const now = new Date();

    // format date as DD/MM/YYYY
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    const dateStr = `${day}/${month}/${year}`;

    // format time as HH:MM
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;

    // get Arabic day name
    const dayName = this.days[now.getDay()];

    // confirmation alert
    const alert = await this.alertController.create({
      header: `حضور ${person.firstName} ${person.lastName}`,
      subHeader: `يوم ${dayName} : ${dateStr}`,
      message: `الساعة ${timeStr}`,
      buttons: [
        {
          text: 'إلغاء',
          role: 'cancel'
        },
        {
          text: 'تأكيد',
          handler: () => {
            this.attendanceService.markAttendance(person);
          }
        }
      ]
    });

    await alert.present();
  }
}