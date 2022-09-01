import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  // Definitions

  /**
   * Title
   * @attribute {String}
   */
  title: any;

  /**
   * Label
   * @attribute {String}
   */
  label: any;

  /**
   * Image
   * @attribute {String}
   */
  image: any;

  /**
   * Items
   * @attribute {String}
   */
  items: any;

  /**
   * Route 1
   * @attribute {String}
   */
  route_1: any;

  /**
   * Route 2
   * @attribute {String}
   */
  route_2: any;

  /**
   * Theme
   * @attribute {Boolean}
   */
  theme: any = false;

  /**
   * Night
   * @attribute {Boolean}
   */
  night: boolean = false;

  /**
   * Constructor
   */
  constructor() {
    this.onInit();
  }

  /**
   * Init event handler
   */
  async onInit(): Promise<any> {
  }

  /**
   * Toggle night mode
   */
  async toggleNight(params: any = {}): Promise<any> {
    document.body.classList.toggle('night', (this.night = !this.night));
    if (typeof params.$event?.target?.complete === 'function') {
      params.$event.target.complete();
    }
  }
}
