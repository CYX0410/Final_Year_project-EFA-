import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner,
  IonAccordion,
  IonAccordionGroup
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, alertCircleOutline, leafOutline } from 'ionicons/icons';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-ecoproduct',
  templateUrl: './ecoproduct.page.html',
  styleUrls: ['./ecoproduct.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonSpinner,
    IonAccordion,
    IonAccordionGroup
  ]
})
export class EcoproductPage implements OnInit {
  products: Product[] = [];
  loading = false;
  error = '';

  constructor(
    private router: Router,
    private productService: ProductService
  ) {
    addIcons({ arrowBackOutline, alertCircleOutline, leafOutline });
  }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.error = '';
    
    this.productService.getNonEcoProducts().subscribe({
      next: (products: Product[]) => {
        this.products = products;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading products:', error);
        this.error = 'Failed to load products';
        this.loading = false;
      }
    });
  }
  hasAlternatives(product: Product): boolean {
    return Array.isArray(product.alternatives) && product.alternatives.length > 0;
  }
  goBack() {
    this.router.navigate(['/tabs/home']);
  }
}