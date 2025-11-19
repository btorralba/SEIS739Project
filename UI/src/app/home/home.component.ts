import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../services/product.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products: any[] = [];
  isFilterOpen: boolean = false;
  filterOptions = {
    colors: ['Black', 'Tan'],
    priceRanges: ['Under $30', 'Over $30'],
    sizes: ['Small', 'Medium', 'Large', 'X-Large', 'XX-Large']
  };
  filters = this.fb.group({
    colors: [''],
    priceRanges: [''],
    sizes: ['']
  });
  filteredProducts: Product[] = [];
  isFiltered: boolean = false;

  constructor(private productService: ProductService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe(resp => {
      const uniqueProductsMap = new Map<string, any>();

      resp.forEach(product => {
        uniqueProductsMap.set(product.productName, product);
      });

      this.products = Array.from(uniqueProductsMap.values());
    });
  }

  toggleFilter() {
    this.isFilterOpen = !this.isFilterOpen;
  }

  submitFilter() {
    let colorsSelected = this.filters.controls['colors'].value;
    let priceRangesSelected = this.filters.controls['priceRanges'].value;
    let sizesSelected = this.filters.controls['sizes'].value;

    this.filteredProducts = [...this.products];
    if (colorsSelected && colorsSelected.length == 1 && colorsSelected == 'Black') {
      this.filteredProducts = this.filteredProducts.filter((product) => product.productName == 'Night Reaper' || product.productName == 'Phantom Recon');
    } else if (colorsSelected && colorsSelected.length == 1 && colorsSelected != 'Black') {
      this.filteredProducts = this.filteredProducts.filter((product) => product.productName != 'Night Reaper' && product.productName != 'Phantom Recon');
    }

    if (priceRangesSelected && priceRangesSelected.length == 1 && priceRangesSelected != 'Under $30') {
      this.filteredProducts = [];
    }

    if (sizesSelected && sizesSelected.includes('XX-Large')) {
      this.filteredProducts = [];
    }
    this.isFiltered = true;
  }

  resetFilters() {
    this.isFiltered = false;
    this.filteredProducts = [];
    this.filters.controls['colors'].reset();
    this.filters.controls['priceRanges'].reset();
    this.filters.controls['sizes'].reset();
  }
}

