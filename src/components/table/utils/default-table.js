export const defaultTable = (settings) => {
  return {
    options: {
      pagination: true,
      sorting: true,
      filtering: true,
      search: true,
      columnSearch: true,
      doubleClickableRow: true,
      selectableRow: true,
      rowContext: true,
      headContext: true,
      ...settings.options,
    },

    search: {
      columnSearchHistory: [],
    },

    actions: {
      title: 'Actions',
      buttons: [],
      ...settings.actions,
    },

    sort: {
      title: false,
      ...settings.sort,
    },

    sorting: {
      icons: {
        none: '',
        desc: 'icon-sort-alt-down',
        asc: 'icon-sort-alt-up',
      },
      get getIconListArray() {
        return Object.values(this.icons);
      },
      history: [],
      ...settings.sorting,
    },

    pagination: {
      activePage: 1,
      perPageSelectOptions: [10, 25, 50, 100],
      ...settings.pagination,
    },

    filtering: {
      icon: 'icon-filter',
      current: undefined,
    },

    contextMenu: {
      row: {
        show: false,
        element: undefined,
        clickedItem: undefined,
        items: [...settings.rowContextMenu],
      },

      head: {
        show: false,
        element: undefined,
        clickedItem: undefined,
        items: [...settings.headContextMenu],
      },

      filter: {
        show: false,
        element: undefined,
        clickedItem: undefined,
        items: [contextMenuItem('Filter', 'filterevent')],
      },
    },

    rows: {
      checkedAll: undefined,
    },

    closeMenu(menu = undefined) {
      if (!menu) {
        if (this.options.rowContext) this.contextMenu.row.show = false;
        if (this.options.headContext) this.contextMenu.head.show = false;
        if (this.options.filtering) this.contextMenu.filter.show = false;
      } else if (menu === 'row' && this.options.rowContext) {
        this.contextMenu.row.show = false;
      } else if (menu === 'head' && this.options.headContext) {
        this.contextMenu.head.show = false;
      } else if (menu === 'filtering' && this.options.filtering) {
        this.contextMenu.filter.show = false;
      }
    },

    openMenu(menu) {
      this.closeMenu();
      if (menu === 'row' && this.options.rowContext) {
        this.contextMenu.row.show = true;
      } else if (menu === 'head' && this.options.headContext) {
        this.contextMenu.head.show = true;
      } else if (menu === 'filtering' && this.options.filtering) {
        this.contextMenu.filter.show = true;
      }
    },
  };
};

export const contextMenuItem = (label, event, data = {}) => {
  return {
    label,
    event,
    data,
  };
};
