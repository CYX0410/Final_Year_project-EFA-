import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Product {
  product_id: string;
  name: string;
  description: string;
  category: string;
  alternatives: Product[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getNonEcoProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/non-eco`);
  }
}