export const user: any = {
  module: () => import('./user.module').then((m) => m.UserPageModule),
  routes: [
    {
      path: 'user/profile',
      name: 'user.profile.title',
      icon: 'person-circle',
      menu: '',
      view: 'profile',
      auth: ['administrator', 'supervisor', 'operator', 'user']
    },
    {
      path: 'user/change/name',
      name: 'user.change_name.title',
      icon: 'create',
      menu: '',
      view: 'changeName',
      auth: ['administrator', 'supervisor', 'operator', 'user']
    },
    {
      path: 'user/change/phone',
      name: 'user.change_phone.title',
      icon: 'create',
      menu: '',
      view: 'changePhone',
      auth: ['administrator', 'supervisor', 'operator', 'user']
    },
    {
      path: 'user/change/email',
      name: 'user.change_email.title',
      icon: 'create',
      menu: '',
      view: 'changeEmail',
      auth: ['administrator', 'supervisor', 'operator', 'user']
    },
    {
      path: 'user/change/address',
      name: 'user.change_address.title',
      icon: 'create',
      menu: '',
      view: 'changeAddress',
      auth: ['administrator', 'supervisor', 'operator', 'user']
    },
    {
      path: 'user/change/website',
      name: 'user.change_website.title',
      icon: 'create',
      menu: '',
      view: 'changeWebsite',
      auth: ['administrator', 'supervisor', 'operator', 'user']
    },
    {
      path: 'user/change/password',
      name: 'user.change_password.title',
      icon: 'create',
      menu: '',
      view: 'changePassword',
      auth: ['administrator', 'supervisor', 'operator', 'user']
    },
    {
      path: 'user/change/security',
      name: 'user.change_security.title',
      icon: 'create',
      menu: '',
      view: 'changeSecurity',
      auth: ['administrator', 'supervisor', 'operator', 'user']
    },
    {
      path: 'user/signout',
      name: 'user.signout.title',
      icon: 'log-out',
      menu: '',
      view: 'signout',
      auth: ['administrator', 'supervisor', 'operator', 'user']
    },
    {
      path: 'user/signin',
      name: 'user.signin.title',
      icon: 'log-in',
      menu: '',
      view: 'signin',
      auth: ['anonymous']
    },
    {
      path: 'user/signup',
      name: 'user.signup.title',
      icon: 'person-add',
      menu: '',
      view: 'signup',
      auth: []
    },
    {
      path: 'user/forgot',
      name: 'user.forgot.title',
      icon: 'key',
      menu: '',
      view: 'forgot',
      auth: ['anonymous']
    },
    {
      path: 'user/verify',
      name: 'user.verify.title',
      icon: 'key',
      menu: '',
      view: 'verify',
      auth: ['anonymous']
    }
  ],
  config: {
    name: 'user',
    i18n: {
      es: {
        'profile.title': 'Mi cuenta',
        'profile.signout': 'Salir',

        'change_name.title': 'Cambiar mi nombre',
        'change_name.loading': 'Estamos actualizando tu nombre. Por favor, aguarda un instante.',
        'change_name.success': 'Tu nombre fue actualizado correctamente.',

        'change_image.title': 'Cambiar mi imagen',
        'change_image.loading': 'Estamos actualizando tu imagen. Por favor, aguarda un instante.',
        'change_image.success': 'Tu imagen fue actualizada correctamente.',

        'change_phone.title': 'Cambiar mi teléfono',
        'change_phone.loading': 'Estamos actualizando tu teléfono. Por favor, aguarda un instante.',
        'change_phone.success': 'Tu teléfono fue actualizado correctamente.',

        'change_email.title': 'Cambiar mi e-mail',
        'change_email.loading': 'Estamos actualizando tu e-mail. Por favor, aguarda un instante.',
        'change_email.success': 'Tu e-mail fue actualizado correctamente.',

        'change_address.title': 'Cambiar mi dirección',
        'change_address.loading': 'Estamos actualizando tu dirección. Por favor, aguarda un instante.',
        'change_address.success': 'Tu dirección fue actualizada correctamente.',

        'change_website.title': 'Cambiar mi sitio web',
        'change_website.loading': 'Estamos actualizando tu sitio web. Por favor, aguarda un instante.',
        'change_website.success': 'Tu sitio web fue actualizada correctamente.',

        'change_options.title': 'Cambiar mis opciones',
        'change_options.loading': 'Estamos actualizando tus opciones. Por favor, aguarda un instante.',
        'change_options.success': 'Tus opciones fueron actualizadas correctamente.',

        'change_password.title': 'Cambiar mi clave',
        'change_password.loading': 'Estamos actualizando tu clave. Por favor, aguarda un instante.',
        'change_password.success': 'Tu clave fue actualizada correctamente.',

        'change_security.title': 'Cambiar mi ingreso',
        'change_security.loading': 'Estamos actualizando tu ingreso. Por favor, aguarda un instante.',
        'change_security.success': 'Tu ingreso fue actualizado correctamente.',

        'signout.title': 'Salir',
        'signout.legend': '¿<strong>{{name}}</strong> realmente quieres cerrar tu sesión?',
        'signout.loading': 'Estamos cerrando tu sesión. Por favor, aguarda un instante.',
        'signout.success': '<strong>¡Hasta pronto {{name}}!</strong>',

        'signin.title': 'Ingresar',
        'signin.submit': 'Continuar',
        'signin.signup': 'Crear cuenta',
        'signin.forgot': 'No sé mi clave',
        'signin.loading': 'Estamos iniciando tu sesión. Por favor, aguarda un instante.',
        'signin.success': '<strong>¡Hola {{name}}!</strong>',

        'signup.title': 'Crear cuenta',
        'signup.submit': 'Continuar',
        'signup.signin': 'Ya tengo cuenta',
        'signup.loading': 'Estamos creado tu cuenta. Por favor, aguarda un instante.',
        'signup.success': '<strong>¡Hola {{name}}!</strong>',

        'forgot.title': 'Recuperar clave',
        'forgot.submit': 'Continuar',
        'forgot.signin': 'Ingresar',
        'forgot.loading': 'Estamos procesando tu pedido. Por favor, aguarda un instante.',
        'forgot.success': '<strong>¡Te enviamos un mensage a {{email}} para que puedas cambiar tu clave!</strong>',

        'verify.title': 'Verificar código',
        'verify.submit': 'Continuar',
        'verify.signin': 'Ingresar',
        'verify.loading': 'Estamos procesando tu pedido. Por favor, aguarda un instante.',
        'verify.success': '<strong>¡Hola {{name}}!</strong>',

        'name.label': 'Nombre',
        'name.required': 'El nombre es requerido',
        'name.invalid': 'El nombre es inválido',
        'name.valid': 'Escribe tu nombre',
        'name.value': 'Agregar mi nombre',

        'image.label': 'Imagen',
        'image.required': 'La imagen es requerida',
        'image.invalid': 'La imagen es inválida',
        'image.valid': 'Publica tu imagen',
        'image.value': 'Agregar mi imagen',

        'phone.label': 'Teléfono',
        'phone.required': 'El teléfono es requerido',
        'phone.invalid': 'El teléfono es inválido',
        'phone.valid': 'Escribe tu teléfono',
        'phone.value': 'Agregar mi teléfono',

        'email.label': 'E-mail',
        'email.required': 'El e-mail es requerido',
        'email.invalid': 'El e-mail es inválido',
        'email.valid': 'Escribe tu e-mail',
        'email.value': 'Agregar mi e-mail',

        'address.label': 'Dirección',
        'address.required': 'La dirección es requerida',
        'address.invalid': 'La dirección es inválida',
        'address.valid': 'Escribe tu dirección',
        'address.value': 'Agregar mi dirección',

        'website.label': 'Sitio Web',
        'website.required': 'El sitio web es requerido',
        'website.invalid': 'El sitio web es inválido',
        'website.valid': 'Escribe tu sitio web',
        'website.value': 'Agregar mi sitio web',

        'security.header': 'Seguridad',
        'security.legend': 'Define tus opciones de seguridad.',

        'recovery.label': 'PIN',
        'recovery.required': 'El PIN es requerido',
        'recovery.invalid': 'El PIN debe tener al menos 5 caracteres',
        'recovery.valid': 'Define el PIN',
        'recovery.value': 'Cambiar mi PIN',

        'password.label': 'Clave',
        'password.required': 'La clave es requerida',
        'password.invalid': 'La clave debe tener al menos 5 caracteres',
        'password.valid': 'Escribe tu nueva clave',
        'password.value': 'Cambiar mi clave',

        'security.label': 'Ingreso',
        'security.required': 'El ingreso es requerido',
        'security.invalid': 'El ingreso es inválido',
        'security.valid': 'Define el ingreso',
        'security.value': 'Cambiar mi ingreso',
        'security.value[standard]': 'Estándar',
        'security.value[2fa]': 'Segundo factor',

        'access.label': 'Acceso',
        'access.required': 'El acceso es requerido',
        'access.invalid': 'El acceso es inválido',
        'access.valid': 'Define el acceso',
        'access.value[administrator]': 'Administrador',
        'access.value[supervisor]': 'Supervisor',
        'access.value[operator]': 'Operador',
        'access.value[user]': 'Usuario',

        'status.label': 'Estado',
        'status.required': 'El estado es requerido',
        'status.invalid': 'El estado es inválido',
        'status.valid': 'Define el estado',
        'status.value[enabled]': 'Activo',
        'status.value[disabled]': 'Inactivo'
      }
    }
  }
};
