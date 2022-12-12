export const events: any = {};

/***********************************************************************************************************************
 ***********************************************************************************************************************
 ***
 *** Global form events
 ***
 ***********************************************************************************************************************
 **********************************************************************************************************************/

/**
 * Global form setup event handler
 */
events['form.onSetup'] = async ({self, data, view, form, item, $event, result}: any): Promise<any> => {
  try {
    if (form.noDefaultEvent === undefined) {
      result = await _defaultFormSetup({self, data, view, form, item, $event, result});
    }
    return result;
  } catch (error: any) {
    return false;
  }
};

/***********************************************************************************************************************
 ***********************************************************************************************************************
 ***
 *** Search form events
 ***
 ***********************************************************************************************************************
 **********************************************************************************************************************/

/**
 * Search form setup event handler
 */
events['search.form.onSetup'] = async ({self, data, view, form, item, $event, result}: any): Promise<any> => {
  try {
    form.header = [];
    form.header.push({name: 'search', type: 'search'});
    form.footer = [];
    form.navbar = [];
    form.navbar.push({name: 'filter', type: 'button', onSetup: _defaultFilterSetup, onClick: _defaultFilterClick});
    form.navbar.push({name: 'metric', type: 'button', onSetup: _defaultMetricSetup, onClick: _defaultMetricClick});
    form.navbar.push({name: 'expand', type: 'expand'});
    form.navbar.push({name: 'export', type: 'button', onSetup: _defaultExportSetup, onClick: _defaultExportClick});
    form.navbar.push({name: 'import', type: 'button', onSetup: _defaultImportSetup, onClick: _defaultImportClick});
    form.navbar.push({name: 'create', type: 'button', onSetup: _defaultCreateSetup, onClick: _defaultCreateClick});
    form.fields = [];

    if (form.onSetup) {
      result = await form.onSetup({self, data, view, form, item, $event, result});
    }
    if (view.onSetup) {
      result = await view.onSetup({self, data, view, form, item, $event, result});
    }
    return result;
  } catch (error: any) {
    return false;
  }
};

/**
 * Search form select event handler
 */
events['search.form.onSelect'] = async ({self, data, view, form, item, $event, result}: any): Promise<any> => {
  try {
    data.showLoading({message: `${view.name}.search.loading`});

    if (view.rest) {
      result = await data.http.request({search: view.rest, data: view.data});
    } else if (view.data.setResult) {
      result = view.data.setResult.value;
    }

    if (form.onSearch) {
      result = await form.onSearch({self, data, view, form, item, $event, result});
    }
    if (view.onSearch) {
      result = await view.onSearch({self, data, view, form, item, $event, result});
    }

    if (result) {
      form.values = [];
      for (const r of result) {
        form.values.push(await self.formatItem({name: 'select', type: 'values', value: getSlotValue(view.slot, r), onClick: _defaultValuesClick}));
      }
    }

    await data.showMessage({message: `${view.name}.search.success`, value: result});
  } catch (error: any) {
    await data.showMessage({message: `${view.name}.search.warning`, error});
    return false;
  }
};

/***********************************************************************************************************************
 ***********************************************************************************************************************
 ***
 *** Select form events
 ***
 ***********************************************************************************************************************
 **********************************************************************************************************************/

/**
 * Select form setup event handler
 */
events['select.form.onSetup'] = async ({self, data, view, form, item, $event, result}: any): Promise<any> => {
  try {
    form.header = [];
    form.header.push({name: 'select', type: 'header'});
    form.footer = [];
    form.navbar = [];
    form.navbar.push({name: 'download', type: 'button', onSetup: _defaultDownloadSetup, onClick: _defaultDownloadClick});
    form.navbar.push({name: 'print', type: 'button', onSetup: _defaultPrintSetup, onClick: _defaultPrintClick});
    form.navbar.push({name: 'share', type: 'button', onSetup: _defaultShareSetup, onClick: _defaultShareClick});
    form.navbar.push({name: 'sendmail', type: 'button', onSetup: _defaultSendmailSetup, onClick: _defaultSendmailClick});
    form.navbar.push({name: 'expand', type: 'expand'});
    form.navbar.push({name: 'delete', type: 'button', onSetup: _defaultDeleteSetup, onClick: _defaultDeleteClick});
    form.navbar.push({name: 'update', type: 'button', onSetup: _defaultUpdateSetup, onClick: _defaultUpdateClick});
    form.navbar.push({name: 'cancel', type: 'cancel'});
    form.filter = [];
    form.metric = [];
    form.values = [];

    if (form.onSetup) {
      result = await form.onSetup({self, data, view, form, item, $event, result});
    }
    if (view.onSetup) {
      result = await view.onSetup({self, data, view, form, item, $event, result});
    }
    return result;
  } catch (error: any) {
    return false;
  }
};

/**
 * Select form select event handler
 */
events['select.form.onSelect'] = async ({self, data, view, form, item, $event, result}: any): Promise<any> => {
  try {
    data.showLoading({message: `${view.name}.select.loading`});

    if (view.rest) {
      result = await data.http.request({select: view.rest, data: view.data});
    } else if (view.data.setResult) {
      result = view.data.setResult.value;
    }

    if (form.onSelect) {
      result = await form.onSelect({self, data, view, form, item, $event, result});
    }
    if (view.onSelect) {
      result = await view.onSelect({self, data, view, form, item, $event, result});
    }

    if (result) {
      for (const item of form.header) {
        item.setValue(getSlotValue(view.slot, result));
      }
      for (const item of form.fields) {
        item.setValue(result[`${item.name}`]);
      }
    }

    await data.showMessage({message: `${view.name}.select.success`, value: result});
  } catch (error: any) {
    await data.showMessage({message: `${view.name}.select.warning`, error});
    return false;
  }
};

/**
 * Select form cancel event handler
 */
events['select.form.onCancel'] = async ({self, data, view, form, item, $event, result}: any): Promise<any> => {
  try {
    data.showLoading({message: `${view.name}.cancel.loading`});

    if (form.onCancel) {
      result = await form.onCancel({self, data, view, form, item, $event, result});
    }
    if (view.onCancel) {
      result = await view.onCancel({self, data, view, form, item, $event, result});
    }

    if (self.modal) {
      await self.modal.dismiss();
    } else {
      await data.gotoBack();
    }

    await data.showMessage({message: `${view.name}.cancel.success`, value: result});
  } catch (error: any) {
    await data.showMessage({message: `${view.name}.cancel.warning`, error});
    return false;
  }
};

/***********************************************************************************************************************
 ***********************************************************************************************************************
 ***
 *** Create form events
 ***
 ***********************************************************************************************************************
 **********************************************************************************************************************/

/**
 * Create form setup event handler
 */
events['create.form.onSetup'] = async ({self, data, view, form, item, $event, result}: any): Promise<any> => {
  try {
    form.header = [];
    form.header.push({name: 'create', type: 'header'});
    form.footer = [];
    form.footer.push({name: 'submit', type: 'submit', size: 50});
    form.footer.push({name: 'cancel', type: 'cancel', size: 50});
    form.navbar = [];
    form.navbar.push({name: 'expand', type: 'expand'});
    form.navbar.push({name: 'submit', type: 'submit'});
    form.navbar.push({name: 'cancel', type: 'cancel'});
    form.filter = [];
    form.metric = [];
    form.values = [];

    if (form.onSetup) {
      result = await form.onSetup({self, data, view, form, item, $event, result});
    }
    if (view.onSetup) {
      result = await view.onSetup({self, data, view, form, item, $event, result});
    }
    return result;
  } catch (error: any) {
    return false;
  }
};

/**
 * Create form select event handler
 */
events['create.form.onSelect'] = async ({self, data, view, form, item, $event, result}: any): Promise<any> => {
  try {
    data.showLoading({message: `${view.name}.select.loading`});

    if (form.onSelect) {
      result = await form.onSelect({self, data, view, form, item, $event, result});
    }
    if (view.onSelect) {
      result = await view.onSelect({self, data, view, form, item, $event, result});
    }

    await data.showMessage({message: `${view.name}.select.success`, value: result});
  } catch (error: any) {
    await data.showMessage({message: `${view.name}.select.warning`, error});
    return false;
  }
};

/**
 * Create form submit event handler
 */
events['create.form.onSubmit'] = async ({self, data, view, form, item, $event, result}: any): Promise<any> => {
  try {
    data.showLoading({message: `${view.name}.create.loading`});

    if (view.rest) {
      result = await data.http.request({create: view.rest, data: view.data, body: getFormValue({self, data, view, form, item, $event, result})});
    }

    if (form.onCreate) {
      result = await form.onCreate({self, data, view, form, item, $event, result});
    }
    if (view.onCreate) {
      result = await view.onCreate({self, data, view, form, item, $event, result});
    }

    if (self.modal) {
      await self.modal.dismiss();
    } else {
      await data.gotoRoot(`${view.name}/search`);
    }

    await data.showMessage({message: `${view.name}.create.success`, value: result});
  } catch (error: any) {
    await data.showMessage({message: `${view.name}.create.warning`, error});
    return false;
  }
};

/**
 * Create form cancel event handler
 */
events['create.form.onCancel'] = async ({self, data, view, form, item, $event, result}: any): Promise<any> => {
  try {
    data.showLoading({message: `${view.name}.cancel.loading`});

    if (form.onCancel) {
      result = await form.onCancel({self, data, view, form, item, $event, result});
    }
    if (view.onCancel) {
      result = await view.onCancel({self, data, view, form, item, $event, result});
    }

    if (self.modal) {
      await self.modal.dismiss();
    } else {
      await data.gotoBack();
    }

    await data.showMessage({message: `${view.name}.cancel.success`, value: result});
  } catch (error: any) {
    await data.showMessage({message: `${view.name}.cancel.warning`, error});
    return false;
  }
};

/***********************************************************************************************************************
 ***********************************************************************************************************************
 ***
 *** Update form events
 ***
 ***********************************************************************************************************************
 **********************************************************************************************************************/

/**
 * Update form setup event handler
 */
events['update.form.onSetup'] = async ({self, data, view, form, item, $event, result}: any): Promise<any> => {
  try {
    form.header = [];
    form.header.push({name: 'update', type: 'header'});
    form.footer = [];
    form.footer.push({name: 'submit', type: 'submit', size: 50});
    form.footer.push({name: 'cancel', type: 'cancel', size: 50});
    form.navbar = [];
    form.navbar.push({name: 'expand', type: 'expand'});
    form.navbar.push({name: 'submit', type: 'submit'});
    form.navbar.push({name: 'cancel', type: 'cancel'});
    form.filter = [];
    form.metric = [];
    form.values = [];

    if (form.onSetup) {
      result = await form.onSetup({self, data, view, form, item, $event, result});
    }
    if (view.onSetup) {
      result = await view.onSetup({self, data, view, form, item, $event, result});
    }
    return result;
  } catch (error: any) {
    return false;
  }
};

/**
 * Update form select event handler
 */
events['update.form.onSelect'] = async ({self, data, view, form, item, $event, result}: any): Promise<any> => {
  try {
    data.showLoading({message: `${view.name}.select.loading`});

    if (view.rest) {
      result = await data.http.request({select: view.rest, data: view.data});
    } else if (view.data.setResult) {
      result = view.data.setResult.value;
    }

    if (form.onSelect) {
      result = await form.onSelect({self, data, view, form, item, $event, result});
    }
    if (view.onSelect) {
      result = await view.onSelect({self, data, view, form, item, $event, result});
    }

    if (result) {
      for (const item of form.header) {
        item.setValue(getSlotValue(view.slot, result));
      }
      for (const item of form.fields) {
        item.setValue(result[`${item.name}`]);
      }
    }

    await data.showMessage({message: `${view.name}.select.success`, value: result});
  } catch (error: any) {
    await data.showMessage({message: `${view.name}.select.warning`, error});
    return false;
  }
};

/**
 * Update form submit event handler
 */
events['update.form.onSubmit'] = async ({self, data, view, form, item, $event, result}: any): Promise<any> => {
  try {
    data.showLoading({message: `${view.name}.update.loading`});

    if (view.rest) {
      result = await data.http.request({update: view.rest, data: view.data, body: getFormValue({self, data, view, form, item, $event, result})});
    }

    if (form.onUpdate) {
      result = await form.onUpdate({self, data, view, form, item, $event, result});
    }
    if (view.onUpdate) {
      result = await view.onUpdate({self, data, view, form, item, $event, result});
    }

    if (self.modal) {
      await self.modal.dismiss();
    } else {
      await data.gotoRoot(`${view.name}/search`);
    }

    await data.showMessage({message: `${view.name}.update.success`, value: result});
  } catch (error: any) {
    await data.showMessage({message: `${view.name}.update.warning`, error});
    return false;
  }
};

/**
 * Update form cancel event handler
 */
events['update.form.onCancel'] = async ({self, data, view, form, item, $event, result}: any): Promise<any> => {
  try {
    data.showLoading({message: `${view.name}.cancel.loading`});

    if (form.onCancel) {
      result = await form.onCancel({self, data, view, form, item, $event, result});
    }
    if (view.onCancel) {
      result = await view.onCancel({self, data, view, form, item, $event, result});
    }

    if (self.modal) {
      await self.modal.dismiss();
    } else {
      await data.gotoBack();
    }

    await data.showMessage({message: `${view.name}.cancel.success`, value: result});
  } catch (error: any) {
    await data.showMessage({message: `${view.name}.cancel.warning`, error});
    return false;
  }
};

/***********************************************************************************************************************
 ***********************************************************************************************************************
 ***
 *** Delete form events
 ***
 ***********************************************************************************************************************
 **********************************************************************************************************************/

/**
 * Delete form setup event handler
 */
events['delete.form.onSetup'] = async ({self, data, view, form, item, $event, result}: any): Promise<any> => {
  try {
    form.header = [];
    form.header.push({name: 'delete', type: 'header'});
    form.footer = [];
    form.footer.push({name: 'submit', type: 'submit', size: 50});
    form.footer.push({name: 'cancel', type: 'cancel', size: 50});
    form.navbar = [];
    form.navbar.push({name: 'expand', type: 'expand'});
    form.navbar.push({name: 'submit', type: 'submit'});
    form.navbar.push({name: 'cancel', type: 'cancel'});
    form.filter = [];
    form.metric = [];
    form.values = [];

    if (form.onSetup) {
      result = await form.onSetup({self, data, view, form, item, $event, result});
    }
    if (view.onSetup) {
      result = await view.onSetup({self, data, view, form, item, $event, result});
    }
    return result;
  } catch (error: any) {
    return false;
  }
};

/**
 * Delete form select event handler
 */
events['delete.form.onSelect'] = async ({self, data, view, form, item, $event, result}: any): Promise<any> => {
  try {
    data.showLoading({message: `${view.name}.select.loading`});

    if (view.rest) {
      result = await data.http.request({select: view.rest, data: view.data});
    } else if (view.data.setResult) {
      result = view.data.setResult.value;
    }

    if (form.onSelect) {
      result = await form.onSelect({self, data, view, form, item, $event, result});
    }
    if (view.onSelect) {
      result = await view.onSelect({self, data, view, form, item, $event, result});
    }

    if (result) {
      for (const item of form.header) {
        item.setValue(getSlotValue(view.slot, result));
      }
      for (const item of form.fields) {
        item.setValue(result[`${item.name}`]);
      }
    }

    await data.showMessage({message: `${view.name}.select.success`, value: result});
  } catch (error: any) {
    await data.showMessage({message: `${view.name}.select.warning`, error});
    return false;
  }
};

/**
 * Delete form submit event handler
 */
events['delete.form.onSubmit'] = async ({self, data, view, form, item, $event, result}: any): Promise<any> => {
  try {
    data.showLoading({message: `${view.name}.delete.loading`});

    if (view.rest) {
      result = await data.http.request({delete: view.rest, data: view.data, body: getFormValue({self, data, view, form, item, $event, result})});
    }

    if (form.onDelete) {
      result = await form.onDelete({self, data, view, form, item, $event, result});
    }
    if (view.onDelete) {
      result = await view.onDelete({self, data, view, form, item, $event, result});
    }

    if (self.modal) {
      await self.modal.dismiss();
    } else {
      await data.gotoRoot(`${view.name}/search`);
    }

    await data.showMessage({message: `${view.name}.delete.success`, value: result});
  } catch (error: any) {
    await data.showMessage({message: `${view.name}.delete.warning`, error});
    return false;
  }
};

/**
 * Delete form cancel event handler
 */
events['delete.form.onCancel'] = async ({self, data, view, form, item, $event, result}: any): Promise<any> => {
  try {
    data.showLoading({message: `${view.name}.cancel.loading`});

    if (form.onCancel) {
      result = await form.onCancel({self, data, view, form, item, $event, result});
    }
    if (view.onCancel) {
      result = await view.onCancel({self, data, view, form, item, $event, result});
    }

    if (self.modal) {
      await self.modal.dismiss();
    } else {
      await data.gotoBack();
    }

    await data.showMessage({message: `${view.name}.cancel.success`, value: result});
  } catch (error: any) {
    await data.showMessage({message: `${view.name}.cancel.warning`, error});
    return false;
  }
};

/***********************************************************************************************************************
 ***********************************************************************************************************************
 ***
 *** Export form events
 ***
 ***********************************************************************************************************************
 **********************************************************************************************************************/

/**
 * Export form setup event handler
 */
events['export.form.onSetup'] = async ({self, data, view, form, item, $event, result}: any): Promise<any> => {
  try {
    form.header = [];
    form.header.push({name: 'export', type: 'header'});
    form.footer = [];
    form.footer.push({name: 'submit', type: 'submit', size: 50});
    form.footer.push({name: 'cancel', type: 'cancel', size: 50});
    form.navbar = [];
    form.navbar.push({name: 'expand', type: 'expand'});
    form.navbar.push({name: 'submit', type: 'submit'});
    form.navbar.push({name: 'cancel', type: 'cancel'});
    form.fields = [];
    form.fields.push({name: 'format', type: 'select', default: 'xlsx', items: [{index: 'xlsx'}, {index: 'ods'}, {index: 'csv'}, {index: 'html'}], require: true});
    form.fields.push({name: 'fields', type: 'select', maxLength: 100});
    form.filter = [];
    form.metric = [];
    form.values = [];

    if (form.onSetup) {
      result = await form.onSetup({self, data, view, form, item, $event, result});
    }
    if (view.onSetup) {
      result = await view.onSetup({self, data, view, form, item, $event, result});
    }
    return result;
  } catch (error: any) {
    return false;
  }
};

/**
 * Export form select event handler
 */
events['export.form.onSelect'] = async ({self, data, view, form, item, $event, result}: any): Promise<any> => {
  try {
    data.showLoading({message: `${view.name}.select.loading`});

    if (form.onSelect) {
      result = await form.onSelect({self, data, view, form, item, $event, result});
    }
    if (view.onSelect) {
      result = await view.onSelect({self, data, view, form, item, $event, result});
    }

    await data.showMessage({message: `${view.name}.select.success`, value: result});
  } catch (error: any) {
    await data.showMessage({message: `${view.name}.select.warning`, error});
    return false;
  }
};

/**
 * Export form submit event handler
 */
events['export.form.onSubmit'] = async ({self, data, view, form, item, $event, result}: any): Promise<any> => {
  try {
    data.showLoading({message: `${view.name}.export.loading`});

    if (view.rest) {
      result = await data.http.request({submit: view.rest, data: view.data, body: getFormValue({self, data, view, form, item, $event, result})});
    }

    if (form.onExport) {
      result = await form.onExport({self, data, view, form, item, $event, result});
    }
    if (view.onExport) {
      result = await view.onExport({self, data, view, form, item, $event, result});
    }

    if (self.modal) {
      await self.modal.dismiss();
    } else {
      await data.gotoRoot(`${view.name}/search`);
    }

    await data.showMessage({message: `${view.name}.export.success`, value: result});
  } catch (error: any) {
    await data.showMessage({message: `${view.name}.export.warning`, error});
    return false;
  }
};

/**
 * Export form cancel event handler
 */
events['export.form.onCancel'] = async ({self, data, view, form, item, $event, result}: any): Promise<any> => {
  try {
    data.showLoading({message: `${view.name}.cancel.loading`});

    if (form.onCancel) {
      result = await form.onCancel({self, data, view, form, item, $event, result});
    }
    if (view.onCancel) {
      result = await view.onCancel({self, data, view, form, item, $event, result});
    }

    if (self.modal) {
      await self.modal.dismiss();
    } else {
      await data.gotoBack();
    }

    await data.showMessage({message: `${view.name}.cancel.success`, value: result});
  } catch (error: any) {
    await data.showMessage({message: `${view.name}.cancel.warning`, error});
    return false;
  }
};

/***********************************************************************************************************************
 ***********************************************************************************************************************
 ***
 *** Import form events
 ***
 ***********************************************************************************************************************
 **********************************************************************************************************************/

/**
 * Import form setup event handler
 */
events['import.form.onSetup'] = async ({self, data, view, form, item, $event, result}: any): Promise<any> => {
  try {
    form.header = [];
    form.header.push({name: 'import', type: 'header'});
    form.footer = [];
    form.footer.push({name: 'submit', type: 'submit', size: 50});
    form.footer.push({name: 'cancel', type: 'cancel', size: 50});
    form.navbar = [];
    form.navbar.push({name: 'expand', type: 'expand'});
    form.navbar.push({name: 'submit', type: 'submit'});
    form.navbar.push({name: 'cancel', type: 'cancel'});
    form.fields = [];
    form.fields.push({name: 'format', type: 'select', default: 'xlsx', items: [{index: 'xlsx'}, {index: 'ods'}, {index: 'csv'}, {index: 'html'}], require: true});
    form.fields.push({name: 'fields', type: 'select', maxLength: 100});
    form.fields.push({name: 'upload', type: 'attachment'});
    form.filter = [];
    form.metric = [];
    form.values = [];

    if (form.onSetup) {
      result = await form.onSetup({self, data, view, form, item, $event, result});
    }
    if (view.onSetup) {
      result = await view.onSetup({self, data, view, form, item, $event, result});
    }
    return result;
  } catch (error: any) {
    return false;
  }
};

/**
 * Import form select event handler
 */
events['import.form.onSelect'] = async ({self, data, view, form, item, $event, result}: any): Promise<any> => {
  try {
    data.showLoading({message: `${view.name}.select.loading`});

    if (form.onSelect) {
      result = await form.onSelect({self, data, view, form, item, $event, result});
    }
    if (view.onSelect) {
      result = await view.onSelect({self, data, view, form, item, $event, result});
    }

    await data.showMessage({message: `${view.name}.select.success`, value: result});
  } catch (error: any) {
    await data.showMessage({message: `${view.name}.select.warning`, error});
    return false;
  }
};

/**
 * Import form submit event handler
 */
events['import.form.onSubmit'] = async ({self, data, view, form, item, $event, result}: any): Promise<any> => {
  try {
    data.showLoading({message: `${view.name}.import.loading`});

    if (view.rest) {
      result = await data.http.request({submit: view.rest, data: view.data, body: getFormValue({self, data, view, form, item, $event, result})});
    }

    if (form.onImport) {
      result = await form.onImport({self, data, view, form, item, $event, result});
    }
    if (view.onImport) {
      result = await view.onImport({self, data, view, form, item, $event, result});
    }

    if (self.modal) {
      await self.modal.dismiss();
    } else {
      await data.gotoRoot(`${view.name}/search`);
    }

    await data.showMessage({message: `${view.name}.import.success`, value: result});
  } catch (error: any) {
    await data.showMessage({message: `${view.name}.import.warning`, error});
    return false;
  }
};

/**
 * Import form cancel event handler
 */
events['import.form.onCancel'] = async ({self, data, view, form, item, $event, result}: any): Promise<any> => {
  try {
    data.showLoading({message: `${view.name}.cancel.loading`});

    if (form.onCancel) {
      result = await form.onCancel({self, data, view, form, item, $event, result});
    }
    if (view.onCancel) {
      result = await view.onCancel({self, data, view, form, item, $event, result});
    }

    if (self.modal) {
      await self.modal.dismiss();
    } else {
      await data.gotoBack();
    }

    await data.showMessage({message: `${view.name}.cancel.success`, value: result});
  } catch (error: any) {
    await data.showMessage({message: `${view.name}.cancel.warning`, error});
    return false;
  }
};

/***********************************************************************************************************************
 ***********************************************************************************************************************
 ***
 *** Submit form events
 ***
 ***********************************************************************************************************************
 **********************************************************************************************************************/

/**
 * Submit form setup event handler
 */
events['submit.form.onSetup'] = async ({self, data, view, form, item, $event, result}: any): Promise<any> => {
  try {
    form.filter = [];
    form.metric = [];
    form.values = [];

    if (form.onSetup) {
      result = await form.onSetup({self, data, view, form, item, $event, result});
    }
    if (view.onSetup) {
      result = await view.onSetup({self, data, view, form, item, $event, result});
    }
    return result;
  } catch (error: any) {
    return false;
  }
};

/**
 * Submit form select event handler
 */
events['submit.form.onSelect'] = async ({self, data, view, form, item, $event, result}: any): Promise<any> => {
  try {
    data.showLoading({message: `${view.name}.select.loading`});

    if (view.data.setResult?.value) {
      result = view.data.setResult.value;
    }

    if (form.onSelect) {
      result = await form.onSelect({self, data, view, form, item, $event, result});
    }
    if (view.onSelect) {
      result = await view.onSelect({self, data, view, form, item, $event, result});
    }

    if (result) {
      for (const item of form.header) {
        item.setValue(getSlotValue(view.slot, result));
      }
      for (const item of form.fields) {
        item.setValue(result[`${item.name}`]);
      }
    }

    await data.showMessage({message: `${view.name}.select.success`, value: result});
  } catch (error: any) {
    await data.showMessage({message: `${view.name}.select.warning`, error});
    return false;
  }
};

/**
 * Submit form submit event handler
 */
events['submit.form.onSubmit'] = async ({self, data, view, form, item, $event, result}: any): Promise<any> => {
  try {
    data.showLoading({message: `${view.name}.submit.loading`});

    const body: any = getFormValue({self, data, view, form, item, $event, result});

    if (view.rest) {
      result = await data.http.request({submit: view.rest, data: view.data, body: body});
    }
    if (form.onSubmit) {
      result = await form.onSubmit({self, data, view, form, item, $event, result});
    }
    if (view.onSubmit) {
      result = await view.onSubmit({self, data, view, form, item, $event, result});
    }
    if (self.modal) {
      await self.modal.dismiss();
    }
    await data.showMessage({message: `${view.name}.submit.success`, value: result});
  } catch (error: any) {
    await data.showMessage({message: `${view.name}.submit.warning`, error});
    return false;
  }
};

/**
 * Submit form cancel event handler
 */
events['submit.form.onCancel'] = async ({self, data, view, form, item, $event, result}: any): Promise<any> => {
  try {
    data.showLoading({message: `${view.name}.cancel.loading`});

    if (form.onCancel) {
      result = await form.onCancel({self, data, view, form, item, $event, result});
    }
    if (view.onCancel) {
      result = await view.onCancel({self, data, view, form, item, $event, result});
    }
    if (self.modal) {
      await self.modal.dismiss();
    } else {
      await data.gotoBack();
    }
    await data.showMessage({message: `${view.name}.cancel.success`, value: result});
  } catch (error: any) {
    await data.showMessage({message: `${view.name}.cancel.warning`, error});
    return false;
  }
};

/***********************************************************************************************************************
 ***********************************************************************************************************************
 ***
 *** Global item events
 ***
 ***********************************************************************************************************************
 **********************************************************************************************************************/

/**
 * Global item setup event handler
 */
events['item.onSetup'] = async ({self, data, view, form, item, $event, result}: any): Promise<any> => {
  try {
    if (item.noDefaultEvent === undefined) {
      result = await _defaultItemSetup({self, data, view, form, item, $event, result});
    }
    if (item.onSetup) {
      result = await item.onSetup({self, data, view, form, item, $event, result});
    }
    if (form.onSetup) {
      result = await form.onSetup({self, data, view, form, item, $event, result});
    }
    if (view.onSetup) {
      result = await view.onSetup({self, data, view, form, item, $event, result});
    }
    if (item.noDefaultEvent === undefined) {
      result = await _defaultItemSetupEnd({self, data, view, form, item, $event, result});
    }
    return result;
  } catch (error: any) {
    console.error(`Attention, "${item.name}.${$event.type}": ${error}`);
    return false;
  }
};

/**
 * Global item click event handler
 */
events['item.onClick'] = async ({self, data, view, form, item, $event, result}: any): Promise<any> => {
  try {
    if (item.noDefaultEvent === undefined) {
      result = await _defaultItemEvent({self, data, view, form, item, $event, result});
    }
    if (item.onClick) {
      result = await item.onClick({self, data, view, form, item, $event, result});
    }
    if (form.onClick) {
      result = await form.onClick({self, data, view, form, item, $event, result});
    }
    if (view.onClick) {
      result = await view.onClick({self, data, view, form, item, $event, result});
    }
    if (item.noDefaultEvent === undefined) {
      result = await _defaultItemEventEnd({self, data, view, form, item, $event, result});
    }
    return result;
  } catch (error: any) {
    console.error(`Attention, "${item.name}.${$event.type}": ${error}`);
    return false;
  }
};

/**
 * Global item enter event handler
 */
events['item.onEnter'] = async ({self, data, view, form, item, $event, result}: any): Promise<any> => {
  try {
    if (item.noDefaultEvent === undefined) {
      result = await _defaultItemEvent({self, data, view, form, item, $event, result});
    }
    if (item.onEnter) {
      result = await item.onEnter({self, data, view, form, item, $event, result});
    }
    if (form.onEnter) {
      result = await form.onEnter({self, data, view, form, item, $event, result});
    }
    if (view.onEnter) {
      result = await view.onEnter({self, data, view, form, item, $event, result});
    }
    if (item.noDefaultEvent === undefined) {
      result = await _defaultItemEventEnd({self, data, view, form, item, $event, result});
    }
    return result;
  } catch (error: any) {
    console.error(`Attention, "${item.name}.${$event.type}": ${error}`);
    return false;
  }
};

/**
 * Global item leave event handler
 */
events['item.onLeave'] = async ({self, data, view, form, item, $event, result}: any): Promise<any> => {
  try {
    if (item.noDefaultEvent === undefined) {
      result = await _defaultItemEvent({self, data, view, form, item, $event, result});
    }
    if (item.onLeave) {
      result = await item.onLeave({self, data, view, form, item, $event, result});
    }
    if (form.onLeave) {
      result = await form.onLeave({self, data, view, form, item, $event, result});
    }
    if (view.onLeave) {
      result = await view.onLeave({self, data, view, form, item, $event, result});
    }
    if (item.noDefaultEvent === undefined) {
      result = await _defaultItemEventEnd({self, data, view, form, item, $event, result});
    }
    return result;
  } catch (error: any) {
    console.error(`Attention, "${item.name}.${$event.type}": ${error}`);
    return false;
  }
};

/**
 * Global item input event handler
 */
events['item.onInput'] = async ({self, data, view, form, item, $event, result}: any): Promise<any> => {
  try {
    if (item.noDefaultEvent === undefined) {
      result = await _defaultItemEvent({self, data, view, form, item, $event, result});
    }
    if (item.onInput) {
      result = await item.onInput({self, data, view, form, item, $event, result});
    }
    if (form.onInput) {
      result = await form.onInput({self, data, view, form, item, $event, result});
    }
    if (view.onInput) {
      result = await view.onInput({self, data, view, form, item, $event, result});
    }
    if (item.noDefaultEvent === undefined) {
      result = await _defaultItemEventEnd({self, data, view, form, item, $event, result});
    }
    return result;
  } catch (error: any) {
    console.error(`Attention, "${item.name}.${$event.type}": ${error}`);
    return false;
  }
};

/**
 * Global item change event handler
 */
events['item.onChange'] = async ({self, data, view, form, item, $event, result}: any): Promise<any> => {
  try {
    if (item.noDefaultEvent === undefined) {
      result = await _defaultItemEvent({self, data, view, form, item, $event, result});
    }
    if (item.onChange) {
      result = await item.onChange({self, data, view, form, item, $event, result});
    }
    if (form.onChange) {
      result = await form.onChange({self, data, view, form, item, $event, result});
    }
    if (view.onChange) {
      result = await view.onChange({self, data, view, form, item, $event, result});
    }
    if (item.noDefaultEvent === undefined) {
      result = await _defaultItemEventEnd({self, data, view, form, item, $event, result});
    }
    return result;
  } catch (error: any) {
    console.error(`Attention, "${item.name}.${$event.type}": ${error}`);
    return false;
  }
};

/**
 * Global item submit event handler
 */
events['item.onSubmit'] = async ({self, data, view, form, item, $event, result}: any): Promise<any> => {
  try {
    if (item.noDefaultEvent === undefined) {
      result = await _defaultItemEvent({self, data, view, form, item, $event, result});
    }
    if (item.onSubmit) {
      result = await item.onSubmit({self, data, view, form, item, $event, result});
    }
    if (form.onSubmit) {
      result = await form.onSubmit({self, data, view, form, item, $event, result});
    }
    if (view.onSubmit) {
      result = await view.onSubmit({self, data, view, form, item, $event, result});
    }
    if (item.noDefaultEvent === undefined) {
      result = await _defaultItemEventEnd({self, data, view, form, item, $event, result});
    }
    return result;
  } catch (error: any) {
    console.error(`Attention, "${item.name}.${$event.type}": ${error}`);
    return false;
  }
};

/**
 * Global item cancel event handler
 */
events['item.onCancel'] = async ({self, data, view, form, item, $event, result}: any): Promise<any> => {
  try {
    if (item.noDefaultEvent === undefined) {
      result = await _defaultItemEvent({self, data, view, form, item, $event, result});
    }
    if (item.onCancel) {
      result = await item.onCancel({self, data, view, form, item, $event, result});
    }
    if (form.onCancel) {
      result = await form.onCancel({self, data, view, form, item, $event, result});
    }
    if (view.onCancel) {
      result = await view.onCancel({self, data, view, form, item, $event, result});
    }
    if (item.noDefaultEvent === undefined) {
      result = await _defaultItemEventEnd({self, data, view, form, item, $event, result});
    }
    return result;
  } catch (error: any) {
    console.error(`Attention, "${item.name}.${$event.type}": ${error}`);
    return false;
  }
};

/***********************************************************************************************************************
 ***********************************************************************************************************************
 ***
 *** DEFAULT
 ***
 ***********************************************************************************************************************
 **********************************************************************************************************************/

/**
 * Default form setup
 */
async function _defaultFormSetup({self, data, view, form, item, $event, result}: any): Promise<any> {
  if (!view.slot) {
    view.slot = getSlot(form.fields);
  }
  if (!['search', 'select', 'create', 'update', 'delete', 'import', 'export'].includes(view.type)) {
    view.type = 'submit';
  }
}

/**
 * Default item setup
 */
async function _defaultItemSetup({self, data, view, form, item, $event, result}: any): Promise<any> {
  if (!item.$input) {
    // Types​
    // "text", "password", "email", "number", "search", "tel", and "url".

    // Modes
    // "none", "text", "tel", "url", "email", "numeric", "decimal", and "search".

    if (item.type && item.type.match(/\[\]$/)) {
      item.$input = {array: true};
      item.$input.onRead = {};
      item.$input.onEdit = {icon: 'add-circle'};
      item.$input.onDrop = {icon: 'close-circle'};

      item.items = item.items || [{...item, type: item.type.replace(/\[\]$/, ''), items: undefined, $input: undefined}];
      item.size = 100;
      item.slot = undefined;
      item.type = 'array';
    } else if (item.type === 'array') {
      item.$input = {array: true};
      item.$input.onRead = {};
      item.$input.onEdit = {icon: 'add-circle'};
      item.$input.onDrop = {icon: 'close-circle'};

      item.items = item.items || [];
      item.size = 100;
      item.slot = undefined;
    } else if (item.type === 'group') {
      item.$input = {group: true};
      item.$input.onRead = {};
      item.$input.onEdit = {icon: 'add-circle'};
      item.$input.onDrop = {icon: 'close-circle'};

      item.items = item.items || [];
      item.size = 100;
      item.slot = undefined;
    } else if (item.type === 'id') {
      item.$input = {input: true, type: 'text', mode: 'text'};
      item.$input.onRead = {};
      item.$input.onEdit = {};
      item.$input.onDrop = {icon: 'close-circle'};
      item.pattern = item.pattern || '';
    } else if (item.type === 'unix-time' || item.type === 'unixtime') {
      item.$input = {input: true, type: 'text', mode: 'text', locale: data.i18n.calendar, format: 'date-time'};
      item.$input.onRead = {icon: 'calendar', pick: 'datetime'};
      item.$input.onEdit = {icon: 'calendar', pick: 'datetime'};
      item.$input.onDrop = {icon: 'close-circle'};
      item.pattern = item.pattern || /^[0-9]+$/;
    } else if (item.type === 'date-time' || item.type === 'datetime') {
      item.$input = {input: true, type: 'text', mode: 'text', locale: data.i18n.calendar, format: 'date-time'};
      item.$input.onRead = {icon: 'calendar', pick: 'datetime'};
      item.$input.onEdit = {icon: 'calendar', pick: 'datetime'};
      item.$input.onDrop = {icon: 'close-circle'};
      item.pattern = item.pattern || /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(.*?)/;
    } else if (item.type === 'date') {
      item.$input = {input: true, type: 'text', mode: 'text', locale: data.i18n.calendar, format: 'date'};
      item.$input.onRead = {icon: 'calendar-number', pick: 'datetime'};
      item.$input.onEdit = {icon: 'calendar-number', pick: 'datetime'};
      item.$input.onDrop = {icon: 'close-circle'};
      item.pattern = item.pattern || /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;
    } else if (item.type === 'time') {
      item.$input = {input: true, type: 'text', mode: 'text', locale: data.i18n.calendar, format: 'time'};
      item.$input.onRead = {icon: 'time', pick: 'datetime'};
      item.$input.onEdit = {icon: 'time', pick: 'datetime'};
      item.$input.onDrop = {icon: 'close-circle'};
      item.pattern = item.pattern || /^[0-9]{2}:[0-9]{2}$/;
    } else if (item.type === 'year') {
      item.$input = {input: true, type: 'text', mode: 'text', locale: data.i18n.calendar, format: 'year'};
      item.$input.onRead = {icon: 'calendar-clear', pick: 'datetime'};
      item.$input.onEdit = {icon: 'calendar-clear', pick: 'datetime'};
      item.$input.onDrop = {icon: 'close-circle'};
      item.pattern = item.pattern || /^[0-9]{4}$/;
    } else if (item.type === 'year-month') {
      item.$input = {input: true, type: 'text', mode: 'text', locale: data.i18n.calendar, format: 'year-month'};
      item.$input.onRead = {icon: 'calendar-clear', pick: 'datetime'};
      item.$input.onEdit = {icon: 'calendar-clear', pick: 'datetime'};
      item.$input.onDrop = {icon: 'close-circle'};
      item.pattern = item.pattern || /^[0-9]{4}-[0-9]{2}$/;
    } else if (item.type === 'month-year') {
      item.$input = {input: true, type: 'text', mode: 'text', locale: data.i18n.calendar, format: 'month-year'};
      item.$input.onRead = {icon: 'calendar-clear', pick: 'datetime'};
      item.$input.onEdit = {icon: 'calendar-clear', pick: 'datetime'};
      item.$input.onDrop = {icon: 'close-circle'};
      item.pattern = item.pattern || /^[0-9]{2}-[0-9]{4}$/;
    } else if (item.type === 'decimal') {
      item.$input = {input: true, type: 'text', mode: 'decimal'};
      item.$input.onRead = {};
      item.$input.onEdit = {};
      item.$input.onDrop = {icon: 'close-circle'};
      item.pattern = item.pattern || /^-?[0-9]{1,20}(.[0-9]{1,20})?$/;
    } else if (item.type === 'integer') {
      item.$input = {input: true, type: 'text', mode: 'numeric'};
      item.$input.onRead = {};
      item.$input.onEdit = {};
      item.$input.onDrop = {icon: 'close-circle'};
      item.pattern = item.pattern || /^-?[0-9]{1,20}$/;
    } else if (item.type === 'percent') {
      item.$input = {input: true, type: 'text', mode: 'decimal'};
      item.$input.onRead = {};
      item.$input.onEdit = {};
      item.$input.onDrop = {icon: 'close-circle'};
      item.pattern = item.pattern || /^-?[0-9]{1,20}(.[0-9]{1,20})?$/;
    } else if (item.type === 'currency') {
      item.$input = {input: true, type: 'text', mode: 'decimal'};
      item.$input.onRead = {};
      item.$input.onEdit = {};
      item.$input.onDrop = {icon: 'close-circle'};
      item.pattern = item.pattern || /^-?[0-9]{1,20}(.[0-9]{1,20})?$/;
    } else if (item.type === 'select') {
      item.$input = {input: true, type: 'text', mode: 'text'};
      item.$input.onRead = {icon: 'search-circle', pick: 'select'};
      item.$input.onEdit = {icon: 'search-circle', pick: 'select'};
      item.$input.onDrop = {icon: 'close-circle'};
    } else if (item.type === 'toggle') {
      item.$input = {input: true, type: 'text', mode: 'text'};
      item.$input.onRead = {};
      item.$input.onEdit = {};
      item.$input.onDrop = {};
      item.pattern = item.pattern || /^(true|false)$/;
    } else if (item.type === 'checkbox') {
      item.$input = {input: true, type: 'text', mode: 'text'};
      item.$input.onRead = {};
      item.$input.onEdit = {};
      item.$input.onDrop = {};
      item.pattern = item.pattern || /^(true|false)$/;
    } else if (item.type === 'text') {
      item.$input = {input: true, type: 'text', mode: 'text'};
      item.$input.onRead = {};
      item.$input.onEdit = {};
      item.$input.onDrop = {icon: 'close-circle'};
    } else if (item.type === 'textarea') {
      item.$input = {input: true, type: 'textarea', mode: 'text'};
      item.$input.onRead = {};
      item.$input.onEdit = {};
      item.$input.onDrop = {};
    } else if (item.type === 'richtext') {
      item.$input = {input: true, type: 'richtext', mode: 'text'};
      item.$input.onRead = {};
      item.$input.onEdit = {};
      item.$input.onDrop = {};
    } else if (item.type === 'attachment') {
      item.$input = {input: true, type: 'url', mode: 'url', accept: '*/*'};
      item.$input.onRead = {icon: 'document-attach', pick: 'link'};
      item.$input.onEdit = {icon: 'document-attach', pick: 'file'};
      item.$input.onDrop = {icon: 'close-circle'};
      item.pattern = item.pattern || /^[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
    } else if (item.type === 'image') {
      item.$input = {input: true, type: 'url', mode: 'url', accept: 'image/*'};
      item.$input.onRead = {icon: 'image', pick: 'link'};
      item.$input.onEdit = {icon: 'image', pick: 'file'};
      item.$input.onDrop = {icon: 'close-circle'};
      item.pattern = item.pattern || /^[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
    } else if (item.type === 'video') {
      item.$input = {input: true, type: 'url', mode: 'url', accept: 'video/*'};
      item.$input.onRead = {icon: 'videocam', pick: 'link'};
      item.$input.onEdit = {icon: 'videocam', pick: 'file'};
      item.$input.onDrop = {icon: 'close-circle'};
      item.pattern = item.pattern || /^[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
    } else if (item.type === 'audio') {
      item.$input = {input: true, type: 'url', mode: 'url', accept: 'audio/*'};
      item.$input.onRead = {icon: 'recording', pick: 'link'};
      item.$input.onEdit = {icon: 'recording', pick: 'file'};
      item.$input.onDrop = {icon: 'close-circle'};
      item.pattern = item.pattern || /^[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
    } else if (item.type === 'url') {
      item.$input = {input: true, type: 'url', mode: 'url'};
      item.$input.onRead = {icon: 'link', pick: 'link'};
      item.$input.onEdit = {};
      item.$input.onDrop = {icon: 'close-circle'};
      item.pattern = item.pattern || /^[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
    } else if (item.type === 'phone') {
      item.$input = {input: true, type: 'tel', mode: 'tel'};
      item.$input.onRead = {icon: 'call', pick: 'link'};
      item.$input.onEdit = {};
      item.$input.onDrop = {icon: 'close-circle'};
      item.pattern = item.pattern || /^[0-9]{8,12}$/;
    } else if (item.type === 'email') {
      item.$input = {input: true, type: 'email', mode: 'email'};
      item.$input.onRead = {icon: 'mail', pick: 'link'};
      item.$input.onEdit = {};
      item.$input.onDrop = {icon: 'close-circle'};
      item.pattern = item.pattern || /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    } else if (item.type === 'color') {
      item.$input = {input: true, type: 'text', mode: 'text'};
      item.$input.onRead = {icon: 'color-fill', pick: 'color'};
      item.$input.onEdit = {icon: 'color-fill', pick: 'color'};
      item.$input.onDrop = {icon: 'close-circle'};
      item.pattern = item.pattern || /^#(?:[0-9a-f]{3}){1,2}$/;
    } else if (item.type === 'location') {
      item.$input = {input: true, type: 'text', mode: 'text'};
      item.$input.onRead = {icon: 'navigate-circle', pick: 'location'};
      item.$input.onEdit = {icon: 'navigate-circle', pick: 'location'};
      item.$input.onDrop = {icon: 'close-circle'};
    } else if (item.type === 'username') {
      item.$input = {input: true, type: 'text', mode: 'text', icon: 'person-circle'};
      item.$input.onRead = {};
      item.$input.onEdit = {};
      item.$input.onDrop = {};
    } else if (item.type === 'password') {
      item.$input = {input: true, type: 'password', mode: 'text', icon: 'eye', toggleType: ['password', 'text'], toggleIcon: ['eye', 'eye-off']};
      item.$input.onRead = {};
      item.$input.onEdit = {};
      item.$input.onDrop = {};
    } else if (item.type === 'header') {
      item.$input = {field: true};
    } else if (item.type === 'footer') {
      item.$input = {field: true};
    } else if (item.type === 'legend') {
      item.$input = {field: true};
    } else if (item.type === 'search') {
      item.$input = {field: true};
    } else if (item.type === 'metric') {
      item.$input = {field: true};
    } else if (item.type === 'expand') {
      item.$input = {field: true};
    } else if (item.type === 'values') {
      item.$input = {field: true};
      item.isButton = true;
    } else if (item.type === 'button') {
      item.$input = {field: true};
      item.isButton = true;
    } else if (item.type === 'submit') {
      item.$input = {field: true};
      item.isButton = true;
    } else if (item.type === 'cancel') {
      item.$input = {field: true};
      item.isButton = true;
    }

    item.$input = item.$input || {input: true};
    item.type = item.type || 'text';
    item.size = item.size || 100;
    item.slot = item.slot || undefined;

    item.getValue = async (): Promise<any> => {
      return await getItemValue({self, data, view, form, item, $event, result});
    };

    item.setValue = async (value: any = undefined, error: any = undefined): Promise<any> => {
      return await setItemValue({self, data, view, form, item, $event, result}, value, error);
    };

    item.getInput = async (): Promise<any> => {
      return await getItemInput({self, data, view, form, item, $event, result});
    };

    item.setInput = async (value: any = undefined, error: any = undefined): Promise<any> => {
      return await setItemInput({self, data, view, form, item, $event, result}, value, error);
    };

    if (item.type === 'expand') {
      item.size = undefined;
      item.text = undefined;
      item.icon = undefined;
    }

    if (item.type === 'submit') {
      item._i18n = `${item.root?._i18n || view.name + '.' + view.type}.${item.name}`;
      item.onClick = async ({self}: any): Promise<any> => {
        return await self.trigger('form.onSubmit');
      };
    }

    if (item.type === 'cancel') {
      item._i18n = `${item.root?._i18n || view.name + '.' + view.type}.${item.name}`;
      item.onClick = async ({self}: any): Promise<any> => {
        return await self.trigger('form.onCancel');
      };
    }

    if (item._type === 'navbar') {
      if (item.type === 'button') {
        item.icon = item.icon || 'search';
        item.iconOnly = true;
      } else if (item.type === 'submit') {
        item.icon = item.icon || 'checkmark-circle';
        item.iconOnly = true;
      } else if (item.type === 'cancel') {
        item.icon = item.icon || 'chevron-back-circle';
        item.iconOnly = true;
      }
    }

    if (item._type === 'fields') {
      if (item.root?.readonly) {
        item.readonly = true;
      } else if (view.type === 'select') {
        item.readonly = true;
      } else if (view.type === 'delete') {
        item.readonly = true;
        item.hide = !['title', 'label'].includes(item.slot);
      }
    }

    if (item.onClick || item.$input.onRead?.pick || item.$input.onEdit?.pick || item.$input.onDrop?.pick) {
      item.isButton = item.isButton ? true : false;
      item.isButtonIcon = item.isButton ? false : true;
      item.isCustom = item.onClick ? true : false;
    } else {
      item.isButton = undefined;
      item.isButtonIcon = undefined;
      item.isCustom = undefined;
    }

    if (item.isButton) {
      item.readonly = true;
    }

    if (item.iconOnly) {
      item.size = undefined;
      item.text = undefined;
      item.icon = item.icon || 'search';
    }
  }
}

/**
 * Default item setup end
 */
async function _defaultItemSetupEnd({self, data, view, form, item, $event, result}: any): Promise<any> {
  if (!item.isButton && !item.isCustom) {
    if (item.readonly) {
      item.icon = (typeof item.value === 'undefined' ? item.$input.onNone?.icon : item.$input.onRead?.icon) || undefined;
    } else {
      item.icon = (typeof item.value === 'undefined' ? item.$input.onEdit?.icon : item.$input.onDrop?.icon) || undefined;
    }
    item.pick = undefined;
    item.pickEvent = undefined;
    item.isButtonIcon = item.icon ? true : false;

    if (item.type === 'color') {
      item.iconColor = typeof item.value === 'undefined' ? undefined : 'default';
      item.iconStyle = typeof item.value === 'undefined' ? undefined : {'--ion-color-base': `${item.value}`};
    }
    if (item.type === 'metric' && !item.items && view.rest) {
      item.items = await data.http.request({search: view.rest.replace(/\/:[A-Za-z_-]+/g, ''), data: view.data, qs: {facet: item.name}}).catch(() => true);
    }
    if (item.type === 'select' && !item.items && view.rest) {
      item.items = await data.http.request({search: view.rest.replace(/\/:[A-Za-z_-]+/g, ''), data: view.data, qs: {facet: item.name}}).catch(() => true);
    }
    if (item.type === 'textarea' || item.type === 'richtext') {
      _defaultTextareaSetup({self, data, view, form, item, $event, result});
    }
  }

  if (typeof result === 'boolean' && !result) {
    item.hide = true;
  }
  if (item.hide) {
    item.style = {...(item.style || {})};
    item.style.display = 'none';
  }
  if (item.size) {
    item.style = {...(item.style || {})};
    item.style.width = `${item.size}%`;
  }

  // Format item
  Object.keys(item).forEach((k: any) => (typeof item[k] === 'undefined' ? delete item[k] : {}));
}

/**
 * Default item event
 */
async function _defaultItemEvent({self, data, view, form, item, $event, result}: any): Promise<any> {
  if ($event.type === 'item.onClick') {
    if (typeof item.disabled === 'undefined') {
      item.disabled = true;
    }

    if (!item.isButton && !item.isCustom) {
      if (item.$input.toggleMode) {
        item.$input.mode = item.$input.mode === item.$input.toggleMode[0] ? item.$input.toggleMode[1] : item.$input.toggleMode[0];
      }
      if (item.$input.toggleType) {
        item.$input.type = item.$input.type === item.$input.toggleType[0] ? item.$input.toggleType[1] : item.$input.toggleType[0];
      }
      if (item.$input.toggleIcon) {
        item.$input.icon = item.$input.icon === item.$input.toggleIcon[0] ? item.$input.toggleIcon[1] : item.$input.toggleIcon[0];
      }

      if (item.$input.onDrop && typeof item.value !== 'undefined' && !item.readonly) {
        await item.setValue(undefined);
        return;
      }

      if (item.readonly) {
        item.icon = (typeof item.value === 'undefined' ? item.$input.onNone?.icon : item.$input.onRead?.icon) || undefined;
        item.pick = (typeof item.value === 'undefined' ? item.$input.onNone?.pick : item.$input.onRead?.pick) || undefined;
      } else {
        item.icon = (typeof item.value === 'undefined' ? item.$input.onEdit?.icon : item.$input.onDrop?.icon) || undefined;
        item.pick = (typeof item.value === 'undefined' ? item.$input.onEdit?.pick : item.$input.onDrop?.pick) || undefined;
      }

      if (item.pick) {
        item.pickEvent = $event.detail.$event;
        if (item.pick === 'location') {
          await _defaulLocationPicker({self, data, view, form, item, $event, result});
        } else if (item.pick === 'color') {
          await _defaultColorPicker({self, data, view, form, item, $event, result});
        } else if (item.pick === 'file') {
          await _defaultFilePicker({self, data, view, form, item, $event, result});
        } else if (item.pick === 'link') {
          await _defaultLinkPicker({self, data, view, form, item, $event, result});
        }
      }
    }
  } else if ($event.type === 'item.onEnter') {
  } else if ($event.type === 'item.onLeave') {
  } else if ($event.type === 'item.onInput') {
    await item.setInput($event.detail.$event.target.value);
  } else if ($event.type === 'item.onChange') {
    await item.setValue($event.detail.$event.target.value);
  } else if ($event.type === 'item.onSubmit') {
    console.log(`${item.name} ${$event.type}`);
  } else if ($event.type === 'item.onCancel') {
    console.log(`${item.name} ${$event.type}`);
  }
  return result;
}

/**
 * Default item event end
 */
async function _defaultItemEventEnd({self, data, view, form, item, $event, result}: any): Promise<any> {
  if ($event.type === 'item.onClick') {
    if (typeof item.disabled !== 'undefined') {
      delete item.disabled;
    }
  } else if ($event.type === 'item.onEnter') {
  } else if ($event.type === 'item.onLeave') {
  } else if ($event.type === 'item.onInput') {
  } else if ($event.type === 'item.onChange') {
  } else if ($event.type === 'item.onSubmit') {
  } else if ($event.type === 'item.onCancel') {
  }
  return result;
}

/**
 * Default values click
 */
async function _defaultValuesClick({self, data, view, form, item, $event, result}: any): Promise<any> {
  try {
    if (item.value) {
      result = item.value;
    }
    if (item.onSelectValues) {
      result = await item.onSelectValues({self, data, view, form, item, $event, result});
    }
    if (form.onSelectValues) {
      result = await form.onSelectValues({self, data, view, form, item, $event, result});
    }
    if (view.onSelectValues) {
      result = await view.onSelectValues({self, data, view, form, item, $event, result});
    }
    if (await data.auth(`${view.name}/select/:index`)) {
      result = await data.goto(`${view.name}/select/:index`, {index: result?.index});
    } else {
      view.type = 'submit';
      view.rest = '';
      view.data.setResult = result || item.value;
      view.data.value = item.value;
      await self.ngOnInit();
    }
    return result;
  } catch (error: any) {
    return false;
  }
}

/**
 * Default filter setup
 */
async function _defaultFilterSetup({form, item}: any): Promise<any> {
  try {
    if (!form.filter.length) {
      return false;
    }
    form.filterStyle = {...(form.filterStyle || {})};
    form.filterStyle.display = form.filterStyle.display || 'none';
    item.icon = 'filter-circle';
    item.iconColor = form.filterStyle.display === 'none' ? 'medium' : 'dark';
    return true;
  } catch (error: any) {
    return false;
  }
}

/**
 * Default filter click
 */
async function _defaultFilterClick({form, item}: any): Promise<any> {
  try {
    form.filterStyle = {...(form.filterStyle || {})};
    form.filterStyle.display = form.filterStyle.display === 'none' ? 'inherit' : 'none';
    item.iconColor = form.filterStyle.display === 'none' ? 'medium' : 'dark';
    return true;
  } catch (error: any) {
    return false;
  }
}

/**
 * Default metric setup
 */
async function _defaultMetricSetup({form, item}: any): Promise<any> {
  try {
    if (!form.metric.length) {
      return false;
    }
    form.metricStyle = {...(form.metricStyle || {})};
    form.metricStyle.display = form.metricStyle.display || 'none';
    item.icon = 'stop-circle';
    item.iconColor = form.metricStyle.display === 'none' ? 'medium' : 'dark';
    return true;
  } catch (error: any) {
    return false;
  }
}

/**
 * Default metric click
 */
async function _defaultMetricClick({form, item}: any): Promise<any> {
  try {
    form.metricStyle = {...(form.metricStyle || {})};
    form.metricStyle.display = form.metricStyle.display === 'none' ? 'inherit' : 'none';
    item.iconColor = form.metricStyle.display === 'none' ? 'medium' : 'dark';
    return true;
  } catch (error: any) {
    return false;
  }
}

/**
 * Default create setup
 */
async function _defaultCreateSetup({data, view, item}: any): Promise<any> {
  try {
    if (!(await data.auth(`${view.name}/create`))) {
      return false;
    }
    item.icon = 'add-circle';
    return true;
  } catch (error: any) {
    return false;
  }
}

/**
 * Default create click
 */
async function _defaultCreateClick({data, view}: any): Promise<any> {
  try {
    return await data.goto(`${view.name}/create`);
  } catch (error: any) {
    return false;
  }
}

/**
 * Default update setup
 */
async function _defaultUpdateSetup({data, view, item}: any): Promise<any> {
  try {
    if (!(await data.auth(`${view.name}/update/:index`))) {
      return false;
    }
    item.icon = 'create';
    return true;
  } catch (error: any) {
    return false;
  }
}

/**
 * Default update click
 */
async function _defaultUpdateClick({data, view}: any): Promise<any> {
  try {
    return await data.goto(`${view.name}/update/:index`, {index: view.data.index});
  } catch (error: any) {
    return false;
  }
}

/**
 * Default delete setup
 */
async function _defaultDeleteSetup({data, view, item}: any): Promise<any> {
  try {
    if (!(await data.auth(`${view.name}/delete/:index`))) {
      return false;
    }
    item.icon = 'trash';
    return true;
  } catch (error: any) {
    return false;
  }
}

/**
 * Default delete click
 */
async function _defaultDeleteClick({data, view}: any): Promise<any> {
  try {
    return await data.goto(`${view.name}/delete/:index`, {index: view.data.index});
  } catch (error: any) {
    return false;
  }
}

/**
 * Default export setup
 */
async function _defaultExportSetup({data, view, item}: any): Promise<any> {
  try {
    if (!(await data.auth(`${view.name}/export`))) {
      return false;
    }
    item.icon = 'cloud-download';
    return true;
  } catch (error: any) {
    return false;
  }
}

/**
 * Default export click
 */
async function _defaultExportClick({data, view}: any): Promise<any> {
  try {
    return await data.goto(`${view.name}/export`);
  } catch (error: any) {
    return false;
  }
}

/**
 * Default import setup
 */
async function _defaultImportSetup({data, view, item}: any): Promise<any> {
  try {
    if (!(await data.auth(`${view.name}/import`))) {
      return false;
    }
    item.icon = 'cloud-upload';
    return true;
  } catch (error: any) {
    return false;
  }
}

/**
 * Default import click
 */
async function _defaultImportClick({data, view}: any): Promise<any> {
  try {
    return await data.goto(`${view.name}/import`);
  } catch (error: any) {
    return false;
  }
}

/**
 * Default download setup
 */
async function _defaultDownloadSetup({data, view, item}: any): Promise<any> {
  try {
    if (!(await data.auth(`${view.name}/select/:index`))) {
      return false;
    }
    item.icon = 'cloud-download';
    return true;
  } catch (error: any) {
    return false;
  }
}

/**
 * Default download click
 */
async function _defaultDownloadClick({self, data, view, form, item, $event, result}: any): Promise<any> {
  try {
    data.showLoading({message: `${view.name}.download.loading`});
    if (view.rest) {
      result = await data.http.request({select: view.rest, data: view.data, type: 'blob', qs: {event: 'download'}});
    }
    if (form.onDownload) {
      result = await form.onPrint({self, data, view, form, item, $event, result});
    }
    if (view.onDownload) {
      result = await view.onPrint({self, data, view, form, item, $event, result});
    }
    await data.showContentDownload({value: result});
    await data.showMessage({message: `${view.name}.download.success`, value: result});
  } catch (error: any) {
    await data.showMessage({message: `${view.name}.download.warning`, error});
    return false;
  }
}

/**
 * Default print setup
 */
async function _defaultPrintSetup({data, view, item}: any): Promise<any> {
  try {
    if (!(await data.auth(`${view.name}/select/:index`))) {
      return false;
    }
    item.icon = 'print';
    return true;
  } catch (error: any) {
    return false;
  }
}

/**
 * Default print click
 */
async function _defaultPrintClick({self, data, view, form, item, $event, result}: any): Promise<any> {
  try {
    data.showLoading({message: `${view.name}.print.loading`});
    if (view.rest) {
      result = await data.http.request({select: view.rest, data: view.data, type: 'blob', qs: {event: 'print'}});
    }
    if (form.onPrint) {
      result = await form.onPrint({self, data, view, form, item, $event, result});
    }
    if (view.onPrint) {
      result = await view.onPrint({self, data, view, form, item, $event, result});
    }
    await data.showContentPrint({value: result});
    await data.showMessage({message: `${view.name}.print.success`, value: result});
  } catch (error: any) {
    await data.showMessage({message: `${view.name}.print.warning`, error});
    return false;
  }
}

/**
 * Default share setup
 */
async function _defaultShareSetup({data, view, item}: any): Promise<any> {
  try {
    if (!(await data.auth(`${view.name}/select/:index`))) {
      return false;
    }
    item.icon = 'share-social';
    return true;
  } catch (error: any) {
    return false;
  }
}

/**
 * Default share click
 */
async function _defaultShareClick({self, data, view, form, item, $event, result}: any): Promise<any> {
  try {
    data.showLoading({message: `${view.name}.share.loading`});
    if (view.rest) {
      result = await data.http.request({select: view.rest, data: view.data, type: 'blob', qs: {event: 'share'}});
    }
    if (form.onShare) {
      result = await form.onShare({self, data, view, form, item, $event, result});
    }
    if (view.onShare) {
      result = await view.onShare({self, data, view, form, item, $event, result});
    }
    await data.showContentShare({value: result});
    await data.showMessage({message: `${view.name}.share.success`, value: result});
  } catch (error: any) {
    await data.showMessage({message: `${view.name}.share.warning`, error});
    return false;
  }
}

/**
 * Default sendmail setup
 */
async function _defaultSendmailSetup({data, view, item}: any): Promise<any> {
  try {
    if (!(await data.auth(`${view.name}/select/:index`))) {
      return false;
    }
    item.icon = 'mail';
    return true;
  } catch (error: any) {
    return false;
  }
}

/**
 * Default sendmail click
 */
async function _defaultSendmailClick({self, data, view, form, item, $event, result}: any): Promise<any> {
  try {
    const params: any = await data.showConfirmDialog({
      header: data.formatI18n('user.email.title'),
      inputs: [{name: 'email', type: 'email', placeholder: data.formatI18n('user.email.label'), value: data.user?.email}]
    });
    if (!params?.email) {
      return false;
    }
    data.showLoading({message: `${view.name}.sendmail.loading`});
    if (view.rest) {
      result = await data.http.request({select: view.rest, data: view.data, type: 'blob', qs: {event: 'sendmail', ...params}});
    }
    if (form.onSendmail) {
      result = await form.onSendmail({self, data, view, form, item, $event, result});
    }
    if (view.onSendmail) {
      result = await view.onSendmail({self, data, view, form, item, $event, result});
    }
    await data.showContentSendmail({value: result});
    await data.showMessage({message: `${view.name}.sendmail.success`, value: result});
  } catch (error: any) {
    await data.showMessage({message: `${view.name}.sendmail.warning`, error});
    return false;
  }
}

/***********************************************************************************************************************
 ***********************************************************************************************************************
 ***
 *** SUPPORT FUNCTIONS
 ***
 ***********************************************************************************************************************
 **********************************************************************************************************************/

/**
 * Default textarea setup
 */
async function _defaultTextareaSetup({item}: any): Promise<any> {
  try {
    item._richtext = [];
    item._richtextInput = ($event: any) => {
      item._richtext = [];
      const ws: any = window.getSelection();
      for (let i = 0; i < ws.rangeCount; i++) {
        let $s: any = ws.getRangeAt(i).startContainer;
        let $c = 0;
        while ($s?.parentNode && !$event.currentTarget.isEqualNode($s.parentNode) && $c < 100) {
          if (['B', 'I', 'U', 'STRIKE'].includes($s.parentNode.nodeName)) {
            item._richtext.push($s.parentNode.nodeName.substring(0, 1).toLowerCase());
          }
          $s = $s.parentNode;
          $c++;
        }
      }
    };
    item._richtextSet = (use: any, cmd: any) => {
      const i = item._richtext.indexOf(use);
      if (i === -1) {
        item._richtext.push(use);
      } else {
        item._richtext.splice(i, 1);
      }
      document.execCommand(cmd);
    };
  } catch (error: any) {
    console.error(`${error}`);
  }
}

/**
 * Default color picker
 */
async function _defaultColorPicker({item, $event}: any): Promise<any> {
  try {
    const $el: any = document.createElement('input');
    $el.type = 'color';
    $el.onchange = () => {
      const value = $el.value ? $el.value : undefined;
      item.setValue(value);
    };
    $event.detail.$event.target.parentNode.appendChild($el);
    setTimeout(() => $el.click(), 100);
  } catch (error: any) {
    console.error(`${error}`);
  }
}

/**
 * Default file picker
 */
async function _defaultFilePicker({item, $event}: any): Promise<any> {
  try {
    const $el: any = document.createElement('input');
    $el.type = 'file';
    $el.accept = item.$input.accept || '*/*';
    $el.capture = item.$input.capture || 'environment';
    $el.onchange = () => {
      const value = $el.files ? $el.files[0] : undefined;
      item.setValue(value);
    };
    $event.detail.$event.target.parentNode.appendChild($el);
    setTimeout(() => $el.click(), 100);
  } catch (error: any) {
    console.error(`${error}`);
  }
}

/**
 * Default link picker
 */
async function _defaultLinkPicker({item}: any): Promise<any> {
  try {
    if (item.$input.type === 'url') {
      window.open(`${item.value}`, '_system');
    } else if (item.$input.type === 'tel') {
      window.open(`https://wa.me/${item.value}`, '_system');
    } else if (item.$input.type === 'email') {
      window.open(`mailto://${item.value}`, '_system');
    } else if (item.$input.type === 'location') {
      window.open(`mailto://${item.value}`, '_system');
    }
  } catch (error: any) {
    console.error(`${error}`);
  }
}

/**
 * Default location picker
 */
async function _defaulLocationPicker({item}: any): Promise<any> {
  try {
    const google: any = await loadGoogleMaps();

    let $div: any;
    for (let i = 0; i < 100 && !$div; i++) {
      $div = document.querySelector(`.flb-item-map-${item.name}`);
      await new Promise((f: any) => setTimeout(f, 100));
    }

    item.$map = new google.maps.Map($div, {fullscreenControl: false, mapTypeControl: false, scaleControl: false, streetViewControl: false, rotateControl: false, zoomControl: false, zoom: 14});
    item.$marker = new google.maps.Marker({map: item.$map, draggable: !item.readonly});

    if (!item.readonly) {
      google.maps.event.addListener(item.$marker, 'dragend', (v: any) => {
        console.log({lat: v.latLng.lat(), lng: v.latLng.lng()});
        //this.geocodeLatLng({lat: result.latLng.lat(), lng: result.latLng.lng()});
      });
    }

    let data: any;
    if (item.value?.position) {
      data = {lat: item.value.position[0], lng: item.value.position[1]};
    } else if (item.value?.street) {
      data = await loadCurrentPosition();
      //this.geocodeString(this.value);
    } else {
      data = await loadCurrentPosition();
    }
    if (data) {
      item.$map.setCenter(data);
      item.$marker.setPosition(data);
    }
  } catch (error: any) {
    console.error(`${error}`);
  }
}

/**
 * Google Maps object declaration
 */
declare const google: any;

/**
 * Google Maps library
 */
function loadGoogleMaps(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (typeof google === 'object') {
      return resolve(google);
    }
    const element = document.createElement('script');
    element.src = 'https://maps.googleapis.com/maps/api/js?key=' + 'AIzaSyAHirNhGiN8ueynTCX-ki2RAI1wSRZM5no' + '&libraries=places';
    element.type = 'text/javascript';
    element.addEventListener('load', () => resolve(google));
    element.addEventListener('error', () => reject());
    document.body.append(element);
  });
}

/**
 * Geocode object
 */
function geocodeLatLng(params: any): Promise<any> {
  return new Promise(async (resolve, reject) => {
    const google: any = await loadGoogleMaps();
    const geocoder: any = new google.maps.Geocoder();
    geocoder.geocode({location: params.object}, (value: any, status: any) => {
      if (status === 'OK' && value && value[0]) {
        //formatAddress({...value[0], keep_street: false});
        resolve({...value[0], keep_street: false});
      } else {
        reject();
      }
    });
  });
}

/**
 * Geocode string
 */
function geocodeString(params: any): Promise<any> {
  return new Promise(async (resolve, reject) => {
    //const filter: any = {
    //  address: [formatI18n(params.street).replace(/^(.*? [0-9]+) .*?$/, '$1'), formatI18n(params.city), formatI18n(params.state), formatI18n(params.country)]
    //    .filter((v) => !!v)
    //    .join(', ')
    //    .trim()
    //};
    const google: any = await loadGoogleMaps();
    const geocoder: any = new google.maps.Geocoder();
    geocoder.geocode({address: params.string}, (value: any, status: any) => {
      if (status === 'OK' && value && value[0]) {
        //formatAddress({...value[0], keep_street: true});
        resolve({...value[0], keep_street: true});
      } else {
        reject();
      }
    });
  });
}

/**
 * Load current position
 */
function loadCurrentPosition(): Promise<any> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((value: any) => {
      if (value && value.coords) {
        //this.geocodeLatLng({lat: value.coords.latitude, lng: value.coords.longitude});
        resolve({lat: value.coords.latitude, lng: value.coords.longitude});
      } else {
        reject();
      }
    });
  });
}

/***********************************************************************************************************************
 ***********************************************************************************************************************
 ***
 *** SUPPORT FUNCTIONS
 ***
 ***********************************************************************************************************************
 **********************************************************************************************************************/

/**
 * Get form value
 */
function getFormValue({form}: any): any {
  const result: any = {};
  for (const f of form.fields) {
    result[f.name] = f.value;
  }
  return result;
}

/**
 * Get item input
 */
async function getItemInput({item}: any): Promise<any> {
  let result: any;
  if (!item.$input) {
  } else if (item.$input.array) {
    //result = item.value ? item.value.map((v: any) => v.value.getItemValue()) : undefined;
  } else if (item.$input.group) {
    //result = item.value ? item.value.getItemValue() : undefined;
  } else if (item.$input.input) {
    result = item.value || undefined;
  } else if (item.$input.field) {
    result = item.value || undefined;
  }
  return result;
}

/**
 * Get item value
 */
async function getItemValue({item}: any): Promise<any> {
  let result: any;
  if (!item.$input) {
  } else if (item.$input.array) {
    //result = item.value ? item.value.map((v: any) => v.value.getItemValue()) : undefined;
  } else if (item.$input.group) {
    //result = item.value ? item.value.getItemValue() : undefined;
  } else if (item.$input.input) {
    result = item.value || undefined;
  } else if (item.$input.field) {
    result = item.value || undefined;
  }
  return result;
}

/**
 * Set form value
 */
function setFormValue({form}: any, value: any = undefined, error: any = undefined): any {
  const result: any = {};
  for (const f of form.fields) {
    result[f.name] = f.value;
  }
  return result;
}

/**
 * Set item input
 */
async function setItemInput({self, item}: any, value: any = undefined, error: any = undefined): Promise<any> {
  //if (typeof $event.detail.$event.target.checked !== 'undefined') {
  //  await item.setValue($event.detail.$event.target.checked ? true : false);
  //} else {
  //  await item.setValue($event.detail.$event.target.value);
  //}

  // case 'unixtime': {
  // this.mask = 'DD/MM/YYYY HH:mm:ss';
  // case 'datetime': {
  // this.mask = 'DD/MM/YYYY HH:mm:ss';
  // case 'date': {
  // this.mask = 'DD/MM/YYYY';
  // case 'time': {
  // this.mask = 'HH:mm:ss';
  // case 'year': {
  // this.mask = 'YYYY';
  // case 'year-month': {
  // this.mask = 'MM/YYYY';

  //if (item.$input.mask) {
  //  // D: Day
  //  // M: Month
  //  // Y: Year
  //  // H: Hour
  //  // m: Minute
  //  // s: Second
  //
  //  // DD/MM/YYYY HH:mm:ss -> YYYY-MM-DDTHH:mm:ssTZD'
  //  // DD/MM/YYYY -> YYYY-MM-DD
  //  // HH:mm
  //  // YYYY
  //  // MM/YYYY -> YYYY-MM
  //  // 00.000.000~
  //
  //  let mask: any = item.$input.mask;
  //  mask = mask.replace(/TZD$/g, '');
  //  mask = mask.replace(/D/g, '0');
  //  mask = mask.replace(/M/g, '0');
  //  mask = mask.replace(/Y/g, '0');
  //  mask = mask.replace(/H/g, '0');
  //  mask = mask.replace(/m/g, '0');
  //  mask = mask.replace(/s/g, '0');
  //
  //  let text: any = $event.target.value || '';
  //  text = text.replace(/[ : ;  . , - _ @ \ / ]/g, '');
  //
  //  let list: any = [];
  //  for (let i = 0; i < text.length; i++) {
  //    if (list.length < mask.length && !['0', '~'].includes(mask[list.length])) {
  //      list.push(mask[list.length]);
  //    }
  //    if (list.length < mask.length) {
  //      list.push(text[i]);
  //    }
  //  }
  //  $event.target.value = list.join('');
  //}

  return await setItemValue({self, item}, value, error);
}

/**
 * Set item value
 */
async function setItemValue({self, item}: any, value: any = undefined, error: any = undefined): Promise<any> {
  //try {
  //  this.showLoading({message: `${$form.view.name}.upload.loading`});
  //  const result: any = await this.http.request({
  //    url: `${this._config.http.url}`,
  //    uri: `${this._config.http.uri}${this._config.http.api}/upload`,
  //    method: 'POST',
  //    form: $form.getItemValue()
  //  });
  //  this.showMessage({message: `${$form.view.name}.upload.success`, value: result});
  //} catch (error: any) {
  //  this.showMessage({message: `${$form.view.name}.upload.warning`, error});
  //}

  //case 'unixtime': {
  //item.value = value; ? new Date(value).getTime() : undefined;
  //case 'datetime': {
  //item.value = value; ? value.replace(/^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})(.*)/, '$1-$2-$3T$4:$5:$6$7') : '';
  //case 'date': {
  //item.value = value; ? value.replace(/^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})(.*)/, '$1-$2-$3') : '';
  //case 'time': {
  //item.value = value; ? value.replace(/^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})(.*)/, '$4:$5') : '';
  //case 'year': {
  //item.value = `${value || ''}`.replace(/^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})(.*)/, '$1');
  //case 'year-month': {
  //item.value = `${value || ''}`.replace(/^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})(.*)/, '$1-$2');
  //case 'decimal': {
  //item.value = parseFloat(`${value || '0'}`);

  //  /**
  //   *
  //   *
  //   * Description            Format                  Datetime Value Example
  //   *
  //   * Year                   YYYY                    1994
  //   * Year and Month         YYYY-MM                 1994-12
  //   * Date                   YYYY-MM-DD              1994-12-15
  //   * Date and Time          YYYY-MM-DDTHH:mm        1994-12-15T13:47
  //   * UTC Date               YYYY-MM-DDTHH:mm:ssZ    1994-12-15T13:47:20Z
  //   * GMT Date               YYYY-MM-DDTHH:mm:ssTZD  1994-12-15T13:47:20+05:00
  //   * Hour and Minute        HH:mm                   13:47
  //   * Hour, Minute, Second   HH:mm:ss                13:47:20
  //   */
  //
  //  /**
  //   * Change Title Case
  //   *
  //   * Transform a string into title case.
  //   *
  //   * this.titleCase("STRING"); // "String"
  //   * this.titleCase("follow step-by-step instructions"); // "Follow Step-by-step Instructions"
  //   */
  //  changeTitleCase(input: string): string {
  //    let words: any = input.toLowerCase().split(' ');
  //    for (let i = 0; i < words.length; i++) {
  //      words[i] = words[i].charAt(0).toUpperCase() + words[i].substring(1);
  //    }
  //    return words.join(' ');
  //  }

  //if (item.mode === 'group') {
  //  if (typeof value !== 'undefined') {
  //
  //    const fields: any = data.clone(item.items || []);
  //    fields.map((f: any) => {
  //      f.path = `${item.path}`;
  //    });
  //
  //    const result: any = [];
  //    for (const item of fields) {
  //      result.push({...item, value: value[`${item.name}`] || undefined});
  //    }
  //
  //    value = result.length ? result : undefined;
  //  }
  //}

  //if (item.mode === 'array') {
  //  if (typeof value !== 'undefined') {
  //    const fields: any = data.clone(item.items || [{...item., type: item.type.replace(/\[\]$/, ''), mode: 'input', size: 100, iconOnly: true}]);
  //    fields.map((f: any) => {
  //      f.path = `${item.path}`;
  //    });
  //    const result: any = [];
  //    for (const v of value) {
  //      result.push(
  //        fields.map((f: any) => {
  //          return {...f, value: typeof v !== 'object' ? v || undefined : v[`${f.name}`] || undefined};
  //        })
  //      );
  //    }
  //    value = result.length ? result : undefined;
  //  }
  //}

  if (!item.$input) {
  } else if (item.$input.array) {
    value = value || [];
    value.push(await Promise.all(item.items.map(async (i: any) => await self.formatItem(i, item, item._type))));
    value.push(await Promise.all(item.items.map(async (i: any) => await self.formatItem(i, item, item._type))));
  } else if (item.$input.group) {
    value = value || {};
    value = await Promise.all(item.items.map(async (i: any) => await self.formatItem(i, item, item._type)));
  } else if (item.$input.input) {
    value = value || undefined;
  } else if (item.$input.field) {
    value = value || undefined;
  }

  // // Format value
  // if (item.$input.format === 'object') {
  //   value = this.getObject(value) || undefined;
  // } else if (item.$input.format === 'string') {
  //   value = this.getString(value) || undefined;
  // } else if (item.$input.format === 'number') {
  //   value = this.getNumber(value) || 0;
  // } else if (item.$input.format === 'date') {
  //   value = this.getDate(value) || undefined;
  // } else if (item.$input.format === 'boolean') {
  //   value = this.getBool(value) || undefined;
  // }

  if (!item.readonly) {
    if (typeof value === 'undefined') {
      if (!item.$input) {
      } else if (item.$input.array) {
      } else if (item.$input.group) {
      } else if (item.$input.input && typeof item.require === 'boolean' && item.require) {
        error = 'require.warning';
      }
    } else {
      if (!item.$input) {
      } else if (item.$input.array) {
      } else if (item.$input.group) {
      } else if (item.$input.input && typeof item.pattern === 'string' && !`${value || ''}`.match(new RegExp(item.pattern))) {
        error = 'pattern.warning';
      } else if (item.$input.input && typeof item.pattern === 'object' && !`${value || ''}`.match(item.pattern)) {
        error = 'pattern.warning';
      } else if (item.$input.input && typeof item.min === 'number' && parseFloat(`${value || '0'}`) < item.min) {
        error = 'min.warning';
      } else if (item.$input.input && typeof item.max === 'number' && parseFloat(`${value || '0'}`) > item.max) {
        error = 'max.warning';
      } else if (item.$input.input && typeof item.minLength === 'number' && (value || []).length < item.minLength) {
        error = 'min-length.warning';
      } else if (item.$input.input && typeof item.maxLength === 'number' && (value || []).length > item.maxLength) {
        error = 'max-length.warning';
      }
    }
  }

  item.value = value || undefined;
  item.error = error || undefined;

  self.trigger('item.onSetup', item);
}

/***********************************************************************************************************************
 ***********************************************************************************************************************
 ***
 *** SUPPORT FUNCTIONS
 ***
 ***********************************************************************************************************************
 **********************************************************************************************************************/

/**
 * Get slot
 */
function getSlot(items: any[] = []): any {
  const getValue = (f: any[], s: string): any => {
    return f.reduce((a: any, i: any) => [...(a || []), ...(i.slot === s ? [i] : []), ...(i.items ? getValue(i.items, s) || [] : [])], null) || [];
  };
  const result: any = {};
  result.title = getValue(items, 'title');
  result.label = getValue(items, 'label');
  result.notes = getValue(items, 'notes');
  result.image = getValue(items, 'image');
  result.video = getValue(items, 'video');
  result.state = getValue(items, 'state');
  result.color = getValue(items, 'color');
  result.style = getValue(items, 'style');
  Object.keys(result).forEach((k: any) => (typeof result[k] === 'undefined' || !result[k].length ? delete result[k] : {}));
  return result;
}

/**
 * Get slot value
 */
function getSlotValue(slots: any = [], value: any = {}): any {
  const getValue = (fields: any[], value: any = {}): any[] => {
    return fields.map((i: any) => getValueFromField(i, value)).filter((v: any) => !!v);
  };
  const getValueFromField = (field: any, value: any = {}): any => {
    return field.name.split('.').reduce((o: any, k: any) => (o || {})[k], value);
  };
  const result: any = {};
  result.index = slots.index?.length ? getValue(slots.index, value).shift() || '' : value._id || value.id || '';
  result.title = slots.title?.length ? getValue(slots.title, value).join(' ') || '' : undefined;
  result.label = slots.label?.length ? getValue(slots.label, value).join(' ') || '' : undefined;
  result.count = slots.count?.length ? getValue(slots.count, value).join(' ') || '' : undefined;
  result.total = slots.total?.length ? getValue(slots.total, value).join(' ') || '' : undefined;
  result.notes = slots.notes?.length ? getValue(slots.notes, value) || [] : undefined;
  result.image = slots.image?.length ? getValue(slots.image, value).shift() || '' : undefined;
  result.video = slots.video?.length ? getValue(slots.video, value).shift() || '' : undefined;
  result.state = slots.state?.length ? getValue(slots.state, value).shift() || '' : undefined;
  result.color = slots.color?.length ? getValue(slots.color, value).shift() || '' : undefined;
  result.style = slots.style?.length ? getValue(slots.style, value).shift() || {} : undefined;
  result.value = value;
  Object.keys(result).forEach((k: any) => (typeof result[k] === 'undefined' ? delete result[k] : {}));
  return result;
}

/***********************************************************************************************************************
 ***********************************************************************************************************************
 ***
 *** CONFIG FUNCTIONS
 ***
 ***********************************************************************************************************************
 **********************************************************************************************************************/

import {DataGuard} from './data.guard';

/**
 * Format config
 */
export function formatConfig(config: any): any {
  config = config || {};

  // Define http
  // @param {Object}
  config.http = config.http || {key: 'http', url: '', uri: ''};

  // Define i18n
  // @param {Object}
  config.i18n = config.i18n || {key: 'i18n'};

  // Define user
  // @param {Object}
  config.user = config.user || {key: 'user'};

  // Define pages
  // @param {Array}
  config.pages = config.pages || [];

  // Define views
  // @param {Array}
  config.views = config.views || [];

  // Define routes
  // @param {Array}
  config.routes = [];
  for (const page of config.pages) {
    page.name = page.name || '';
    page.load = page.load || undefined;
  }
  for (const view of config.views) {
    view.name = view.name || '';
    view.load = view.load || (config.pages.find((p: any) => p.name === view.page) || {}).load || undefined;

    // Define view data
    view.path = view.path || '';
    view.menu = view.menu || '';
    view.role = view.role || '';
    view.auth = view.auth || [];

    // Define view form
    view.rest = view.rest || undefined;
    view.type = view.type || undefined;
    view.form = view.form || undefined;

    if (view.path && view.load && view.role === 'home') {
      config.routes.push({path: '', pathMatch: 'full', redirectTo: view.path});
    }
    if (view.path && view.load) {
      config.routes.push({path: view.path, data: view, loadChildren: view.load, canActivate: [DataGuard]});
    }
  }
  return config;
}
