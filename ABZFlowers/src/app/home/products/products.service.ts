import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Product } from './product.model';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private products: Product[] = []; //we dont want anyone accessing this variable from outside
  private productsUpdated = new Subject<Product[]>(); //we had to use Subject because in the beggining we were pulling a empty array so nothign showed up

  constructor(private http: HttpClient, private router: Router) {}

  getProducts() {
    this.http
      .get<{ message: string; products: any }>(
        'http://localhost:3000/api/products'
      ) //you can be more clear about the type
      .pipe(
        map((productData) => {
          return productData.products.map((product) => {
            return {
              price: product.price,
              quantity: product.quantity,
              currency: product.currency,
              title: product.title,
              content: product.content,
              id: product._id,
              imagePath: product.imagePath,
            };
          });
        })
      ) //allows operators (?)
      .subscribe((transformedProducts) => {
        this.products = transformedProducts;
        this.productsUpdated.next([...this.products]);
      });

    //return [...this.products]; //Good Practice! This is a ts/new js feature that copies an array, not only its reference
  }
  getProductUpdateListener() {
    return this.productsUpdated.asObservable(); //returns an object that can listen but not emit
  }

  getProduct(id: string) {
    return this.http.get<{
      _id: string;
      quantity: string;
      currency: string;
      price: string;
      content: string;
      title: string;
      imagePath: string;
    }>('http://localhost:3000/api/products/' + id);
  }

  addProduct(
    title: string,
    image: File,
    content: string,
    quantity: string,
    price: string,
    currency: string
  ) {
    const productData = new FormData(); //data format allows us to combine text values and blobs (files)_
    productData.append('content', content);
    productData.append('quantity', quantity);
    productData.append('price', price);
    productData.append('currency', currency);
    productData.append('title', title);
    productData.append('content', content);
    productData.append('image', image, title);
    this.http
      .post<{ message: string; product: Product }>(
        'http://localhost:3000/api/products',
        productData
      )
      .subscribe((responseData) => {
        const product: Product = {
          id: responseData.product.id,
          title: title,
          content: content,
          quantity: quantity,
          price: price,
          currency: currency,
          imagePath: responseData.product.imagePath,
        };
        this.products.push(product);
        this.productsUpdated.next([...this.products]);
        this.router.navigate(['/']);
      });
    // added to subscribe method
    // this.products.push(product);
    // this.productsUpdated.next([...this.products]);
  }

  updateProduct(
    id: string,
    title: string,
    content: string,
    image: File | string,
    quantity: string,
    price: string,
    currency: string
  ) {
    let productData: Product | FormData;
    if (typeof image === 'object') {
      productData = new FormData();
      productData.append('id', id);
      productData.append('quantity', quantity);
      productData.append('price', price);
      productData.append('currency', currency);
      productData.append('title', title);
      productData.append('content', content);
      productData.append('image', image, title);
    } else {
      const productData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        price: price,
        quantity: quantity,
        currency: currency,
      };
    }
    this.http
      .put('http://localhost:3000/api/products/' + id, productData)
      .subscribe((response) => {
        const updatedProducts = [...this.products];
        const oldProductIndex = updatedProducts.findIndex((p) => p.id === id);
        const product: Product = {
          id: id,
          price: price,
          quantity: quantity,
          currency: currency,
          title: title,
          content: content,
          imagePath: '',
        };
        updatedProducts[oldProductIndex] = product;
        this.products = updatedProducts;
        this.productsUpdated.next([...this.products]);
        this.router.navigate(['/']);
      });
  }
  deleteProduct(productId: string) {
    this.http
      .delete('http://localhost:3000/api/products/' + productId)
      .subscribe(() => {
        const updatedProducts = this.products.filter(
          (product) => product.id !== productId
        );
        this.products = updatedProducts;
        this.productsUpdated.next([...this.products]);
        //you could just call getProducts, where the null id will be updated, but you'll do something else
      });
  }
}
