export const accounts: any = {
  module: () => import('./accounts.module').then((m) => m.AccountsPageModule),
  routes: [
    {
      path: 'accounts/search',
      name: 'accounts.search.title',
      icon: 'bookmarks',
      menu: 'primary',
      view: 'search',
      auth: ['administrator']
    },
    {
      path: 'accounts/select/:_id',
      name: 'accounts.select.title',
      icon: 'search',
      menu: '',
      view: 'select',
      auth: ['administrator']
    },
    {
      path: 'accounts/create',
      name: 'accounts.create.title',
      icon: 'create',
      menu: '',
      view: 'create',
      auth: ['administrator']
    },
    {
      path: 'accounts/update/:_id',
      name: 'accounts.update.title',
      icon: 'create',
      menu: '',
      view: 'update',
      auth: ['administrator']
    },
    {
      path: 'accounts/delete/:_id',
      name: 'accounts.delete.title',
      icon: 'create',
      menu: '',
      view: 'delete',
      auth: ['administrator']
    },
    {
      path: 'accounts/export',
      name: 'accounts.export.title',
      icon: 'cloud-download',
      menu: '',
      view: 'export',
      auth: ['administrator']
    },
    {
      path: 'accounts/import',
      name: 'accounts.import.title',
      icon: 'cloud-upload',
      menu: '',
      view: 'import',
      auth: ['administrator']
    }
  ],
  config: {
    name: 'accounts',
    i18n: {
      es: {
        'search.title': 'Cuentas',
        'select.title': 'Cuenta',
        'create.title': 'Crear cuenta',
        'update.title': 'Editar cuenta',
        'delete.title': 'Borrar cuenta',
        'export.title': 'Exportar cuentas',
        'import.title': 'Importar cuentas',

        'search.legend': 'Busca en cuentas',
        'delete.legend': '¿Realmente quieres borrar la cuenta <strong>{{name}}</strong>? Esta acción no se puede revertir.',

        '_id.label': 'Cuenta',
        '_id.required': 'La cuenta es requerida',
        '_id.invalid': 'La cuenta es inválida',
        '_id.valid': 'Define la cuenta',

        'name.label': 'Nombre',
        'name.required': 'El nombre es requerido',
        'name.invalid': 'El nombre es inválido',
        'name.valid': 'Define el nombre',

        'group.label': 'Grupo',
        'group.required': 'El grupo es requerido',
        'group.invalid': 'El grupo es inválido',
        'group.valid': 'Define el grupo',

        'image.label': 'Imagen',
        'image.required': 'La imagen es requerida',
        'image.invalid': 'La imagen es inválida',
        'image.valid': 'Define la imagen',

        'notes.label': 'Notas',
        'notes.required': 'Las notas son requeridas',
        'notes.invalid': 'Las notas son inválidas',
        'notes.valid': 'Define las notas',

        'phone.label': 'Teléfono',
        'phone.required': 'El teléfono es requerido',
        'phone.invalid': 'El teléfono es inválido',
        'phone.valid': 'Define el teléfono',

        'email.label': 'E-mail',
        'email.required': 'El e-mail es requerido',
        'email.invalid': 'El e-mail es inválido',
        'email.valid': 'Define el e-mail',

        'address.label': 'Dirección',
        'address.required': 'La dirección es requerida',
        'address.invalid': 'La dirección es inválida',
        'address.valid': 'Define la dirección',

        'address.street': 'Calle y altura',
        'address.city': 'Ciudad',
        'address.state': 'Provincia',
        'address.country': 'País',
        'address.zipcode': 'CP',
        'address.position.0': 'Latitud',
        'address.position.1': 'Longitud',

        'website.label': 'Sitio Web',
        'website.required': 'El sitio web es requerido',
        'website.invalid': 'El sitio web es inválido',
        'website.valid': 'Define el sitio web',

        'created_at.label': 'Creación',
        'created_at.required': 'La fecha de creación es requerida',
        'created_at.invalid': 'La fecha de creación es inválida',
        'created_at.valid': 'Define la fecha de creación',

        'updated_at.label': 'Actualización',
        'updated_at.required': 'La fecha de actualización es requerida',
        'updated_at.invalid': 'La fecha de actualización es inválida',
        'updated_at.valid': 'Define la fecha de actualización'
      }
    }
  }
};
