import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

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
  IonCardContent,
  IonSpinner,
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, alertCircleOutline, leafOutline, refreshOutline, warningOutline, closeOutline, searchOutline } from 'ionicons/icons';
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
    FormsModule,
    IonTitle,
    IonToolbar,
    IonHeader,
    IonContent, 
    IonButton,
    IonButtons,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonSpinner,
    IonSearchbar,
    IonList,
    IonItem,
    IonLabel
  ]
})

export class EcoproductPage implements OnInit {
  products: ProductWithFlip[] = [];
  filteredProducts: ProductWithFlip[] = [];
  loading = false;
  error = '';
  searchTerm = '';
  showSuggestions = false;
  availableProducts: string[] = [];
  constructor(
    private router: Router,
    private productService: ProductService
  ) {
    addIcons({arrowBackOutline,warningOutline,leafOutline,closeOutline,alertCircleOutline,
      refreshOutline, searchOutline});
  }

  ngOnInit() {
    this.loadProducts();
  }
  onSearchbarFocus() {
    this.showSuggestions = true;
}
  handleImageError(event: any) {
    event.target.src = 'assets/images/placeholder.jpg'; // Fallback image
  }
  loadProducts() {
    this.loading = true;
    this.error = '';
    
    this.productService.getNonEcoProducts().subscribe({
        next: (products: Product[]) => {
            console.log('Received products:', products.length);
            this.products = products.map(p => ({
                ...p,
                isFlipped: false
            }));
            this.filteredProducts = [...this.products];
            this.availableProducts = products.map(p => p.name);
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
  
  searchProducts(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    // Only filter if there's a search term, otherwise show all products
    if (searchTerm) {
        this.filteredProducts = this.products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
    }
}

selectProduct(productName: string) {
    this.searchTerm = productName;
    this.showSuggestions = false;
    this.filteredProducts = this.products.filter(product => 
        product.name === productName
    );
}

clearSearch() {
    this.searchTerm = '';
    this.showSuggestions = false;
    this.filteredProducts = [...this.products];
}
}