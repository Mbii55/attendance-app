import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';
import { Person } from '../models/person.model';
import { AttendanceRecord } from '../models/attendance.model';

@Injectable({ providedIn: 'root' })
export class AttendanceService {

  private persons$ = new BehaviorSubject<Person[]>([]);
  private attendance$ = new BehaviorSubject<AttendanceRecord[]>([]);

  constructor(private storage: Storage) {
    this.init();
  }

  // initialize storage and load saved data
  async init() {
    await this.storage.create();
    
    const persons = await this.storage.get('persons') || [];
    const attendance = await this.storage.get('attendance') || [];
    
    this.persons$.next(persons);
    this.attendance$.next(attendance);
  }

  // get all persons as observable
  getPersons() {
    return this.persons$.asObservable();
  }

  // add a new person to the list
  async addPerson(person: Omit<Person, 'id' | 'createdAt'>) {
    const newPerson: Person = {
      ...person,
      id: Date.now().toString(),
      createdAt: new Date()
    };

    const updated = [...this.persons$.value, newPerson];
    await this.storage.set('persons', updated);
    this.persons$.next(updated);
  }

  // delete a person by id
  async deletePerson(id: string) {
    const updated = this.persons$.value.filter(p => p.id !== id);
    await this.storage.set('persons', updated);
    this.persons$.next(updated);
  }

  // mark attendance for a person
  async markAttendance(person: Person) {
    const now = new Date();
    
    const record: AttendanceRecord = {
      id: Date.now().toString(),
      personId: person.id,
      personName: `${person.firstName} ${person.lastName}`,
      checkInTime: now,
      date: now.toISOString().split('T')[0]
    };

    const updated = [...this.attendance$.value, record];
    await this.storage.set('attendance', updated);
    this.attendance$.next(updated);
  }

  // check if person already checked in today
  hasCheckedInToday(personId: string): boolean {
    const today = new Date().toISOString().split('T')[0];
    return this.attendance$.value.some(record => 
      record.personId === personId && record.date === today
    );
  }

  // get attendance records grouped by month and day
  getAttendanceByMonth() {
    const records = this.attendance$.value;
    const monthsMap: any = {};

    records.forEach(record => {
      const date = new Date(record.checkInTime);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthsMap[monthKey]) {
        monthsMap[monthKey] = { month: monthKey, days: {} };
      }

      if (!monthsMap[monthKey].days[record.date]) {
        monthsMap[monthKey].days[record.date] = [];
      }

      monthsMap[monthKey].days[record.date].push(record);
    });

    // convert to array and sort by date
    const months = Object.values(monthsMap).map((month: any) => ({
      month: month.month,
      days: Object.entries(month.days)
        .map(([date, records]) => ({ date, records }))
        .sort((a, b) => b.date.localeCompare(a.date))
    }));

    return months.sort((a: any, b: any) => b.month.localeCompare(a.month));
  }
}