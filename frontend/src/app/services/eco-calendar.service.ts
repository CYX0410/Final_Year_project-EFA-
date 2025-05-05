import { Injectable } from '@angular/core';

export interface EcoEvent {
  date: Date;
  title: string;
  description: string;
  category: 'climate' | 'wildlife' | 'resource' | 'awareness' | 'conservation' | 'biodiversity'
  | 'pollution' | 'sustainability' | 'food' | 'ocean' | 'environment' | 'forestry' | 'water';
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
    {
      date: new Date(new Date().getFullYear(), 2, 3),
      title: 'World Wildlife Day',
      description: 'Celebrating and raising awareness of the world’s wild animals and plants',
      category: 'biodiversity',
      icon: 'paw-outline'
    },
    
    // March 21 – International Day of Forests
    {
      date: new Date(new Date().getFullYear(), 2, 21),
      title: 'International Day of Forests',
      description: 'Promoting sustainable management of all types of forests',
      category: 'forestry',
      icon: 'leaf'
    },
    
    // March 22 – World Water Day
    {
      date: new Date(new Date().getFullYear(), 2, 22),
      title: 'World Water Day',
      description: 'Focusing on the importance of freshwater and sustainable water use',
      category: 'water',
      icon: 'water-outline'
    },
    
    // April 22 – Earth Day
    {
      date: new Date(new Date().getFullYear(), 3, 22),
      title: 'Earth Day',
      description: 'Global movement to drive transformative change for people and planet',
      category: 'climate',
      icon: 'earth'
    },
    
    // May 20 – World Bee Day
    {
      date: new Date(new Date().getFullYear(), 4, 20),
      title: 'World Bee Day',
      description: 'Highlighting the importance of pollinators, especially bees',
      category: 'biodiversity',
      icon: 'bug-outline'
    },
    
    // May 22 – International Day for Biological Diversity
    {
      date: new Date(new Date().getFullYear(), 4, 22),
      title: 'International Day for Biological Diversity',
      description: 'Raising understanding and awareness of biodiversity issues',
      category: 'biodiversity',
      icon: 'leaf'
    },
    
    // June 5 – World Environment Day
    {
      date: new Date(new Date().getFullYear(), 5, 5),
      title: 'World Environment Day',
      description: 'Encouraging awareness and action for the protection of the environment',
      category: 'environment',
      icon: 'leaf'
    },
    
    // June 8 – World Oceans Day
    {
      date: new Date(new Date().getFullYear(), 5, 8),
      title: 'World Oceans Day',
      description: 'Celebrating the role of the oceans and promoting ocean conservation',
      category: 'ocean',
      icon: 'boat'
    },
    
    // June 17 – World Day to Combat Desertification and Drought
    {
      date: new Date(new Date().getFullYear(), 5, 17),
      title: 'World Day to Combat Desertification and Drought',
      description: 'Promoting public awareness of international efforts to combat desertification',
      category: 'climate',
      icon: 'sunny'
    },
    
    // July 3 – International Plastic Bag Free Day
    {
      date: new Date(new Date().getFullYear(), 6, 3),
      title: 'Plastic Bag Free Day',
      description: 'Encouraging people to avoid single-use plastic bags for a cleaner environment',
      category: 'pollution',
      icon: 'trash-outline'
    },
    
    // September 16 – International Day for the Preservation of the Ozone Layer
    {
      date: new Date(new Date().getFullYear(), 8, 16),
      title: 'Ozone Layer Preservation Day',
      description: 'Commemorating efforts to protect the ozone layer',
      category: 'climate',
      icon: 'cloud-outline'
    },
    
    // September 22 – World Car-Free Day
    {
      date: new Date(new Date().getFullYear(), 8, 22),
      title: 'World Car-Free Day',
      description: 'Promoting alternatives to car travel to reduce emissions',
      category: 'sustainability',
      icon: 'bicycle'
    },
    
    // October 4 – World Animal Day
    {
      date: new Date(new Date().getFullYear(), 9, 4),
      title: 'World Animal Day',
      description: 'Advocating for animal rights and welfare around the world',
      category: 'biodiversity',
      icon: 'paw-outline'
    },
    
    // October 16 – World Food Day
    {
      date: new Date(new Date().getFullYear(), 9, 16),
      title: 'World Food Day',
      description: 'Promoting sustainable agriculture and food security',
      category: 'food',
      icon: 'restaurant'
    },
    
    // November 6 – Day to Prevent Exploitation of the Environment in War
    {
      date: new Date(new Date().getFullYear(), 10, 6),
      title: 'Environment in War Day',
      description: 'Highlighting environmental protection during armed conflict',
      category: 'environment',
      icon: 'shield'
    },
    
    // December 5 – World Soil Day
    {
      date: new Date(new Date().getFullYear(), 11, 5),
      title: 'World Soil Day',
      description: 'Focusing attention on the importance of healthy soil and sustainable land use',
      category: 'conservation',
      icon: 'leaf'
    },
    
    // December 11 – International Mountain Day
    {
      date: new Date(new Date().getFullYear(), 11, 11),
      title: 'International Mountain Day',
      description: 'Raising awareness about the importance of mountains to life',
      category: 'biodiversity',
      icon: 'trail-sign'
    }// ... Add all other eco events similarly
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