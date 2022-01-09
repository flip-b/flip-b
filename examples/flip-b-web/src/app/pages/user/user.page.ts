import { Component } from '@angular/core';
import { Page } from '@flip-b/web';

//import { ActivatedRoute } from '@angular/router';
//import { PageService } from '@flip-b/web';
//import { UserService } from './user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss']
})
export class UserPage extends Page {
  profile: any = {
    name: 'user',
    path: '/api/v1/users/profile',
    //view: 'select',
    item: () => this.user,
    fields: [
      {
        name: 'name',
        type: 'text',
        size: '100',
        default: undefined,
        pattern: /^.{0,255}$/,
        require: true
      },
      {
        name: 'image',
        type: 'url',
        size: '100',
        default: undefined,
        pattern: /^https?:\/\/.*$/,
        require: false
      },
      {
        name: 'phone',
        type: 'tel',
        size: '100',
        default: undefined,
        pattern: /^[0-9]{8,12}$/,
        require: false
      },
      {
        name: 'email',
        type: 'email',
        size: '100',
        default: undefined,
        pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        require: true
      },
      {
        name: 'address',
        type: 'address',
        size: '100',
        default: undefined,
        pattern: undefined,
        require: false
      },
      {
        name: 'website',
        type: 'url',
        size: '100',
        default: undefined,
        pattern: /^https?:\/\/.*$/,
        require: false
      }
    ]
  };

  // Change name options
  changeName: any = {
    name: 'user',
    path: '/api/v1/users/profile',
    view: 'update',
    fields: [
      {
        name: 'name',
        type: 'text',
        size: '100',
        default: undefined,
        pattern: /^.{0,255}$/,
        require: true
      }
    ]
  };

  // Change phone options
  changePhone: any = {
    name: 'user',
    path: '/api/v1/users/profile',
    view: 'update',
    fields: [
      {
        name: 'phone',
        type: 'tel',
        size: '100',
        default: undefined,
        pattern: /^[0-9]{8,12}$/,
        require: false
      }
    ]
  };

  // Change email options
  changeEmail: any = {
    name: 'user',
    path: '/api/v1/users/profile',
    view: 'update',
    fields: [
      {
        name: 'email',
        type: 'email',
        size: '100',
        default: undefined,
        pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        require: true
      }
    ]
  };

  // Change address options
  changeAddress: any = {
    name: 'user',
    path: '/api/v1/users/profile',
    view: 'update',
    fields: [
      {
        name: 'address',
        type: 'address',
        size: '100',
        default: undefined,
        pattern: undefined,
        require: false
      }
    ]
  };

  // Change website options
  changeWebsite: any = {
    name: 'user',
    path: '/api/v1/users/profile',
    view: 'update',
    fields: [
      {
        name: 'website',
        type: 'url',
        size: '100',
        default: undefined,
        pattern: /^https?:\/\/.*$/,
        require: false
      }
    ]
  };

  // Change password options
  changePassword: any = {
    name: 'user',
    path: '/api/v1/users/profile',
    view: 'update',
    fields: [
      {
        name: 'password',
        type: 'password',
        size: '100',
        default: undefined,
        pattern: /^.{0,255}$/,
        require: true
      }
    ]
  };

  // Change security options
  changeSecurity: any = {
    name: 'user',
    path: '/api/v1/users/profile',
    view: 'update',
    fields: [
      {
        name: 'security',
        type: 'text',
        size: '100',
        default: undefined,
        pattern: /^.{0,255}$/,
        require: true
      }
    ]
  };

  // Signout options
  signout: any = {
    name: 'user',
    path: '/api/v1/users/signout',
    view: 'update',
    fields: [
      {
        name: 'email',
        type: 'email',
        size: '100',
        default: undefined,
        pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        require: true
      }
    ]
  };

  // Signin options
  signin: any = {
    name: 'user',
    path: '/api/v1/users/signin',
    view: 'update',
    fields: [
      {
        name: 'email',
        type: 'email',
        size: '100',
        default: undefined,
        pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        require: true
      },
      {
        name: 'password',
        type: 'password',
        size: '100',
        default: undefined,
        pattern: /^.{0,255}$/,
        require: true
      }
    ]
  };

  // Signup options
  signup: any = {
    name: 'user',
    path: '/api/v1/users/signup',
    view: 'update',
    fields: [
      {
        name: 'email',
        type: 'email',
        size: '100',
        default: undefined,
        pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        require: false
      }
    ]
  };

  // Forgot options
  forgot: any = {
    name: 'user',
    path: '/api/v1/users/forgot',
    view: 'update',
    fields: [
      {
        name: 'email',
        type: 'email',
        size: '100',
        default: undefined,
        pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        require: false
      }
    ]
  };

  // Verify options
  verify: any = {
    name: 'user',
    path: '/api/v1/users/verify',
    view: 'update',
    fields: [
      {
        name: 'email',
        type: 'email',
        size: '100',
        default: undefined,
        pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        require: false
      },
      {
        name: 'recovery',
        type: 'tel',
        size: '100',
        default: undefined,
        pattern: /^.{5,255}$/,
        require: true
      },
      {
        name: 'password',
        type: 'password',
        size: '100',
        default: undefined,
        pattern: /^.{0,255}$/,
        require: true,
        visible: 'params.change_password'
      }
    ]
  };

  //// Define access options
  //access: any = {
  //  default: 'user',
  //  values: ['administrator', 'supervisor', 'operator']
  //};

  //// Define status options
  //status: any = {
  //  default: 'enabled',
  //  values: ['enabled', 'disabled']
  //};

  //// Define security options
  //security: any = {
  //  default: 'standard',
  //  values: ['standard', '2fa']
  //};

  //sendChangeName: {
  //  this.pageService.showLoadingOnUpdate({message: 'user.change_name.loading'});
  //  this.dataService.profile(params).then(() => {
  //    this.pageService.gotoBack();
  //    this.pageService.showMessageOnUpdate({event: params.$event, value: this.item, message: 'user.change_name.success'});
  //  }).catch((error) => {
  //    this.pageService.showMessageOnUpdate({event: params.$event, error});
  //  });
  //}

  //sendChangePhone: {
  //  this.pageService.showLoadingOnUpdate({message: 'user.change_phone.loading'});
  //  this.dataService.profile(params).then(() => {
  //    this.pageService.gotoBack();
  //    this.pageService.showMessageOnUpdate({event: params.$event, value: this.item, message: 'user.change_phone.success'});
  //  }).catch((error) => {
  //    this.pageService.showMessageOnUpdate({event: params.$event, error});
  //  });
  //}

  //sendChangeEmail: {
  //  this.pageService.showLoadingOnUpdate({message: 'user.change_email.loading'});
  //  this.dataService.profile(params).then(() => {
  //    this.pageService.gotoBack();
  //    this.pageService.showMessageOnUpdate({event: params.$event, value: this.item, message: 'user.change_email.success'});
  //  }).catch((error) => {
  //    this.pageService.showMessageOnUpdate({event: params.$event, error});
  //  });
  //}

  //sendChangeAddress: {
  //  this.pageService.showLoadingOnUpdate({message: 'user.change_address.loading'});
  //  this.dataService.profile(params).then(() => {
  //    this.pageService.gotoBack();
  //    this.pageService.showMessageOnUpdate({event: params.$event, value: this.item, message: 'user.change_address.success'});
  //  }).catch((error) => {
  //    this.pageService.showMessageOnUpdate({event: params.$event, error});
  //  });
  //}

  //sendChangeWebsite: {
  //  this.pageService.showLoadingOnUpdate({message: 'user.change_website.loading'});
  //  this.dataService.profile(params).then(() => {
  //    this.pageService.gotoBack();
  //    this.pageService.showMessageOnUpdate({event: params.$event, value: this.item, message: 'user.change_website.success'});
  //  }).catch((error) => {
  //    this.pageService.showMessageOnUpdate({event: params.$event, error});
  //  });
  //}

  //sendChangePassword: {
  //  this.pageService.showLoadingOnUpdate();
  //  this.dataService.profile(params).then(() => {
  //    this.pageService.gotoBack();
  //    this.pageService.showMessageOnUpdate({event: params.$event, value: this.item, message: 'user.change_password.success'});
  //  }).catch((error) => {
  //    this.pageService.showMessageOnUpdate({event: params.$event, error});
  //  });
  //}

  //sendChangeSecurity: {
  //  this.pageService.showLoadingOnUpdate();
  //  this.dataService.profile(params).then(() => {
  //    this.pageService.gotoBack();
  //    this.pageService.showMessageOnUpdate({event: params.$event, value: this.item, message: 'user.change_security.success'});
  //  }).catch((error) => {
  //    this.pageService.showMessageOnUpdate({event: params.$event, error});
  //  });
  //}

  //sendSignout: {
  //  this.pageService.showLoading({message: 'user.signout.loading'});
  //  this.dataService.signout(params).then((result) => {
  //    if (result && result.goto) {
  //      this.pageService.gotoRoot(result.goto, result);
  //      this.pageService.hideLoading();
  //      return;
  //    }
  //    this.pageService.gotoRoot('home');
  //    this.pageService.showMessage({event: params.$event, value: this.item, message: 'user.signout.success'});
  //  }).catch((error) => {
  //    this.pageService.showMessage({event: params.$event, error});
  //  });
  //}

  //sendSignin: {
  //  this.pageService.showLoading({message: 'user.signin.loading'});
  //  this.dataService.signin(params).then((result) => {
  //    if (result && result.goto) {
  //      this.pageService.gotoRoot(result.goto, result);
  //      this.pageService.hideLoading();
  //      return;
  //    }
  //    this.pageService.gotoRoot('home');
  //    this.pageService.showMessage({event: params.$event, value: result, message: 'user.signin.success'});
  //  }).catch((error) => {
  //    this.pageService.showMessage({event: params.$event, error});
  //  });
  //}

  //sendSignup: {
  //  this.pageService.showLoading({message: 'user.signup.loading'});
  //  this.dataService.signup(params).then((result) => {
  //    if (result && result.goto) {
  //      this.pageService.gotoRoot(result.goto, result);
  //      this.pageService.hideLoading();
  //      return;
  //    }
  //    this.pageService.gotoRoot('home');
  //    this.pageService.showMessage({event: params.$event, value: result, message: 'user.signup.success'});
  //  }).catch((error) => {
  //    this.pageService.showMessage({event: params.$event, error});
  //  });
  //}

  //sendForgot: {
  //  this.pageService.showLoading({message: 'user.forgot.loading'});
  //  this.dataService.forgot(params).then((result) => {
  //    if (result && result.goto) {
  //      this.pageService.gotoRoot(result.goto, result);
  //      this.pageService.hideLoading();
  //      return;
  //    }
  //    this.pageService.gotoRoot('user/verify', result);
  //    this.pageService.showMessage({event: params.$event, value: result, message: 'user.forgot.success'});
  //  }).catch((error) => {
  //    this.pageService.showMessage({event: params.$event, error});
  //  });
  //}

  //sendVerify: {
  //  this.pageService.showLoading({message: 'user.forgot.loading'});
  //  this.dataService.verify(params).then((result) => {
  //    if (result && result.goto) {
  //      this.pageService.gotoRoot(result.goto, result);
  //      this.pageService.hideLoading();
  //      return;
  //    }
  //    this.pageService.gotoRoot('home');
  //    this.pageService.showMessage({event: params.$event, value: result, message: 'user.verify.success'});
  //  }).catch((error) => {
  //    this.pageService.showMessage({event: params.$event, error});
  //  });
  //}
}
