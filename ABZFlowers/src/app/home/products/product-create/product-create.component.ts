import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { ProductsService } from '../products.service';
import { Product } from '../product.model';

import { mimeType } from './mime-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css'],
})
export class ProductCreateComponent implements OnInit, OnDestroy {
  enteredTitle = '';
  enteredContent = '';
  product: Product;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private productId: string;
  private authStatusSub: Subscription;

  constructor(
    public productsService: ProductsService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe((authStatus) => {
      this.isLoading = false;
    });
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, {
        validators: [Validators.required],
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
      quantity: new FormControl(null, {
        validators: [Validators.required],
      }),
      price: new FormControl(null, {
        validators: [Validators.required],
      }),
      currency: new FormControl(null, {
        validators: [Validators.required],
      }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('productId')) {
        this.mode = 'edit';
        this.productId = paramMap.get('productId');
        this.isLoading = true;
        this.productsService
          .getProduct(this.productId)
          .subscribe((productData) => {
            this.isLoading = false;
            this.product = {
              id: productData._id,
              title: productData.title,
              content: productData.content,
              imagePath: productData.imagePath,
              quantity: productData.quantity,
              price: productData.price,
              currency: productData.currency,
              creator: productData.creator,
            };
            this.form.setValue({
              title: this.product.title,
              content: this.product.content,
              image: this.product.imagePath,
              quantity: this.product.quantity,
              price: this.product.price,
              currency: this.product.currency,
            });
          });
      } else {
        this.mode = 'create';
        this.productId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file }); //allows you to reach a single control, unlike setValue
    this.form.get('image').updateValueAndValidity(); //this will run the validators on the image above
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSaveProduct() {
    if (this.form.invalid) {
      console.log('Form Invalid');
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.productsService.addProduct(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image,
        this.form.value.quantity,
        this.form.value.price,
        this.form.value.currency
      );
    } else {
      this.productsService.updateProduct(
        this.productId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image,
        this.form.value.quantity,
        this.form.value.price,
        this.form.value.currency
      );
    }
    this.form.reset();
  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
