<script>
	import { LAYOUT_CATALOG, VISIBLE_LAYOUT_CATALOG_ITEMS } from '../Utility/stores.js'
  import Icon from "../Components/Icon.svelte";
  import { Tooltip, Toast } from 'svelma';

	import { LoadLayout } from "../Utility/LoadLayout"
  import { SaveLayout } from "../Utility/SaveLayout"
  import { GetName, GetIcon, Titleize, GetShareUrl } from "../Utility/Helpers"

  $VISIBLE_LAYOUT_CATALOG_ITEMS = $LAYOUT_CATALOG;

  const pageSize = 10;
  let currentPage;
  let pageIndex = 0;

  let [pages, size] = [[...$VISIBLE_LAYOUT_CATALOG_ITEMS], pageSize]
  pages = [...Array(Math.ceil(pages.length / size))].map(_ => pages.splice(0,size))
  currentPage = pages[0];

  const UpdatePages = () => {
    pages = [...$VISIBLE_LAYOUT_CATALOG_ITEMS];
    pages = [...Array(Math.ceil(pages.length / size))].map(_ => pages.splice(0,size))
    ChangePage(0);
  }

  const ChangePage = (index) => {
    currentPage = pages[index]
    pageIndex = index;
  }

  $: UpdatePages($VISIBLE_LAYOUT_CATALOG_ITEMS)

</script>

<div>
  <div class="box container">
    {#if pages.length > 0}
      {#each currentPage as item}
      <article class="media">
          <div class="media-left">
            <figure class="image is-64x64">
              {#if item}
              <Icon id={GetIcon(item.layout)}/>
              {/if}
            </figure>
          </div>
          <div class="media-content">
            <div class="content">
              {#if item}
                <p>
                  <Tooltip label={GetName(item.layout)} position="is-top" type="is-dark">
                    <strong>{Titleize(item.name)}</strong>
                  </Tooltip>
                  <small style="color:darkgray;"> @{item.creator}</small>
                  <small/>
                  <br>
                  {item.description}
                </p>
              {/if}
            </div>
            {#if item}
              <nav class="level is-mobile">
                <div class="level-left">
                  <button href={null} class="level-item hideBackground" aria-label="copy" on:click={() => {LoadLayout(item.layout); window.scrollTo(0, 0);}}>
                    <span class="icon is-small">
                      <Tooltip label="Open layout" position="is-top" type="is-dark">
                          <i class="fas fa-copy buttonColor" aria-hidden="true" />
                      </Tooltip>
                    </span>
                  </button>
                  <button href={null} class="level-item hideBackground" aria-label="save" on:click={SaveLayout(true, item.layout, true)}>
                    <span class="icon is-small">
                      <Tooltip label="Save layout" position="is-top" type="is-dark">
                          <i class="fas fa-save buttonColor" aria-hidden="true" />
                      </Tooltip>
                    </span>
                  </button>
                  <button href={null} class="level-item hideBackground" aria-label="export" on:click={() => {
                    navigator.clipboard.writeText(item.layout)
                    Toast.create({ message: 'Layout copied to clipboard.', type: 'is-success', position: 'is-bottom-left' });
                  }}>
                    <span class="icon is-small">
                      <Tooltip label="Export layout" position="is-top" type="is-dark">
                          <i class="fas fa-file-export buttonColor" aria-hidden="true" />
                      </Tooltip>
                    </span>
                  </button>
                  <button href={null} class="level-item hideBackground" aria-label="share" on:click={GetShareUrl(item.layout)}>
                    <span class="icon is-small">
                      <Tooltip label="Share layout" position="is-top" type="is-dark">
                          <i class="fas fa-share buttonColor" aria-hidden="true" />
                      </Tooltip>
                    </span>
                  </button>
                </div>
              </nav>
            {/if}
          </div>
        </article>
      {/each}
    {:else}
      <h1>Could not find any layouts.</h1>
    {/if}
  </div>
  
  {#if pages.length > 1}
    <div class="pagination">
      <button on:click={() => {
        if (pageIndex > 0) {
          pageIndex--;
          ChangePage(pageIndex)

        }
      }}>&laquo;</button>
      {#each pages as item}
      <button on:click={() => ChangePage(pages.indexOf(item))}>{pages.indexOf(item) + 1}</button>    
    {/each}
    <button on:click={() => { {
        if (pageIndex < (pages.length - 1)) {
          pageIndex++;
          ChangePage(pageIndex)
        }
    }
    }}>&raquo;</button>
    </div>
  {/if}
</div>
<style>
  .container {
    min-height: 1031px;
  }

  .buttonColor {
      color: #1abc9c;
  }

  .buttonColor:hover {
      color: #12876f;
  }

  .hideBackground {
    background-color: transparent;
    border: none;
    margin: 0px;
    padding: 0px;
  }

  .hideBackground:active {
    background-color: transparent;
  }

  .pagination {
    display: inline-block;
  }

  .pagination button {
    color: #1abc9c;
    background-color: #282f2f;
    border-width: 2px;
    border-color: #343c3d;
    float: left;
    padding: 8px 16px;
    margin-left: 5px;
    margin-right:5px;
  }

  .pagination button:active {
    background-color: #2c3535;
    color: #1aad90;
  }

  .pagination button:hover {
    background-color: #2c3535;
    color: #1aad90;
  }
</style>