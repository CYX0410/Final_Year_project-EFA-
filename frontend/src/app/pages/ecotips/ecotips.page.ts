import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonSpinner,
  IonCard,
  IonCardContent,
  IonFooter, IonChip } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, sendOutline, flashOutline,leafOutline, trashOutline, waterOutline, bagHandleOutline  } from 'ionicons/icons';
import { ChatService } from '../../services/chat.service';
interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
}
@Component({
  selector: 'app-ecotips', // or 'app-eco-challenges' for the other file
  templateUrl: './ecotips.page.html', // or './eco-challenges.page.html'
  styleUrls: ['./ecotips.page.scss'], // or './eco-challenges.page.scss'
  standalone: true,
  imports: [IonChip, 
    CommonModule, 
    FormsModule, 
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonInput,
    IonSpinner,
    IonCard,
    IonCardContent,
    IonFooter,
    IonLabel
  ]
})
export class EcotipsPage implements OnInit {
  @ViewChild(IonContent) content!: IonContent;
  
  userMessage: string = '';
  messages: ChatMessage[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  suggestionTopics = [
    { 
      icon: 'leaf-outline',
      text: 'Sustainable Living Tips',
      query: 'What are some daily sustainable living tips?' 
    },
    { 
      icon: 'trash-outline',
      text: 'Recycling Guide',
      query: 'How to recycle different types of materials properly?' 
    },
    { 
      icon: 'flash-outline',
      text: 'Energy Saving',
      query: 'What are effective ways to save energy at home?' 
    },
    { 
      icon: 'water-outline',
      text: 'Water Conservation',
      query: 'How can I conserve water in daily life?' 
    },
    { 
      icon: 'bag-handle-outline',
      text: 'Zero Waste Tips',
      query: 'Give me tips for zero waste lifestyle' 
    }
  ];
  selectSuggestion(query: string) {
    this.userMessage = query;
    this.sendMessage();
  }
  constructor(
    private router: Router,
    private chatService: ChatService
  ) {
    addIcons({ arrowBackOutline, sendOutline, flashOutline, leafOutline, trashOutline, waterOutline, bagHandleOutline });
  }

  ngOnInit() {
    this.messages.push({
      text: 'Hello! I\'m your eco-assistant. I can help with environmental topics like:\n\n' +
            '• Sustainable living tips\n' +
            '• Recycling methods\n' +
            '• Energy conservation\n' +
            '• Waste reduction\n' +
            '• Green alternatives\n' +
            '• Environmental protection\n\n' +
            'Please note: I can only answer questions about eco-friendly topics.',
      isUser: false,
      timestamp: new Date()
    });
  }

  async sendMessage() {
    if (!this.userMessage.trim()) return;
  
    const userQuery = this.userMessage.trim();
    this.messages.push({
      text: userQuery,
      isUser: true,
      timestamp: new Date()
    });
  
    this.userMessage = '';
    this.isLoading = true;
  
    try {
      const response = await this.chatService.sendMessage(userQuery).toPromise();
      
      // Format the response text with proper spacing
      const formattedText = response.message
        .split('\n')
        .map((point: string) => point.trim())
        .filter((point: string) => point.length > 0)
        .join('\n\n');
      
      this.messages.push({
        text: formattedText,
        isUser: false,
        timestamp: new Date()
      });
  
      await this.scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
      this.messages.push({
        text: '**Note**: I can only provide information about eco-friendly and environmental topics.\n\n' +
              'Please ask about:\n\n' +
              '• Sustainable living\n\n' +
              '• Recycling practices\n\n' +
              '• Energy conservation\n\n' +
              '• Waste reduction\n\n' +
              '• Green alternatives',
        isUser: false,
        timestamp: new Date()
      });
    } finally {
      this.isLoading = false;
    }
  }

  private async scrollToBottom() {
    try {
      await this.content.scrollToBottom(300);
    } catch (err) {
      console.error('Error scrolling:', err);
    }
  }

  goBack() {
    this.router.navigate(['/tabs/home']);
  }
}