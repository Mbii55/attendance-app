import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AttendanceService } from '../../services/attendance.service';
import { Person } from '../../models/person.model';

@Component({
  selector: 'app-add-person',
  templateUrl: './add-person.page.html',
  styleUrls: ['./add-person.page.scss'],
  standalone: false
})
export class AddPersonPage {

  personName = '';
  persons: Person[] = [];

  constructor(
    private attendanceService: AttendanceService,
    private toastController: ToastController
  ) {}

  ionViewWillEnter() {
    this.attendanceService.getPersons().subscribe(data => this.persons = data);
  }

 
  private getNameParts(): string[] {
    return this.personName.trim().split(' ').filter(p => p);
  }

  
  get hasInput(): boolean {
    return this.personName.trim().length > 0;
  }

  // add new person with validation
  async addPerson() {
    const parts = this.getNameParts();

    // show error if less than 2 names
    if (parts.length < 2) {
      const toast = await this.toastController.create({
        message: 'الرجاء إدخال الاسم الأول والأخير',
        duration: 2000,
        position: 'bottom',
        color: 'danger'
      });
      toast.present();
      return;
    }

    // add person and clear input
    this.attendanceService.addPerson({
      firstName: parts[0],
      lastName: parts.slice(1).join(' ')
    });
    this.personName = '';
  }

  // delete a person
  deletePerson(id: string) {
    this.attendanceService.deletePerson(id);
  }
}