import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';

export interface IBikes {
  id: number;
  image: string;
  description: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  bikes: Array<IBikes> = [];
  name = '';

  constructor(
    private http: Http,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) { }

  async ngOnInit() {
    this.bikes = await this.loadBikes();
  }

  async loadBikes() {
    const bikes1 = JSON.parse(localStorage.getItem('bikes'));
    if (bikes1 && bikes1.length > 0) {
      this.bikes = bikes1;
      console.log('loadTests: >= 1');
    } else {
      this.bikes = await this.loadBikesFromJson();
      console.log('loadTests: < 1');
    }

    return this.bikes;
  }

  async loadBikesFromJson() {
    const bikes2 = await this.http.get('assets/inventory.json').toPromise();
    console.log('on init', bikes2.json());
    return bikes2.json();

  }

  saveToLocalStorage() {
    localStorage.setItem('bikes', JSON.stringify(this.bikes));
    this.toastService.showToast('success', 3000, 'Success: Items saved!');
  }

  addBike1() {
    const bike: IBikes = {
      id: null,
      image: '../../assets/bike1.jpeg',
      description: 'Bike Model 1',
      price: 5000,
      quantity: null,
    };
    this.bikes.unshift(bike);
    this.saveToLocalStorage();
  }

  addBike2() {
    const bike: IBikes = {
      id: null,
      image: '../../assets/bike2.jpeg',
      description: 'Bike Model 2',
      price: 4000,
      quantity: null,
    };
    this.bikes.unshift(bike);
    this.saveToLocalStorage();
  }

  addBike3() {
    const bike: IBikes = {
      id: null,
      image: '../../assets/bike3.jpeg',
      description: 'Bike Model 3',
      price: 3000,
      quantity: null,
    };
    this.bikes.unshift(bike);
    this.saveToLocalStorage();
  }

  deleteBike(i: number) {
    this.bikes.splice(i, 1);
    this.saveToLocalStorage();
  }

  checkout() {
    console.log('name: ', this.name);
    if (this.name === '') {
      this.toastService.showToast('warning', 2000, 'name must not be blank!');
    } else if (this.name.indexOf(',') < 0) {
      this.toastService.showToast('warning', 2000, 'name must have a comma!');
    } else {
      console.log('success');
      const data = this.computePrice();
      this.router.navigate(['invoice', data]);
    }
  }

  computePrice() {
    let subTot = 0;
    for (let i = 0; i < this.bikes.length; i++) {
      subTot += (this.bikes[i].price * this.bikes[i].quantity);
    }
    const taxAmt = subTot * .1;
    const total = subTot * 1.1;
    let newName = '';
    const commaI = this.name.indexOf(',');
    newName = this.name.substring(commaI + 2) + ' ' + this.name.substr(0, commaI);
    console.log('subtotal: ', subTot);
    console.log('tax: ', taxAmt);
    console.log('total: ', total);
    console.log('name: ', newName);
    return {
      name: newName,
      subTot: subTot,
      taxAmt: taxAmt,
      total: total
    };
  }
}
