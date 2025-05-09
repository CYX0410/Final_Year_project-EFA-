import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private apiUrl = 'http://13.229.116.113:5010/api';

  constructor(private http: HttpClient) {}

  getNonEcoProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/non-eco`);
  }
}