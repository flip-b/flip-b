import {Component, OnInit, Input, HostBinding, ElementRef, ViewChild} from '@angular/core';
import {Item} from '../core/classes/item';
import {ContextService} from '../core/context.service';

declare const google: any;

@Component({
  selector: 'flb-item-location',
  templateUrl: './item-location.component.html'
})
export class ItemLocationComponent implements OnInit {
  // Definitions

  @HostBinding('class') _elementClass: any;
  @HostBinding('style') _elementStyle: any;

  @ViewChild('map', {static: false}) map: ElementRef<HTMLDivElement> = {} as ElementRef;

  /**
   * Modal
   * @attribute {Object}
   */
  @Input() modal: any;

  /**
   * Item
   * @attribute {Item}
   */
  @Input() item: Item | any;

  /**
   * Value
   * @attribute {Mixed}
   */
  @Input() value: any;

  /**
   * Google
   * @attribute {Object}
   */
  private google: any;

  /**
   * Constructor
   */
  constructor(public _context: ContextService, public _element: ElementRef) {}

  /**
   * Init angular handler
   */
  ngOnInit() {
    if (this.item?.constructor?.name !== 'Item') {
      this.item = new Item(this.item);
      this.item.setComponent(this);
    }
    this.value = this.value || this.item.value || {};
    this._elementClass = 'flb-item-location';
    this._elementStyle = {};
    this.initGoogleMaps();
  }

  /**
   * Apply event handler
   */
  onApply($event: any) {
    $event = new CustomEvent('onApply', {detail: {$event, value: this.value}});
    this._element.nativeElement.value = this.value;
    this._element.nativeElement.dispatchEvent($event);
    if (this.modal) {
      this.modal.dismiss($event);
    }
  }

  /**
   * Close event handler
   */
  onClose($event: any) {
    $event = new CustomEvent('onClose', {detail: {$event, value: this.value}});
    this._element.nativeElement.value = this.value;
    this._element.nativeElement.dispatchEvent($event);
    if (this.modal) {
      this.modal.dismiss();
    }
  }

  /**
   * Init Google Maps
   */
  async initGoogleMaps(): Promise<any> {
    this.google = await this.loadGoogleMaps();
    this.google.options = {};
    this.google.options.fullscreenControl = false;
    this.google.options.mapTypeControl = false;
    this.google.options.scaleControl = false;
    this.google.options.streetViewControl = false;
    this.google.options.rotateControl = false;
    this.google.options.zoom = this.item.zoom || 14;
    this.google.options.zoomControl = false;
    this.google.map = new this.google.maps.Map(this.map.nativeElement, this.google.options);
    this.google.geocoder = new this.google.maps.Geocoder();
    this.google.marker = new this.google.maps.Marker({map: this.google.map, draggable: !this.item._config.readonly || false});
    this.google.maps.event.addListener(this.google.marker, 'dragend', (result: any) => {
      this.geocodeLatLng({lat: result.latLng.lat(), lng: result.latLng.lng()});
    });
    if (this.value.position) {
      const position = {lat: this.value.position[0], lng: this.value.position[1]};
      this.google.map.setCenter(position);
      this.google.marker.setPosition(position);
    } else if (this.value.street) {
      this.geocodeString(this.value);
    } else {
      this.loadCurrentPosition();
    }
  }

  /**
   * Load Google Maps
   */
  loadGoogleMaps(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (typeof google === 'object') {
        return resolve(google);
      }
      const element = document.createElement('script');
      element.src = 'https://maps.googleapis.com/maps/api/js?key=' + this.item.options?.maps?.key + '&libraries=places';
      element.type = 'text/javascript';
      element.addEventListener('load', () => resolve(google));
      element.addEventListener('error', () => reject());
      document.body.append(element);
    });
  }

  /**
   * Load current position
   */
  loadCurrentPosition() {
    navigator.geolocation.getCurrentPosition((value: any) => {
      if (value && value.coords) {
        this.geocodeLatLng({lat: value.coords.latitude, lng: value.coords.longitude});
      }
    });
  }

  /**
   * Geocode object
   */
  geocodeLatLng(params: any) {
    this.google.geocoder.geocode({location: params}, (value: any, status: any) => {
      if (status == 'OK') {
        this.formatAddress({...value[0], keep_street: false});
      }
    });
  }

  /**
   * Geocode string
   */
  geocodeString(params: any) {
    const filter: any = {
      address: [
        this._context.i18n.format(params.street).replace(/^(.*? [0-9]+) .*?$/, '$1'),
        this._context.i18n.format(params.city),
        this._context.i18n.format(params.state),
        this._context.i18n.format(params.country)
      ].filter((v) => !!v).join(', ').trim()
    };
    this.google.geocoder.geocode(filter, (value: any, status: any) => {
      if (status == 'OK') {
        this.formatAddress({...value[0], keep_street: true});
      }
    });
  }

  /**
   * Format address
   */
  formatAddress(params: any) {
    console.log('formatAddress', params);
    const current: any = {};
    params.address_components.forEach((r: any) => {
      if (r.types.includes('route')) {
        current.street = this._context.i18n.format(r.short_name);
      }
    });
    params.address_components.forEach((r: any) => {
      if (r.types.includes('street_number') && current.street) {
        current.street = current.street + ' ' + this._context.i18n.format(r.long_name);
      }
    });
    params.address_components.forEach((r: any) => {
      if (r.types.includes('administrative_area_level_2')) {
        current.city = this._context.i18n.format(r.long_name);
      }
    });
    params.address_components.forEach((r: any) => {
      if (r.types.includes('locality')) {
        current.city = this._context.i18n.format(r.long_name);
      }
    });
    params.address_components.forEach((r: any) => {
      if (r.types.includes('administrative_area_level_1')) {
        current.state = this._context.i18n.format(r.long_name);
      }
    });
    params.address_components.forEach((r: any) => {
      if (r.types.includes('country')) {
        current.country = this._context.i18n.format(r.long_name);
      }
    });
    params.address_components.forEach((r: any) => {
      if (r.types.includes('postal_code')) {
        current.zipcode = this._context.i18n.format(r.long_name);
      }
    });

    if (this.value.street && params.keep_street) {
      current.street = this._context.i18n.format(this.value.street);
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
    this.value = current;
    this.value.position = [position.lat, position.lng];
    this.google.map.setCenter(position);
    this.google.marker.setPosition(position);
    console.log(`New value "${this.value}"`);
  }
}
