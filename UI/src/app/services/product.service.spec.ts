import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService, Product } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const API_BASE_URL = 'http://localhost:8080/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Service Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should have API_BASE_URL defined', () => {
      expect(service.API_BASE_URL).toBe('http://localhost:8080/api');
    });

    it('should have correct API base URL', () => {
      expect(service.API_BASE_URL).toContain('localhost:8080');
      expect(service.API_BASE_URL).toContain('/api');
    });

    it('should initialize products array as empty', () => {
      expect(service.products).toEqual([]);
      expect(Array.isArray(service.products)).toBe(true);
    });

    it('should have httpClient injected', () => {
      expect(service['httpClient']).toBeDefined();
    });
  });

  describe('Product Interface', () => {
    it('should have Product interface with all required properties', () => {
      const product: Product = {
        sku: 'SKU001',
        productName: 'Night Reaper',
        price: 99.99,
        productImageId: 1,
        size: 'Large',
        color: 'Black',
        quantity: 5
      };

      expect(product.sku).toBe('SKU001');
      expect(product.productName).toBe('Night Reaper');
      expect(product.price).toBe(99.99);
      expect(product.productImageId).toBe(1);
      expect(product.size).toBe('Large');
      expect(product.color).toBe('Black');
      expect(product.quantity).toBe(5);
    });

    it('should have correct Product property types', () => {
      const product: Product = {
        sku: 'SKU001',
        productName: 'Test Product',
        price: 49.99,
        productImageId: 1,
        size: 'Medium',
        color: 'Blue',
        quantity: 3
      };

      expect(typeof product.sku).toBe('string');
      expect(typeof product.productName).toBe('string');
      expect(typeof product.price).toBe('number');
      expect(typeof product.productImageId).toBe('number');
      expect(typeof product.size).toBe('string');
      expect(typeof product.color).toBe('string');
      expect(typeof product.quantity).toBe('number');
    });
  });

  describe('getProducts()', () => {
    it('should make GET request to products endpoint', () => {
      service.getProducts().subscribe();

      const req = httpMock.expectOne(`${API_BASE_URL}/products`);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });

    it('should return Observable of Product array', () => {
      const mockProducts: Product[] = [
        {
          sku: 'SKU001',
          productName: 'Night Reaper',
          price: 99.99,
          productImageId: 1,
          size: 'Large',
          color: 'Black',
          quantity: 5
        },
        {
          sku: 'SKU002',
          productName: 'Phantom Recon',
          price: 109.99,
          productImageId: 2,
          size: 'Medium',
          color: 'Black',
          quantity: 3
        }
      ];

      service.getProducts().subscribe(products => {
        expect(products).toEqual(mockProducts);
        expect(Array.isArray(products)).toBe(true);
      });

      const req = httpMock.expectOne(`${API_BASE_URL}/products`);
      req.flush(mockProducts);
    });

    it('should handle empty product list', () => {
      service.getProducts().subscribe(products => {
        expect(products).toEqual([]);
        expect(products.length).toBe(0);
      });

      const req = httpMock.expectOne(`${API_BASE_URL}/products`);
      req.flush([]);
    });

    it('should construct correct endpoint URL', () => {
      service.getProducts().subscribe();

      const req = httpMock.expectOne(`${API_BASE_URL}/products`);
      expect(req.request.url).toBe(`${API_BASE_URL}/products`);
      req.flush([]);
    });

    it('should handle single product response', () => {
      const mockProduct: Product = {
        sku: 'SKU001',
        productName: 'Single Product',
        price: 79.99,
        productImageId: 1,
        size: 'Small',
        color: 'Red',
        quantity: 1
      };

      service.getProducts().subscribe(products => {
        expect(products.length).toBe(1);
        expect(products[0]).toEqual(mockProduct);
      });

      const req = httpMock.expectOne(`${API_BASE_URL}/products`);
      req.flush([mockProduct]);
    });

    it('should handle multiple products response', () => {
      const mockProducts: Product[] = Array.from({ length: 5 }, (_, i) => ({
        sku: `SKU${String(i + 1).padStart(3, '0')}`,
        productName: `Product ${i + 1}`,
        price: 50 + i * 10,
        productImageId: i + 1,
        size: 'Medium',
        color: 'Blue',
        quantity: i + 1
      }));

      service.getProducts().subscribe(products => {
        expect(products.length).toBe(5);
        expect(products).toEqual(mockProducts);
      });

      const req = httpMock.expectOne(`${API_BASE_URL}/products`);
      req.flush(mockProducts);
    });

    it('should handle error response', () => {
      service.getProducts().subscribe(
        () => { },
        error => {
          expect(error.status).toBe(500);
        }
      );

      const req = httpMock.expectOne(`${API_BASE_URL}/products`);
      req.flush(null, { status: 500, statusText: 'Internal Server Error' });
    });

    it('should not send request body', () => {
      service.getProducts().subscribe();

      const req = httpMock.expectOne(`${API_BASE_URL}/products`);
      expect(req.request.body).toBeNull();
      req.flush([]);
    });
  });

  describe('getProductSearch()', () => {
    it('should make GET request to product search endpoint', () => {
      service.getProductSearch('Night Reaper').subscribe();

      const req = httpMock.expectOne(`${API_BASE_URL}/product?productName=Night Reaper`);
      expect(req.request.method).toBe('GET');
      req.flush({});
    });

    it('should include product name as query parameter', () => {
      service.getProductSearch('Phantom Recon').subscribe();

      const req = httpMock.expectOne(`${API_BASE_URL}/product?productName=Phantom Recon`);
      expect(req.request.url).toContain('productName=Phantom Recon');
      req.flush({});
    });

    it('should return product data', () => {
      const mockProduct = {
        sku: 'SKU001',
        productName: 'Night Reaper',
        price: 99.99,
        productImageId: 1
      };

      service.getProductSearch('Night Reaper').subscribe(product => {
        expect(product).toEqual(mockProduct);
      });

      const req = httpMock.expectOne(`${API_BASE_URL}/product?productName=Night Reaper`);
      req.flush(mockProduct);
    });

    it('should construct correct endpoint URL', () => {
      service.getProductSearch('St Michael').subscribe();

      const req = httpMock.expectOne(req => req.url.includes('/product?productName='));
      expect(req.request.url).toContain('St Michael');
      req.flush({});
    });

    it('should handle different product names', () => {
      const productNames = ['Night Reaper', 'Phantom Recon', 'St Michael', 'Guardian Of Shadows'];

      for (const name of productNames) {
        service.getProductSearch(name).subscribe();
        const req = httpMock.expectOne(`${API_BASE_URL}/product?productName=${name}`);
        expect(req.request.url).toContain(`productName=${name}`);
        req.flush({});
      }
    });

    it('should handle error response', () => {
      service.getProductSearch('NonExistent').subscribe(
        () => { },
        error => {
          expect(error.status).toBe(404);
        }
      );

      const req = httpMock.expectOne(`${API_BASE_URL}/product?productName=NonExistent`);
      req.flush(null, { status: 404, statusText: 'Not Found' });
    });

    it('should handle product name with spaces', () => {
      service.getProductSearch('Modern Crusader').subscribe();

      const req = httpMock.expectOne(`${API_BASE_URL}/product?productName=Modern Crusader`);
      expect(req.request.url).toContain('Modern Crusader');
      req.flush({});
    });
  });

  describe('getSKU()', () => {
    it('should make GET request to SKU endpoint', () => {
      service.getSKU('Night Reaper', 'Black', 'Large').subscribe();

      const req = httpMock.expectOne(`${API_BASE_URL}/product/sku?name=Night Reaper&color=Black&size=Large`);
      expect(req.request.method).toBe('GET');
      req.flush({});
    });

    it('should include name, color, and size as query parameters', () => {
      service.getSKU('Phantom Recon', 'Tan', 'Medium').subscribe();

      const req = httpMock.expectOne(req => req.url.includes('/product/sku'));
      expect(req.request.url).toContain('name=Phantom Recon');
      expect(req.request.url).toContain('color=Tan');
      expect(req.request.url).toContain('size=Medium');
      req.flush({});
    });

    it('should return SKU data', () => {
      const mockResponse = { message: 'SKU001' };

      service.getSKU('Night Reaper', 'Black', 'Large').subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${API_BASE_URL}/product/sku?name=Night Reaper&color=Black&size=Large`);
      req.flush(mockResponse);
    });

    it('should construct correct endpoint URL', () => {
      service.getSKU('Test', 'Blue', 'Small').subscribe();

      const req = httpMock.expectOne(req => req.url.includes('/product/sku'));
      expect(req.request.url).toContain('product/sku');
      req.flush({});
    });

    it('should handle all size options', () => {
      const sizes = ['Small', 'Medium', 'Large', 'X-Large', 'XX-Large'];

      for (const size of sizes) {
        service.getSKU('Night Reaper', 'Black', size).subscribe();
        const req = httpMock.expectOne(req => req.url.includes(`size=${size}`));
        expect(req.request.url).toContain(`size=${size}`);
        req.flush({});
      }
    });

    it('should handle all color options', () => {
      const colors = ['Black', 'Tan'];

      for (const color of colors) {
        service.getSKU('Night Reaper', color, 'Medium').subscribe();
        const req = httpMock.expectOne(req => req.url.includes(`color=${color}`));
        expect(req.request.url).toContain(`color=${color}`);
        req.flush({});
      }
    });

    it('should handle error response', () => {
      service.getSKU('Invalid', 'Color', 'Size').subscribe(
        () => { },
        error => {
          expect(error.status).toBe(404);
        }
      );

      const req = httpMock.expectOne(`${API_BASE_URL}/product/sku?name=Invalid&color=Color&size=Size`);
      req.flush(null, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('addItemsToCart()', () => {
    it('should add item to products array', () => {
      const product: Product = {
        sku: 'SKU001',
        productName: 'Night Reaper',
        price: 99.99,
        productImageId: 1,
        size: 'Large',
        color: 'Black',
        quantity: 1
      };

      service.addItemsToCart(product);

      expect(service.products.length).toBe(1);
      expect(service.products[0]).toEqual(product);
    });

    it('should add multiple items to cart', () => {
      const product1: Product = {
        sku: 'SKU001',
        productName: 'Product 1',
        price: 50,
        productImageId: 1,
        size: 'Medium',
        color: 'Blue',
        quantity: 2
      };

      const product2: Product = {
        sku: 'SKU002',
        productName: 'Product 2',
        price: 75,
        productImageId: 2,
        size: 'Large',
        color: 'Red',
        quantity: 1
      };

      service.addItemsToCart(product1);
      service.addItemsToCart(product2);

      expect(service.products.length).toBe(2);
      expect(service.products[0]).toEqual(product1);
      expect(service.products[1]).toEqual(product2);
    });

    it('should maintain product order in cart', () => {
      const products: Product[] = Array.from({ length: 3 }, (_, i) => ({
        sku: `SKU00${i + 1}`,
        productName: `Product ${i + 1}`,
        price: 50 + i * 10,
        productImageId: i + 1,
        size: 'Medium',
        color: 'Blue',
        quantity: i + 1
      }));

      products.forEach(p => service.addItemsToCart(p));

      expect(service.products.length).toBe(3);
      expect(service.products[0].productName).toBe('Product 1');
      expect(service.products[1].productName).toBe('Product 2');
      expect(service.products[2].productName).toBe('Product 3');
    });

    it('should allow adding duplicate products', () => {
      const product: Product = {
        sku: 'SKU001',
        productName: 'Night Reaper',
        price: 99.99,
        productImageId: 1,
        size: 'Large',
        color: 'Black',
        quantity: 1
      };

      service.addItemsToCart(product);
      service.addItemsToCart(product);

      expect(service.products.length).toBe(2);
      expect(service.products[0]).toEqual(product);
      expect(service.products[1]).toEqual(product);
    });

    it('should store product reference', () => {
      const product: Product = {
        sku: 'SKU001',
        productName: 'Test',
        price: 50,
        productImageId: 1,
        size: 'Medium',
        color: 'Blue',
        quantity: 1
      };

      service.addItemsToCart(product);

      expect(service.products[0] === product).toBe(true);
    });
  });

  describe('getCart()', () => {
    it('should return empty array when no items added', () => {
      const cart = service.getCart();

      expect(cart).toEqual([]);
      expect(Array.isArray(cart)).toBe(true);
    });

    it('should return products array after adding items', () => {
      const product: Product = {
        sku: 'SKU001',
        productName: 'Product 1',
        price: 50,
        productImageId: 1,
        size: 'Medium',
        color: 'Blue',
        quantity: 1
      };

      service.addItemsToCart(product);
      const cart = service.getCart();

      expect(cart.length).toBe(1);
      expect(cart[0]).toEqual(product);
    });

    it('should return all items in cart', () => {
      const products: Product[] = Array.from({ length: 3 }, (_, i) => ({
        sku: `SKU00${i + 1}`,
        productName: `Product ${i + 1}`,
        price: 50 + i * 10,
        productImageId: i + 1,
        size: 'Medium',
        color: 'Blue',
        quantity: i + 1
      }));

      products.forEach(p => service.addItemsToCart(p));
      const cart = service.getCart();

      expect(cart.length).toBe(3);
      expect(cart).toEqual(products);
    });

    it('should return reference to products array', () => {
      const product: Product = {
        sku: 'SKU001',
        productName: 'Test',
        price: 50,
        productImageId: 1,
        size: 'Medium',
        color: 'Blue',
        quantity: 1
      };

      service.addItemsToCart(product);
      const cart = service.getCart();

      expect(cart === service.products).toBe(true);
    });

    it('should reflect changes to cart', () => {
      const product1: Product = {
        sku: 'SKU001',
        productName: 'Product 1',
        price: 50,
        productImageId: 1,
        size: 'Medium',
        color: 'Blue',
        quantity: 1
      };

      service.addItemsToCart(product1);
      let cart = service.getCart();
      expect(cart.length).toBe(1);

      const product2: Product = {
        sku: 'SKU002',
        productName: 'Product 2',
        price: 75,
        productImageId: 2,
        size: 'Large',
        color: 'Red',
        quantity: 1
      };

      service.addItemsToCart(product2);
      cart = service.getCart();
      expect(cart.length).toBe(2);
    });
  });

  describe('setCart()', () => {
    it('should set products array to provided cart', () => {
      const newCart: Product[] = [
        {
          sku: 'SKU001',
          productName: 'Product 1',
          price: 50,
          productImageId: 1,
          size: 'Medium',
          color: 'Blue',
          quantity: 1
        }
      ];

      service.setCart(newCart);

      expect(service.products).toEqual(newCart);
    });

    it('should replace existing cart with new cart', () => {
      const product1: Product = {
        sku: 'SKU001',
        productName: 'Product 1',
        price: 50,
        productImageId: 1,
        size: 'Medium',
        color: 'Blue',
        quantity: 1
      };

      service.addItemsToCart(product1);
      expect(service.products.length).toBe(1);

      const newCart: Product[] = [
        {
          sku: 'SKU002',
          productName: 'Product 2',
          price: 75,
          productImageId: 2,
          size: 'Large',
          color: 'Red',
          quantity: 2
        }
      ];

      service.setCart(newCart);

      expect(service.products.length).toBe(1);
      expect(service.products[0].productName).toBe('Product 2');
    });

    it('should set cart to empty array', () => {
      const product: Product = {
        sku: 'SKU001',
        productName: 'Product 1',
        price: 50,
        productImageId: 1,
        size: 'Medium',
        color: 'Blue',
        quantity: 1
      };

      service.addItemsToCart(product);
      service.setCart([]);

      expect(service.products).toEqual([]);
      expect(service.products.length).toBe(0);
    });

    it('should set cart with multiple items', () => {
      const newCart: Product[] = Array.from({ length: 5 }, (_, i) => ({
        sku: `SKU00${i + 1}`,
        productName: `Product ${i + 1}`,
        price: 50 + i * 10,
        productImageId: i + 1,
        size: 'Medium',
        color: 'Blue',
        quantity: i + 1
      }));

      service.setCart(newCart);

      expect(service.products.length).toBe(5);
      expect(service.products).toEqual(newCart);
    });

    it('should maintain product references in new cart', () => {
      const product: Product = {
        sku: 'SKU001',
        productName: 'Test',
        price: 50,
        productImageId: 1,
        size: 'Medium',
        color: 'Blue',
        quantity: 1
      };

      const newCart = [product];
      service.setCart(newCart);

      expect(service.products[0] === product).toBe(true);
    });
  });

  describe('updateProduct()', () => {
    it('should make POST request to update product endpoint', () => {
      const updateRequest: Product = {
        sku: 'SKU001',
        productName: 'Updated Product',
        price: 99.99,
        productImageId: 1,
        size: 'Large',
        color: 'Black',
        quantity: 10
      };

      service.updateProduct(updateRequest).subscribe();

      const req = httpMock.expectOne(`${API_BASE_URL}/update/product`);
      expect(req.request.method).toBe('POST');
      req.flush({});
    });

    it('should send product data in request body', () => {
      const updateRequest: Product = {
        sku: 'SKU001',
        productName: 'Updated Product',
        price: 89.99,
        productImageId: 1,
        size: 'Medium',
        color: 'Red',
        quantity: 5
      };

      service.updateProduct(updateRequest).subscribe();

      const req = httpMock.expectOne(`${API_BASE_URL}/update/product`);
      expect(req.request.body).toEqual(updateRequest);
      req.flush({});
    });

    it('should return Observable response', () => {
      const updateRequest: Product = {
        sku: 'SKU001',
        productName: 'Updated',
        price: 50,
        productImageId: 1,
        size: 'Medium',
        color: 'Blue',
        quantity: 1
      };
      const mockResponse = { message: 'Product updated' };

      service.updateProduct(updateRequest).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${API_BASE_URL}/update/product`);
      req.flush(mockResponse);
    });

    it('should construct correct endpoint URL', () => {
      const updateRequest: Product = {
        sku: 'SKU001',
        productName: 'Test',
        price: 50,
        productImageId: 1,
        size: 'Medium',
        color: 'Blue',
        quantity: 1
      };

      service.updateProduct(updateRequest).subscribe();

      const req = httpMock.expectOne(`${API_BASE_URL}/update/product`);
      expect(req.request.url).toBe(`${API_BASE_URL}/update/product`);
      req.flush({});
    });

    it('should handle multiple update requests', () => {
      const update1: Product = {
        sku: 'SKU001',
        productName: 'Product 1',
        price: 50,
        productImageId: 1,
        size: 'Medium',
        color: 'Blue',
        quantity: 5
      };

      const update2: Product = {
        sku: 'SKU002',
        productName: 'Product 2',
        price: 75,
        productImageId: 2,
        size: 'Large',
        color: 'Red',
        quantity: 10
      };

      service.updateProduct(update1).subscribe();
      service.updateProduct(update2).subscribe();

      const requests = httpMock.match(`${API_BASE_URL}/update/product`);
      expect(requests.length).toBe(2);
      requests.forEach(req => req.flush({}));
    });

    it('should handle price update', () => {
      const updateRequest: Product = {
        sku: 'SKU001',
        productName: 'Product',
        price: 199.99,
        productImageId: 1,
        size: 'Medium',
        color: 'Blue',
        quantity: 1
      };

      service.updateProduct(updateRequest).subscribe();

      const req = httpMock.expectOne(`${API_BASE_URL}/update/product`);
      expect(req.request.body.price).toBe(199.99);
      req.flush({});
    });

    it('should handle quantity update', () => {
      const updateRequest: Product = {
        sku: 'SKU001',
        productName: 'Product',
        price: 50,
        productImageId: 1,
        size: 'Medium',
        color: 'Blue',
        quantity: 100
      };

      service.updateProduct(updateRequest).subscribe();

      const req = httpMock.expectOne(`${API_BASE_URL}/update/product`);
      expect(req.request.body.quantity).toBe(100);
      req.flush({});
    });

    it('should handle error response', () => {
      const updateRequest: Product = {
        sku: 'SKU001',
        productName: 'Product',
        price: 50,
        productImageId: 1,
        size: 'Medium',
        color: 'Blue',
        quantity: 1
      };

      service.updateProduct(updateRequest).subscribe(
        () => { },
        error => {
          expect(error.status).toBe(404);
        }
      );

      const req = httpMock.expectOne(`${API_BASE_URL}/update/product`);
      req.flush(null, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('Integration Tests', () => {
    it('should add items to cart and retrieve them', () => {
      const product1: Product = {
        sku: 'SKU001',
        productName: 'Product 1',
        price: 50,
        productImageId: 1,
        size: 'Medium',
        color: 'Blue',
        quantity: 2
      };

      const product2: Product = {
        sku: 'SKU002',
        productName: 'Product 2',
        price: 75,
        productImageId: 2,
        size: 'Large',
        color: 'Red',
        quantity: 1
      };

      service.addItemsToCart(product1);
      service.addItemsToCart(product2);

      const cart = service.getCart();

      expect(cart.length).toBe(2);
      expect(cart[0]).toEqual(product1);
      expect(cart[1]).toEqual(product2);
    });

    it('should replace cart and retrieve new items', () => {
      const initialCart: Product[] = [
        {
          sku: 'SKU001',
          productName: 'Old Product',
          price: 50,
          productImageId: 1,
          size: 'Medium',
          color: 'Blue',
          quantity: 1
        }
      ];

      service.setCart(initialCart);
      expect(service.getCart().length).toBe(1);

      const newCart: Product[] = [
        {
          sku: 'SKU002',
          productName: 'New Product 1',
          price: 75,
          productImageId: 2,
          size: 'Large',
          color: 'Red',
          quantity: 2
        },
        {
          sku: 'SKU003',
          productName: 'New Product 2',
          price: 100,
          productImageId: 3,
          size: 'X-Large',
          color: 'Green',
          quantity: 1
        }
      ];

      service.setCart(newCart);
      const cart = service.getCart();

      expect(cart.length).toBe(2);
      expect(cart[0].productName).toBe('New Product 1');
      expect(cart[1].productName).toBe('New Product 2');
    });

    it('should get products and search for specific product', () => {
      const mockProducts: Product[] = [
        {
          sku: 'SKU001',
          productName: 'Night Reaper',
          price: 99.99,
          productImageId: 1,
          size: 'Large',
          color: 'Black',
          quantity: 5
        }
      ];

      service.getProducts().subscribe(products => {
        expect(products.length).toBe(1);
      });

      const productsReq = httpMock.expectOne(`${API_BASE_URL}/products`);
      productsReq.flush(mockProducts);

      const searchProduct = { sku: 'SKU001', productName: 'Night Reaper', price: 99.99 };

      service.getProductSearch('Night Reaper').subscribe((product: any) => {
        expect(product.productName).toBe('Night Reaper');
      });

      const searchReq = httpMock.expectOne(`${API_BASE_URL}/product?productName=Night Reaper`);
      searchReq.flush(searchProduct);
    });

    it('should get SKU and add product to cart', () => {
      service.getSKU('Night Reaper', 'Black', 'Large').subscribe((skuResponse: any) => {
        expect(skuResponse.message).toBe('SKU001');
      });

      const skuReq = httpMock.expectOne(`${API_BASE_URL}/product/sku?name=Night Reaper&color=Black&size=Large`);
      skuReq.flush({ message: 'SKU001' });

      const product: Product = {
        sku: 'SKU001',
        productName: 'Night Reaper',
        price: 99.99,
        productImageId: 1,
        size: 'Large',
        color: 'Black',
        quantity: 1
      };

      service.addItemsToCart(product);
      const cart = service.getCart();

      expect(cart.length).toBe(1);
      expect(cart[0].sku).toBe('SKU001');
    });
  });

  describe('HTTP Method Verification', () => {
    it('getProducts should use GET method', () => {
      service.getProducts().subscribe();
      const req = httpMock.expectOne(`${API_BASE_URL}/products`);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });

    it('getProductSearch should use GET method', () => {
      service.getProductSearch('Test').subscribe();
      const req = httpMock.expectOne(`${API_BASE_URL}/product?productName=Test`);
      expect(req.request.method).toBe('GET');
      req.flush({});
    });

    it('getSKU should use GET method', () => {
      service.getSKU('Test', 'Black', 'Medium').subscribe();
      const req = httpMock.expectOne(`${API_BASE_URL}/product/sku?name=Test&color=Black&size=Medium`);
      expect(req.request.method).toBe('GET');
      req.flush({});
    });

    it('updateProduct should use POST method', () => {
      service.updateProduct({} as Product).subscribe();
      const req = httpMock.expectOne(`${API_BASE_URL}/update/product`);
      expect(req.request.method).toBe('POST');
      req.flush({});
    });
  });
});