<script>
  import Button from './button.svelte';
  import Pagination from './pagination.svelte';
  import Search from './search.svelte';
  import ContextMenu from './context-menu.svelte';

  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import { convertData, returnFilterObjectFromColumnName } from './utils/convertData';
  import { getStyleFromCondition } from './utils/getStyleFromCondition';
  import { returnStyleFromObject } from '_lib/utils';
  import { getDefaultClassNamesSortIcon } from './utils/getDefaultClassNamesSortIcon';
  import { sortDataByKey } from './utils/sortDataByKey';
  import { filterDataByIndex } from './utils/filterDataByIndex';
  import { defaultTable } from './utils/default-table';

  export let data = [];
  export let filter = [];
  export let actions = {};
  export let sorting = {};
  export let sort = {};
  export let pagination = {};
  export let options = {};
  export let rowContextMenu = [];
  export let headContextMenu = [];
  export let selectedRows = [];
  export let style = undefined;

  const dispatch = createEventDispatcher();

  const tableData = {
    options,
    actions,
    sort,
    sorting,
    pagination,
    rowContextMenu,
    headContextMenu,
  };

  let table = defaultTable(tableData);
  const refeshTable = () => (table = { ...table });

  let tempData = [];
  let showData = [];

  let pages = [];
  let activePerPage = table.pagination.perPageSelectOptions[0];
  let generalSearch = '';

  const handleFilterClick = async (e, filteringElement) => {
    let filterMenuContainer = e.target.parentElement;
    let { x, y, width, height } = filterMenuContainer.getBoundingClientRect();
    filteringElement.classList.add('filtered');

    if (table.filtering.current === undefined) {
      table.filtering.current = filteringElement;
    } else if (table.filtering.current !== filteringElement) {
      table.filtering.current.classList.remove('filtered');
      filteringElement.classList.add('filtered');
      table.filtering.current = filteringElement;
    } else if (table.filtering.current === filteringElement) {
      table.filtering.current.classList.remove('filtered');
      table.filtering.current = undefined;
      return table.closeMenu('filtering');
    }

    table.contextMenu.filter.element.style.top = `${y + height}px`;
    table.contextMenu.filter.element.style.left = `${x}px`;
    table.contextMenu.filter.element.style.minWidth = `${width}px`;

    table.openMenu('filtering');
  };

  const handleSortClick = async (sortingElement) => {
    table.closeMenu(), refeshTable();

    let sortType = sortingElement.dataset.sortType;
    let sortBy = sortingElement.dataset.sortBy;
    let sortIcon = sortingElement.querySelector('.sort-icon');
    let defaultClassNames = getDefaultClassNamesSortIcon(
      sortIcon.className.split(' '),
      table
    );

    sortType = sortingElement.dataset.sortType =
      sortType === 'none' ? 'desc' : sortType === 'desc' ? 'asc' : 'desc';

    sortIcon.className = `${defaultClassNames.join(' ')} ${
      table.sorting.icons[sortType]
    }`;

    showData = await sortDataByKey(showData, sortBy, sortType, filter);

    if (!table.sorting.history.find((sh) => sh === sortingElement))
      table.sorting.history.push(sortingElement);

    await resetSortHistory(sortingElement);
  };

  const handleHeadClick = async (e) => {
    table.closeMenu(), refeshTable();
    let el = e.target;
    let elementClasses = el.className.split(' ');
    if (elementClasses.includes('filter-icon')) return await handleFilterClick(e, el);
    if (elementClasses.includes('sort-icon')) el = e.target.parentElement;
    await handleSortClick(el);
  };

  const resetSortHistory = async (el = false) => {
    if (table.sorting.history.length === 0) return;
    table.sorting.history.forEach((sh) => {
      if (el && sh === el) return;
      sh.dataset.sortType = 'none';

      let defaultClassNames = getDefaultClassNamesSortIcon(
        sh.querySelector('.sort-icon').className.split(' '),
        table
      );

      sh.querySelector('.sort-icon').className = `${defaultClassNames.join(' ')} ${
        table.sorting.icons.none
      }`;
    });
  };

  const prepareData = async (reset) => {
    await resetSortHistory();
    table.pagination.activePage = 1;
    if (reset) activePerPage = table.pagination.perPageSelectOptions[0];
    if (!table.options.pagination) showData = await filterDataByIndex(tempData, 0);
    else showData = await filterDataByIndex(tempData, 0, activePerPage);
    pages = [];
    for (let i = 0; i < Math.ceil(tempData.length / activePerPage); i++) {
      pages.push(i + 1);
    }
  };

  const handleChangePage = async (event, scroll) => {
    table.pagination.activePage = event.detail.target.value;
    await resetSortHistory();
    let dataStart = table.pagination.activePage * activePerPage - activePerPage;
    let dataEnd = dataStart + activePerPage;
    dataEnd > tempData.length && (dataEnd = tempData.length);
    showData = await filterDataByIndex(tempData, dataStart, dataEnd);
    if (scroll && window) window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChangePerPage = async (event, scroll) => {
    activePerPage = event.detail.target.value;
    await prepareData();
    if (scroll && window) window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChangeData = async (data) => {
    tempData = [...data];
    await prepareData(true);
  };

  const handleContextItemClick = (event, data) => {
    table.closeMenu(), refeshTable();
    dispatch(event, data);
  };

  const handleHeadRightClick = (e, data) => {
    e.preventDefault();
    console.log('headRightClick', data);
    if (!table.options.headContext || !table.contextMenu.head.element) return;
    table.contextMenu.head.clickedItem = data;
    let { clientX: x, clientY: y } = e;
    table.contextMenu.head.element.style.top = `${y}px`;
    table.contextMenu.head.element.style.left = `${x}px`;
    table.openMenu('head');
  };

  const handleRowRightClick = (e, data) => {
    e.preventDefault();
    console.log('rowRightClick', data);
    if (!table.options.rowContext || !table.contextMenu.row.element) return;
    table.contextMenu.row.clickedItem = data;
    let { clientX: x, clientY: y } = e;
    table.contextMenu.row.element.style.top = `${y}px`;
    table.contextMenu.row.element.style.left = `${x}px`;
    table.openMenu('row');
  };

  const handleRowLeftClick = (e, row) => {
    table.closeMenu(), refeshTable();
    console.log('rowLeftClick', row);
    dispatch('rowClick', row);
  };

  const handleRowDoubleClick = (e, row) => {
    if (!table.options.doubleClickableRow) return;
    console.log('rowDoubleClick', row);
    dispatch('rowDoubleClick', row);
  };

  const handleGeneralSearch = (value) => {
    if (value.length < 1) return handleChangeData(data);
    let filteredData = [
      ...data.filter((d) => {
        if (
          Object.values(d).find(
            (v) =>
              v
                .toLocaleString()
                .toLocaleLowerCase()
                .indexOf(value.toLocaleLowerCase()) !== -1
          )
        )
          return d;
      }),
    ];

    handleChangeData(filteredData);
  };

  const handleChangeCheckedRow = () => {
    if (!table.options.selectableRow) return;
    console.log('selectedRows', selectedRows);
    if (table.rows.checkedAll && selectedRows.length < showData.length) {
      table.rows.checkedAll = false;
    } else if (selectedRows.length > 0 && selectedRows.length === showData.length) {
      table.rows.checkedAll = true;
    }
  };

  const handleCheckedAllClick = () => {
    if (!table.options.selectableRow) return;
    if (table.rows.checkedAll) {
      showData.forEach((s, i) => {
        s.selected = true;
        selectedRows.push(i);
      });
      selectedRows = [...new Set(selectedRows)];
    } else {
      selectedRows = [];
      showData.map((s) => {
        s.selected = false;
      });
    }
  };

  const autoFillFilter = async () => {
    if (filter.length === 0) {
      Object.keys(tempData[0]).forEach((col, i) => {
        filter.push(returnFilterObjectFromColumnName(col, Object.values(tempData[0])[i]));
      });
    }

    if (table.options.selectableRow) {
      filter = [
        {
          column: 'selected',
          name: 'selected',
          type: 'boolean',
          style: {},
        },
        ...filter,
      ];
    }
  };

  const handleColumnSearchInput = (e) => {
    let input = e.target;
    let value = input.value;
    let filter = input.dataset.column;
    if (table.search.columnSearchHistory.indexOf(input) === -1)
      table.search.columnSearchHistory.push(input);

    table.search.columnSearchHistory.forEach((csh, i) => {
      if (csh.value.length < 1 || csh.value === ' ')
        table.search.columnSearchHistory.splice(i, 1);
    });

    if (table.search.columnSearchHistory.length < 1) return handleChangeData(data);

    let filteredData = [];
    let sourceData = generalSearch.length > 0 ? [...showData] : [...data];

    filteredData = [
      ...sourceData.filter((d) => {
        if (
          d[filter]
            .toLocaleString()
            .toLocaleLowerCase()
            .indexOf(value.toLocaleLowerCase()) !== -1
        ) {
          return d;
        }
      }),
    ];

    table.search.columnSearchHistory.forEach((csh) => {
      if (csh !== input) {
        filteredData = [
          ...filteredData.filter((d) => {
            if (
              d[csh.dataset.column]
                .toLocaleString()
                .toLocaleLowerCase()
                .indexOf(csh.value.toLocaleLowerCase()) !== -1
            ) {
              return d;
            }
          }),
        ];
      }
    });

    handleChangeData(filteredData);
  };

  $: handleChangeData(data);
  $: handleGeneralSearch(generalSearch);
  $: handleChangeCheckedRow(selectedRows);

  onMount(async () => await autoFillFilter());
</script>

<ContextMenu
  bind:menuElement={table.contextMenu.row.element}
  menuItems={table.contextMenu.row.items}
  show={table.contextMenu.row.show}
  on:click={(e) => handleContextItemClick(e.detail, table.contextMenu.row.clickedItem)}
/>

<ContextMenu
  bind:menuElement={table.contextMenu.head.element}
  menuItems={table.contextMenu.head.items}
  show={table.contextMenu.head.show}
  on:click={(e) => handleContextItemClick(e.detail, table.contextMenu.head.clickedItem)}
/>

<ContextMenu
  bind:menuElement={table.contextMenu.filter.element}
  menuItems={table.contextMenu.filter.items}
  show={table.contextMenu.filter.show}
  on:click={(e) => console.log(e.detail)}
/>

<div
  class="table-wrapper"
  style={returnStyleFromObject(style)}
  on:click|stopPropagation|self={() => (table.closeMenu(), refeshTable())}
>
  <div class="tools-wrapper">
    <Search show={table.options.search} bind:value={generalSearch} />
    <Pagination
      {pages}
      {table}
      show={table.options.pagination}
      bind:activePerPage
      bind:activePage={table.pagination.activePage}
      on:changePerPage={handleChangePerPage}
      on:changePage={handleChangePage}
    />
  </div>

  <table class="table">
    <thead>
      <tr>
        {#if table.sort.title}
          <td class="sort">
            {table.sort.title}
          </td>
        {/if}

        {#each filter as filteredData}
          {#if filteredData.column === 'selected'}
            <td class="select">
              <input
                type="checkbox"
                bind:checked={table.rows.checkedAll}
                on:change={handleCheckedAllClick}
              />
            </td>
          {:else}
            <td
              data-sort-by={filteredData.column}
              data-sort-type="none"
              style={returnStyleFromObject(filteredData.style)}
              on:click={handleHeadClick}
              on:contextmenu={(e) => handleHeadRightClick(e, filteredData)}
            >
              {filteredData.name}

              {#if table.options.sorting}
                <span class="sort-icon {table.sorting.icons.none}" />
              {/if}

              {#if table.options.filtering}
                <span class="filter-icon {table.filtering.icon}" />
              {/if}
            </td>
          {/if}
        {/each}

        {#if table.actions.buttons.length > 0}
          <td class="actions-title"> {table.actions.title} </td>
        {/if}
      </tr>
    </thead>

    <tbody>
      {#if table.options.columnSearch}
        <tr>
          {#if table.sort.title}
            <td />
          {/if}
          {#each filter as filteredData}
            {#if filteredData.column === 'selected'}
              <td />
            {:else}
              <td class="column-filter-input">
                <div class="input-wrapper">
                  <input
                    type="text"
                    data-column={filteredData.column}
                    on:input={handleColumnSearchInput}
                  />
                  <span
                    class="icon-search"
                    on:click={() => console.log(filteredData.column)}
                  />
                </div>
              </td>
            {/if}
          {/each}
        </tr>
      {/if}
      {#if showData.length > 0}
        {#each showData as row, i}
          <tr
            on:click={(e) => handleRowLeftClick(e, row)}
            on:dblclick={(e) => handleRowDoubleClick(e, row)}
            on:contextmenu={(e) => handleRowRightClick(e, row)}
          >
            {#if table.sort.title}
              <td data-title={table.sort.title}> {i + 1} </td>
            {/if}

            {#each filter as filteredData}
              {#if filteredData.column === 'selected'}
                <td class="select-wrapper" style="text-align: center;">
                  <input
                    type="checkbox"
                    value={i}
                    on:click|stopPropagation
                    on:dblclick|stopPropagation
                    bind:group={selectedRows}
                    bind:checked={row.selected}
                  />
                </td>
              {:else}
                <td
                  style={getStyleFromCondition(
                    filteredData.styleCondition,
                    row[filteredData.column]
                  )}
                  data-title={filteredData.name}
                >
                  {convertData(row[filteredData.column], filteredData.type)}
                </td>
              {/if}
            {/each}
            {#if table.actions.buttons.length > 0}
              <td class="action-buttons" data-title={table.actions.title}>
                {#each table.actions.buttons as button}
                  {#if button.condition}
                    {#if button.condition.value.includes(row[button.condition.key])}
                      <Button {button} on:click={() => dispatch(button.event, row)} />
                    {/if}
                  {:else}
                    <Button {button} on:click={() => dispatch(button.event, row)} />
                  {/if}
                {/each}
              </td>
            {/if}
          </tr>
        {/each}
      {:else}
        <tr>
          <td colspan={table.sort.title ? filter.length + 1 : filter.length}>
            <p>Görüntülenecek veri yok.</p>
          </td>
        </tr>
      {/if}
    </tbody>
  </table>

  <Pagination
    {pages}
    {table}
    show={table.options.pagination && activePerPage >= 25 && showData.length >= 25}
    bind:activePerPage
    bind:activePage={table.pagination.activePage}
    on:changePerPage={handleChangePerPage}
    on:changePage={handleChangePage}
    bottom
  />
</div>

<style lang="scss">
  @import '../../_configs/style/colors.scss';
  @import './_table.scss';
  @import './_media-queries.scss';
</style>
