import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular/standalone';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonRow,
  IonCol,
  IonButton,
  IonBadge,
  IonList,
  IonItemGroup,
  IonItemDivider,
  IonItem
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  calendarOutline, 
  listOutline, 
  chevronBack, 
  chevronForward,
  leaf,
  arrowBackOutline,
  flashOutline,
  waterOutline,
  pawOutline,
  earth,
  bugOutline,
  leafOutline,
  boat,
  sunny,
  trashOutline,
  cloudOutline,
  bicycle,
  restaurant,
  shield,
  trailSign
} from 'ionicons/icons';
import { EcoCalendarService, EcoEvent } from '../../services/eco-calendar.service';

@Component({
  selector: 'app-eco-calendar',
  templateUrl: './eco-calendar.page.html',
  styleUrls: ['./eco-calendar.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonRow,
    IonCol,
    IonButton,
    IonBadge,
    IonList,
    IonItemGroup,
    IonItemDivider,
    IonItem
  ]
})
export class EcoCalendarPage implements OnInit {
  view = 'calendar';
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  currentDate = new Date();
  currentMonth = this.currentDate.getMonth();
  currentYear = this.currentDate.getFullYear();
  calendarDays: (Date | null)[] = [];
  groupedEvents: { [key: string]: EcoEvent[] } = {};
  upcomingEventsCount = 0; // Number of upcoming events to show
  constructor(private ecoCalendarService: EcoCalendarService, private alertController: AlertController,
     private router: Router,) {
    addIcons({  calendarOutline, 
      listOutline, 
      chevronBack, 
      chevronForward,
      leaf,
      arrowBackOutline,
      flashOutline,
      waterOutline,
      pawOutline,
      earth,
      bugOutline,
      leafOutline,
      boat,
      sunny,
      trashOutline,
      cloudOutline,
      bicycle,
      restaurant,
      shield,
      trailSign});
  }

  ngOnInit() {
    this.generateCalendarDays();
    this.loadEvents();
    this.updateUpcomingEventsCount();
  }
  private updateUpcomingEventsCount() {
    const today = new Date();
    const events = this.ecoCalendarService.getAllEvents();
    this.upcomingEventsCount = events.filter(event => event.date >= today).length;
  }
  get currentMonthYear(): string {
    return new Date(this.currentYear, this.currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' });
  }
  generateCalendarDays() {
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
    const lastDayOfMonth = new Date(this.currentYear, this.currentMonth + 1, 0);
    
    // Get the starting day of the week (0-6)
    const startingDayIndex = firstDayOfMonth.getDay();
    
    // Clear existing days
    this.calendarDays = [];
    
    // Add empty slots for days before the first of the month
    for (let i = 0; i < startingDayIndex; i++) {
      this.calendarDays.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      this.calendarDays.push(new Date(this.currentYear, this.currentMonth, day));
    }
  }
  loadEvents() {
    // Get events for current month and year
    const events = this.ecoCalendarService.getAllEvents().filter(event => 
      event.date.getMonth() === this.currentMonth &&
      event.date.getFullYear() === this.currentYear
    );
    this.groupEvents(events);
    this.updateUpcomingEventsCount();
  }


  groupEvents(events: EcoEvent[]) {
    this.groupedEvents = events.reduce((groups: { [key: string]: EcoEvent[] }, event) => {
      const month = event.date.toLocaleString('default', { month: 'long' });
      if (!groups[month]) {
        groups[month] = [];
      }
      groups[month].push(event);
      return groups;
    }, {});
  }

  previousMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.refreshCalendar();
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.refreshCalendar();
  }
  private refreshCalendar() {
    this.generateCalendarDays();
    this.loadEvents();
  }

  isToday(date: Date | null): boolean {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  hasEvent(date: Date | null): boolean {
    if (!date) return false;
    
    return this.ecoCalendarService.getAllEvents()
      .some(event => 
        event.date.getDate() === date.getDate() && 
        event.date.getMonth() === date.getMonth() && 
        event.date.getFullYear() === date.getFullYear()
      );
  }


  showDayEvents(date: Date | null) {
    if (!date) return;
    
    const events = this.ecoCalendarService.getEvents(this.currentMonth)
      .filter(event => event.date.toDateString() === date.toDateString());
      
    if (events.length > 0) {
      // You can implement your own logic to display events
      // For example, show in a modal or update a section of the page
      console.log('Events for', date.toDateString(), ':', events);
    }
  }

  goBack() {
    this.router.navigate(['/tabs/home']);
  }

  async showEventDetails(event: EcoEvent) {
    const alert = await this.alertController.create({
      header: event.title,
      subHeader: event.date.toLocaleDateString(),
      message: event.description,
      buttons: ['OK']
    });

    await alert.present();
  }

  segmentChanged(event: any) {
    this.view = event.detail.value;
  }
}
