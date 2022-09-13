/**
 * Base
 */
export abstract class Base {
  // Definitions

  /**
   * Component
   */
  _component: any | undefined;

  /**
   * Constructor
   */
  constructor(public _config: any = {}, public _parent: any = {}) {
    this.setup();
  }

  /**
   * Setup
   */
  abstract setup(): void;

  /**
   * Set component
   */
  async setComponent(_component: any): Promise<any> {
    this._component = _component;
    this._component._elementClass = this._config.elementClass || `flb-${this.constructor.name.toLowerCase()}`;
    this._component._elementStyle = this._config.elementStyle || {};
    if (this._config.type) {
      this._component._elementClass += ' flb-type-' + this._config.type;
    }
    if (this._config.mode) {
      this._component._elementClass += ' flb-mode-' + this._config.mode;
    }
    if (this._config.hide) {
      this._component._elementStyle.display = 'none';
    }
    if (this._config.size) {
      this._component._elementStyle.width = `${this._config.size}%`;
    }
    this._config.init = true;

    if (this.constructor.name === 'Page') {
      const $event = new CustomEvent('onInit');
      await this.onInit($event);
      await this.onRender($event);
    }
  }

  /**
   * Setup event handler
   */
  async onInit($event: any): Promise<any> {
    await this.dispatchEvent($event, 'onInit');
  }

  /**
   * Setup event handler
   */
  async onSetup($event: any): Promise<any> {
    await this.dispatchEvent($event, 'onSetup');
  }

  /**
   * Error event handler
   */
  async onError($event: any): Promise<any> {
    await this.dispatchEvent($event, 'onError');
  }

  /**
   * Click event handler
   */
  async onClick($event: any): Promise<any> {
    await this.dispatchEvent($event, 'onClick');
  }

  /**
   * Enter event handler
   */
  async onEnter($event: any): Promise<any> {
    await this.dispatchEvent($event, 'onEnter');
  }

  /**
   * Leave event handler
   */
  async onLeave($event: any): Promise<any> {
    await this.dispatchEvent($event, 'onLeave');
  }

  /**
   * Input event handler
   */
  async onInput($event: any): Promise<any> {
    await this.dispatchEvent($event, 'onInput');
  }

  /**
   * Change event handler
   */
  async onChange($event: any): Promise<any> {
    await this.dispatchEvent($event, 'onChange');
  }

  /**
   * Render event handler
   */
  async onRender($event: any): Promise<any> {
    await this.dispatchEvent($event, 'onRender');
  }

  /**
   * Reload event handler
   */
  async onReload($event: any): Promise<any> {
    await this.dispatchEvent($event, 'onReload');
  }

  /**
   * Search event handler
   */
  async onSearch($event: any): Promise<any> {
    await this.dispatchEvent($event, 'onSearch');
  }

  /**
   * Select event handler
   */
  async onSelect($event: any): Promise<any> {
    await this.dispatchEvent($event, 'onSelect');
  }

  /**
   * Submit event handler
   */
  async onSubmit($event: any): Promise<any> {
    await this.dispatchEvent($event, 'onSubmit');
  }

  /**
   * Cancel event handler
   */
  async onCancel($event: any): Promise<any> {
    await this.dispatchEvent($event, 'onCancel');
  }

  /**
   * Scroll event handler
   */
  async onScroll($event: any): Promise<any> {
    await this.dispatchEvent($event, 'onScroll');
  }

  /**
   * Dispatch event
   */
  async dispatchEvent($event: any, type: string = ''): Promise<any> {
    try {
      if (!$event.detail?._flb) {
        if (!type) {
          type = $event.type || 'undefined';
        }
        $event = new CustomEvent(type, {detail: {_flb: true, $event, target: $event.target}});
      }

      // Define detail
      $event.detail[`${this.constructor.name.toLowerCase()}`] = this;
      if (typeof this._config.name !== 'undefined' && !$event.detail.name) {
        $event.detail.name = this._config.name;
      }
      if (typeof this._config.type !== 'undefined' && !$event.detail.type) {
        $event.detail.type = this._config.type;
      }

      // Execute internal trigger
      if (typeof this._config[`_${$event.type}`] === 'function') {
        await this._config[`_${$event.type}`]($event);
      }

      // Execute config trigger
      if (typeof this._config[`${$event.type}`] === 'function') {
        await this._config[`${$event.type}`]($event);
      }

      // Execute parent trigger
      if (typeof this._parent[`${$event.type}`] === 'function') {
        await this._parent[`${$event.type}`]($event);
      }

      // Execute internal trigger
      if (typeof this._config[`${$event.type}_`] === 'function') {
        await this._config[`${$event.type}_`]($event);
      }

      // Dispatch native element
      if (this._component) {
        this._component._element.nativeElement.dispatchEvent($event);
      }
    } catch (error: any) {
      console.error(`${error}`, $event);
    }
  }

  /**
   * Clone
   */
  clone(value: any): any {
    if (typeof value !== 'object' || value === null || value instanceof RegExp) {
      return value;
    }
    let clone: any;
    if (Array.isArray(value)) {
      clone = [...value];
    } else {
      clone = {...value};
    }
    for (const k in clone) {
      clone[k] = this.clone(clone[k]);
    }
    return clone;
  }
}
