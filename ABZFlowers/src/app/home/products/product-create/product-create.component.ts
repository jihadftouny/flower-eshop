import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { ProductsService } from '../products.service';
import { Product } from '../product.model';

import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css'],
})
export class ProductCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  product: Product;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private productId: string;

  constructor(
    public productsService: ProductsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
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
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('productId')) {
        this.mode = 'edit';
        this.productId = paramMap.get('productId');
        this.isLoading = true;
        this.productsService.getProduct(this.productId).subscribe(productData => {
          this.isLoading = false;
          this.product = {
            id: productData._id,
            imagePath: productData.imagePath,
            currency: productData.currency,
            title: productData.title,
            quantity: productData.quantity,
            price: productData.price,
            content: productData.content
          };
          this.form.setValue({
            quantity: this.product.quantity,
            currency: this.product.currency,
            price: this.product.price,
            title: this.product.title,
            content: this.product.content,
            image: this.product.imagePath
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
      console.log("Form Invalid")
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.productsService.addProduct(
        this.form.value.content,
        this.form.value.price,
        this.form.value.quantity,
        this.form.value.currency,
        this.form.value.title,
        this.form.value.imagePath
      );
    } else {
      this.productsService.updateProduct(
        this.productId,
        this.form.value.content,
        this.form.value.price,
        this.form.value.quantity,
        this.form.value.currency,
        this.form.value.title,
        this.form.value.imagePath
      );
    }
    this.form.reset();
  }
}