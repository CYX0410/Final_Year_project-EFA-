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
import { arrowBackOutline, alertCircleOutline, leafOutline, refreshOutline } from 'ionicons/icons';
import { ProductService, Product } from '../../services/product.service';
interface ProductWithFlip extends Product {
  isFlipped: boolean;
}
@Component({
  selector: 'app-ecoproduct',
  templateUrl: './ecoproduct.page.html',
  styleUrls: ['./ecoproduct.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonTitle,
    IonToolbar,
    IonHeader,
    IonContent, 
    IonButton,
    IonButtons,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonSpinner,
  ]
})

export class EcoproductPage implements OnInit {
  products: ProductWithFlip[] = [];
  loading = false;
  error = '';

  constructor(
    private router: Router,
    private productService: ProductService
  ) {
    addIcons({alertCircleOutline,refreshOutline,leafOutline,arrowBackOutline});
  }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.error = '';
    
    this.productService.getNonEcoProducts().subscribe({
      next: (products: Product[]) => {
        this.products = products.map(p => ({
          ...p,
          isFlipped: false
        }));
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading products:', error);
        this.error = 'Failed to load products';
        this.loading = false;
      }
    });
  }

  flipCard(product: ProductWithFlip) {
    product.isFlipped = !product.isFlipped;
  }
  hasAlternatives(product: Product): boolean {
    return Array.isArray(product.alternatives) && product.alternatives.length > 0;
  }
  goBack() {
    this.router.navigate(['/tabs/home']);
  }
}