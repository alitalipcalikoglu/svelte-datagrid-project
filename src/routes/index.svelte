<script>
  import Table from 'components/table/table.svelte';
  import { getUserList } from '../stores/users';
  import { getUserDetail } from '../stores/user-detail';
  import { onMount } from 'svelte';

  let demandDetail;
  let modalContent;

  let userData;
  let userDetailsData;

  const doSomething = (e) => {
    modalContent = e.detail;
  };

  const deleteThis = (e) => {
    userData = [...userData.filter((d) => d.id !== e.detail.id)];
  };

  const getData = async () => {
    userData = getUserList();
    userDetailsData = getUserDetail();
  };

  const getDetail = (e) => {
    demandDetail = [...userDetailsData.filter((d) => d.user_id === e.detail.id)];
  };

  onMount(async () => await getData());
</script>

<div
  class="modal-wrapper"
  on:click|self={() => (modalContent = undefined)}
  class:show={modalContent}
>
  <div class="modal">
    <!-- {console.log(modalContent)} -->
  </div>
</div>

<div class="top" class:open={demandDetail}>
  <Table
    filter={[
      {
        column: 'name',
        name: 'Ad',
        type: 'string',
      },
      {
        column: 'phone',
        name: 'Telefon',
        type: 'string',
      },
      {
        column: 'email',
        name: 'E-Posta',
        type: 'string',
      },
    ]}
    pagination={{
      perPageSelectOptions: [30, 100, 250, 500],
    }}
    data={userData}
    style={{
      padding: '1em',
    }}
    sort={{
      title: '#',
    }}
    rowContextMenu={[
      {
        label: 'Do Something',
        event: 'doSomething',
      },
      {
        label: 'Delete',
        event: 'deleteThis',
      },
    ]}
    on:doSomething={doSomething}
    on:deleteThis={deleteThis}
    on:rowClick={getDetail}
  />
</div>

{#if demandDetail}
  <div class="bottom">
    <Table
      filter={[
        {
          column: 'address',
          name: 'Adres',
          type: 'string',
        },
        {
          column: 'postalZip',
          name: 'Posta Kodu',
          type: 'string',
        },
        {
          column: 'region',
          name: 'Bölge',
          type: 'string',
        },
        {
          column: 'country',
          name: 'Ülke',
          type: 'string',
        },
      ]}
      data={demandDetail}
      style={{
        padding: '1em',
      }}
      sort={{
        title: '#',
      }}
    />
  </div>
{/if}

<style lang="scss">
  .modal-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: none;
    place-content: center;
    background-color: rgba($color: #000000, $alpha: 0.5);
    color: #fff;
    z-index: 5;

    &.show {
      display: grid;
    }

    .modal {
      padding: 2em;
    }
  }
  .top {
    height: calc(100vh - 46px);
    &.open {
      height: 60vh;
    }
    overflow-y: auto;
  }

  .bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: calc(40vh - 46px);
    border-top: 1px solid;
    overflow-y: auto;
  }

  @media screen and (max-width: 1140px) {
    .top {
      height: calc(100vh - 75px);
    }

    .bottom {
      height: calc(40vh - 75px);
    }
  }
</style>
