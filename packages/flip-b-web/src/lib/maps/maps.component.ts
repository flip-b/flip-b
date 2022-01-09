import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

declare const google: any;

@Component({
  selector: 'flb-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {
  @ViewChild('map') map?: ElementRef<any>;

  @Input() maps: any = {};
  @Input() item: any = {};
  @Input() zoom: any = 14;
  @Input() edit: any = true;

  modal: any;

  google: any;

  constructor() {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.loadGoogleMapsLibrary().then((google: any) => {
      if (!this.map) {
        return;
      }
      this.google = google;
      this.google.map = new this.google.maps.Map(this.map.nativeElement, {
        zoom: this.zoom
      });
      if (!this.google.map) {
        return;
      }
      this.google.geocoder = new this.google.maps.Geocoder();
      this.google.marker = new this.google.maps.Marker({
        draggable: this.edit,
        map: this.google.map
      });
      this.google.maps.event.addListener(this.google.marker, 'dragend', (result: any) => {
        this.geocodePosition({
          lat: result.latLng.lat(),
          lng: result.latLng.lng()
        });
      });
      if (this.item.position) {
        const position = {
          lat: this.item.position[0],
          lng: this.item.position[1]
        };
        this.google.map.setCenter(position);
        this.google.marker.setPosition(position);
      } else if (this.item.street) {
        this.geocodeAddress(this.item);
      } else {
        this.loadCurrentPosition();
      }
    });
  }

  loadGoogleMapsLibrary(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (google) {
        return resolve(google);
      }
      const element = document.createElement('script');
      element.src = 'https://maps.googleapis.com/maps/api/js?key=' + this.maps.key + '&libraries=places';
      element.type = 'text/javascript';
      element.addEventListener('load', () => resolve(google));
      element.addEventListener('error', () => reject());
      document.body.append(element);
    });
  }

  loadCurrentPosition(): void {
    navigator.geolocation.getCurrentPosition((value: any) => {
      if (value && value.coords) {
        this.geocodePosition({
          lat: value.coords.latitude,
          lng: value.coords.longitude
        });
      }
    });
  }

  geocodePosition(params: any): void {
    const filter: any = {
      location: {
        lat: params.lat,
        lng: params.lng
      }
    };
    this.google.geocoder.geocode(filter, (value: any, status: any) => {
      if (status == 'OK') {
        this.formatAddress({ ...value[0], keep_street: false });
      }
    });
  }

  geocodeAddress(params: any): void {
    const filter: any = {
      address: [this.formatAddressText(params.street).replace(/^(.*? [0-9]+) .*?$/, '$1'), this.formatAddressText(params.city), this.formatAddressText(params.state), this.formatAddressText(params.country)]
        .filter((v) => !!v)
        .join(', ')
        .trim()
    };
    this.google.geocoder.geocode(filter, (value: any, status: any) => {
      if (status == 'OK') {
        this.formatAddress({ ...value[0], keep_street: true });
      }
    });
  }

  formatAddress(params: any) {
    const current: any = {};
    params.address_components.forEach((r: any) => {
      if (r.types.includes('route')) {
        current.street = this.formatAddressText(r.short_name);
      }
    });
    params.address_components.forEach((r: any) => {
      if (r.types.includes('street_number') && current.street) {
        current.street = current.street + ' ' + this.formatAddressText(r.long_name);
      }
    });
    params.address_components.forEach((r: any) => {
      if (r.types.includes('administrative_area_level_2')) {
        current.city = this.formatAddressText(r.long_name);
      }
    });
    params.address_components.forEach((r: any) => {
      if (r.types.includes('locality')) {
        current.city = this.formatAddressText(r.long_name);
      }
    });
    params.address_components.forEach((r: any) => {
      if (r.types.includes('administrative_area_level_1')) {
        current.state = this.formatAddressText(r.long_name);
      }
    });
    params.address_components.forEach((r: any) => {
      if (r.types.includes('country')) {
        current.country = this.formatAddressText(r.long_name);
      }
    });
    params.address_components.forEach((r: any) => {
      if (r.types.includes('postal_code')) {
        current.zipcode = this.formatAddressText(r.long_name);
      }
    });

    if (this.item.street && params.keep_street) {
      current.street = this.formatAddressText(this.item.street);
    }
    if (!current.street && params.formatted_address) {
      current.street = params.formatted_address.split(',')[0].trim();
    }
    if (!current.city || current.city.match(/^capital/i)) {
      current.city = current.state;
    }

    const position: any = {
      lat: params.geometry.location.lat(),
      lng: params.geometry.location.lng()
    };
    this.item = current;
    this.item.position = [position.lat, position.lng];

    this.google.map.setCenter(position);
    this.google.marker.setPosition(position);
  }

  /**
   * Format address
   */
  formatAddressText(value: any): any {
    let result = value || '';
    result = result.toString();
    result = result.replace(/\s\s+/, ' ').trim();
    result = result
      .split(' ')
      .map((word: string) => {
        if (word.match(/[0-9]+/)) {
          return word.toUpperCase();
        }
        if (word.match(/[^a-záéíóúñ]/)) {
          return word;
        } else {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
      })
      .join(' ');
    result = ` ${result} `.replace(/ Y /gi, ' y ').trim();
    result = ` ${result} `.replace(/ O /gi, ' o ').trim();
    result = ` ${result} `.replace(/ X /gi, ' x ').trim();
    result = ` ${result} `.replace(/ De /gi, ' de ').trim();
    result = ` ${result} `.replace(/ En /gi, ' en ').trim();
    result = ` ${result} `.replace(/ Con /gi, ' con ').trim();
    result = ` ${result} `.replace(/ Sin /gi, ' sin ').trim();
    result = ` ${result} `.replace(/ Para /gi, ' para ').trim();
    result = result.charAt(0).toUpperCase() + result.slice(1);
    return result;
  }
}
