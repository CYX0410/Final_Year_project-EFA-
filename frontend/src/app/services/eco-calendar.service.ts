import { Injectable } from '@angular/core';

export interface EcoEvent {
  date: Date;
  title: string;
  description: string;
  category: 'climate' | 'wildlife' | 'resource' | 'awareness' | 'conservation';
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class EcoCalendarService {
  private ecoEvents: EcoEvent[] = [
    {
      date: new Date(new Date().getFullYear(), 0, 10),
      title: 'Cut Your Energy Costs Day',
      description: 'Focus on energy conservation and efficiency in daily life',
      category: 'resource',
      icon: 'flash-outline'
    },
    {
      date: new Date(new Date().getFullYear(), 1, 2),
      title: 'World Wetlands Day',
      description: 'Raising awareness about the importance of wetlands',
      category: 'conservation',
      icon: 'water-outline'
    },
    // ... Add all other eco events similarly
  ];

  getEvents(month: number): EcoEvent[] {
    return this.ecoEvents.filter(event => event.date.getMonth() === month);
  }

  getAllEvents(): EcoEvent[] {
    return this.ecoEvents;
  }

  getUpcomingEvents(count: number = 3): EcoEvent[] {
    const today = new Date();
    return this.ecoEvents
      .filter(event => event.date >= today)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, count);
  }
}