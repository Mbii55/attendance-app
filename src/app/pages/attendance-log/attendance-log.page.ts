import { Component } from '@angular/core';
import { AttendanceService } from '../../services/attendance.service';

@Component({
  selector: 'app-attendance-log',
  templateUrl: './attendance-log.page.html',
  styleUrls: ['./attendance-log.page.scss'],
  standalone: false
})
export class AttendanceLogPage {

  months = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  attendanceByMonth: any[] = [];

  constructor(private attendanceService: AttendanceService) {}

  ionViewWillEnter() {
    const data = this.attendanceService.getAttendanceByMonth();
    
    // add expanded property to each day for toggle functionality
    this.attendanceByMonth = data.map(month => ({
      ...month,
      days: month.days.map((day: any) => ({ ...day, expanded: false }))
    }));
  }

  toggleDay(day: any) {
    day.expanded = !day.expanded;
  }

  // convert month (2026-02) to month name in arabic
  getMonthName(monthStr: string): string {
    const monthIndex = parseInt(monthStr.split('-')[1]) - 1;
    return `شهر ${this.months[monthIndex]}`;
  }

  // convert date from YYYY-MM-DD to DD/MM/YYYY
  formatDate(dateStr: string): string {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  }

  // format time as HH:MM
  formatTime(date: Date): string {
    const d = new Date(date);
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}