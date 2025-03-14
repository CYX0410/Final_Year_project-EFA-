// Add to both files
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
  IonCardContent
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, sendOutline } from 'ionicons/icons';
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
  imports: [
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
    IonLabel,
    IonInput,
    IonSpinner,
    IonCard,
    IonCardContent
  ]
})
export class EcotipsPage implements OnInit {
  @ViewChild(IonContent) content!: IonContent;
  
  userMessage: string = '';
  messages: ChatMessage[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private chatService: ChatService
  ) {
    addIcons({ arrowBackOutline, sendOutline });
  }

  ngOnInit() {
    this.messages.push({
      text: 'Hello! I\'m your eco-assistant. You can ask me about:\n- Sustainable living tips\n- Environmental conservation\n- Eco-friendly alternatives\n- Daily green practices',
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
    this.errorMessage = '';

    try {
      const response = await this.chatService.sendMessage(userQuery).toPromise();
      
      // Format the response text
      const formattedText = response.message
        .replace(/•/g, '\n•') // Add newlines before bullets
        .replace(/(\d+\.)/g, '\n$1'); // Add newlines before numbered lists
      
      this.messages.push({
        text: formattedText,
        isUser: false,
        timestamp: new Date()
      });
    } catch (error: any) {
      console.error('Error sending message:', error);
      this.errorMessage = error.message || 'Failed to get response';
      this.messages.push({
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date()
      });
    } finally {
      this.isLoading = false;
      await this.scrollToBottom();
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