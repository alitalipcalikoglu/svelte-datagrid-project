<script>
  export let segment;
  let open;
  let menuElement;
  const handleMenuIconClick = () => {
    if (open) {
      menuElement.style.left = '-320px';
      open = !open;
    } else {
      menuElement.style.left = '0';
      open = !open;
    }
  };
</script>

<div bind:this={menuElement} class="nav-wrapper">
  <div class="menu-icon-wrapper">
    <span class="icon-menu menu-icon" on:click={handleMenuIconClick} />
  </div>
  <ul class="nav-menu">
    <li class="menu-item">
      <a href="/">
        <span class="icon-home" />
      </a>
    </li>
    <li class="menu-item" class:active={segment === 'talepler'}>
      <a href="/talepler"> Talepler </a>
    </li>
    <li class="menu-item" class:active={segment === 'teklifler'}>
      <a href="/teklifler">Teklifler</a>
    </li>
    <li class="menu-item" class:active={segment === 'siparisler'}>
      <a href="/siparisler">Siparişler</a>
    </li>
    <li class="menu-item" class:active={segment === 'irsaliyeler'}>
      <a href="/irsaliyeler">İrsaliyeler</a>
    </li>
    <li class="menu-item" class:active={segment === 'faturalar'}>
      <a href="/faturalar">Faturalar</a>
    </li>
    <li class="menu-item" class:active={segment === 'cariler'}>
      <a href="/cariler">Cariler</a>
    </li>
  </ul>

  <ul class="user-menu">
    <li class="menu-item" class:active={segment === 'gorevlerim'}>
      <a href="/gorevlerim">
        <span>Görevlerim</span>
        <span class="count">(1)</span>
      </a>
    </li>
    <li class="menu-item user">
      <a href="/">Kullanıcı Adı</a>
    </li>
  </ul>
</div>

<style lang="scss">
  .nav-wrapper {
    display: grid;
    grid-auto-flow: column;
    justify-content: space-between;
    padding: 0 1em;
    border-bottom: 1px solid;
    user-select: none;
    height: 46px;
    .menu-icon-wrapper {
      display: none;
      background-color: #fff;
    }
    .nav-menu,
    .user-menu {
      display: grid;
      grid-auto-flow: column;
      gap: 1em;

      .menu-item {
        &.active {
          color: #e31019;
        }
        a {
          display: inline-block;
          padding: 1em;
        }
      }
    }

    .user-menu {
      .menu-item {
        .count {
          color: #e31019;
          font-weight: 500;
          display: inline-block;
          margin-left: 0.25em;
        }
      }
      .user {
        font-weight: 700;
      }
    }
  }

  @media screen and (max-width: 1140px) {
    .nav-wrapper {
      grid-auto-flow: row;
      justify-content: start;
      align-content: start;
      border-right: 1px solid;
      border-bottom: none;
      background-color: #fff;
      height: 100vh;
      width: 320px;
      overflow-x: hidden;
      position: fixed;
      left: -320px;
      top: 0;
      z-index: 99;
      padding-top: 46px;
      transition: left 0.3s ease;

      .menu-icon-wrapper {
        display: block;
        font-size: 1.5em;
        position: fixed;
        right: 0;
        top: 0;
        padding: 25px;
        .menu-icon {
          cursor: pointer;
        }
      }
      .nav-menu,
      .user-menu {
        grid-auto-flow: row;
        align-content: start;
        .menu-item {
          a {
            padding: 0.5em 1em;
          }
        }
      }
      .user-menu {
        margin-top: 1em;
      }
    }
  }
</style>
