export const products: any = {
  module: () => import('./products.module').then((m) => m.ProductsPageModule),
  routes: [
    {
      path: 'products/search',
      name: 'products.search.title',
      icon: 'storefront',
      menu: 'primary',
      view: 'search',
      auth: ['administrator', 'supervisor']
    },
    {
      path: 'products/select/:_id',
      name: 'products.select.title',
      icon: 'search',
      menu: '',
      view: 'select',
      auth: ['administrator', 'supervisor']
    },
    {
      path: 'products/create',
      name: 'products.create.title',
      icon: 'create',
      menu: '',
      view: 'create',
      auth: ['administrator']
    },
    {
      path: 'products/update/:_id',
      name: 'products.update.title',
      icon: 'create',
      menu: '',
      view: 'update',
      auth: ['administrator']
    },
    {
      path: 'products/delete/:_id',
      name: 'products.delete.title',
      icon: 'create',
      menu: '',
      view: 'delete',
      auth: ['administrator']
    },
    {
      path: 'products/export',
      name: 'products.export.title',
      icon: 'cloud-download',
      menu: '',
      view: 'export',
      auth: ['administrator']
    },
    {
      path: 'products/import',
      name: 'products.import.title',
      icon: 'cloud-upload',
      menu: '',
      view: 'import',
      auth: ['administrator']
    }
  ],
  config: {
    name: 'products',
    i18n: {
      es: {
        'search.title': 'Productos',
        'select.title': 'Producto',
        'create.title': 'Crear producto',
        'update.title': 'Editar producto',
        'delete.title': 'Borrar producto',
        'export.title': 'Exportar productos',
        'import.title': 'Importar productos',

        'search.legend': 'Busca en productos',
        'delete.legend': '¿Realmente quieres borrar el producto <strong>{{name}}</strong>? Esta acción no se puede revertir.',

        '_id.label': 'Producto',
        '_id.required': 'El producto es requerido',
        '_id.invalid': 'El producto es inválido',
        '_id.valid': 'Define el producto',

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

        'account.label': 'Cuenta',
        'account.required': 'La cuenta es requerida',
        'account.invalid': 'La cuenta es inválida',
        'account.valid': 'Define la cuenta',

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
