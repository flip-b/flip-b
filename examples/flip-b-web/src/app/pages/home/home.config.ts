export const home: any = {
  module: () => import('./home.module').then((m) => m.HomePageModule),
  routes: [
    {
      path: 'home',
      name: 'home.main.title',
      icon: 'home',
      menu: 'primary',
      view: 'home',
      auth: ['administrator', 'supervisor', 'operator', 'user']
    }
  ],
  config: {
    name: 'home',
    i18n: {
      es: {
        'main.title': 'Principal',

        show_loading: 'Estamos procesando tu solicitud. Por favor, aguarda un instante.',
        show_loading_on_search: 'Estamos buscando. Por favor, aguarda un instante.',
        show_loading_on_select: 'Estamos consultando. Por favor, aguarda un instante.',
        show_loading_on_create: 'Estamos creado. Por favor, aguarda un instante.',
        show_loading_on_update: 'Estamos actualizando. Por favor, aguarda un instante.',
        show_loading_on_delete: 'Estamos eliminado. Por favor, aguarda un instante.',

        show_success: '',
        show_success_on_search: '',
        show_success_on_select: '',
        show_success_on_create: '<strong>{{name}}</strong> fue creado correctamente.',
        show_success_on_update: '<strong>{{name}}</strong> fue actualizado correctamente.',
        show_success_on_delete: '<strong>{{name}}</strong> fue eliminado correctamente.',

        show_warning: '',
        show_warning_on_search: '',
        show_warning_on_select: '',
        show_warning_on_create: '<strong>{{name}}</strong> no fue creado correctamente.',
        show_warning_on_update: '<strong>{{name}}</strong> no fue actualizado correctamente.',
        show_warning_on_delete: '<strong>{{name}}</strong> no fue eliminado correctamente.',

        show_message_status_500: 'Algo malo sucedió por tu solicitud. Por favor, intentalo de nuevo más tarde.',
        show_message_status_404: 'El recurso al que estás intentando acceder no se encontró.',
        show_message_status_403: 'El e-mail o la clave que enviaste no se corresponden con una cuenta de usuario activa.',
        show_message_status_402: 'Tu usuario no tiene una sesión activa para realizar esta acción.',
        show_message_status_401: 'Tu usuario no tiene permisos para realizar esta acción.',
        show_message_status_400: 'Algo malo sucedió con tu solicitud. Por favor, intentalo de nuevo más tarde.',

        button_search: 'Buscar',
        button_select: 'Seleccionar',
        button_submit: 'Guardar',
        button_attach: 'Agregar',
        button_create: 'Crear',
        button_update: 'Actualizar',
        button_delete: 'Borrar',
        button_accept: 'Aceptar',
        button_cancel: 'Cancelar',
        button_export: 'Exportar',
        button_import: 'Importar',

        legend_export: 'Descargar hoja de cálculo',
        legend_import: 'Procesar hoja de cálculo',

        select_account: 'Selecciona una cuenta',
        select_place: 'Selecciona un punto',

        order_by: 'Ordenar por',
        order_at: 'Ordenar en forma',

        asc: 'Ascendente',
        desc: 'Descendente',

        all: 'Todos',
        yes: 'Si',
        no: 'No',
        to: 'Hasta',
        from: 'Desde',

        name: 'Nombre',
        group: 'Grupo',
        scope: 'Vista',
        options: 'Opciones',
        reports: 'Reportes',
        private: 'Información de uso interno',

        address: 'Dirección',
        street: 'Calle y altura',
        city: 'Ciudad',
        state: 'Provincia',
        country: 'País',
        zipcode: 'CP',

        created_at: 'Creación',
        updated_at: 'Actualización',
        deleted_at: 'Eliminación'
      }
    }
  }
};
