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
  let button;

  let [pages, size] = [[...$VISIBLE_LAYOUT_CATALOG_ITEMS], pageSize]
  pages = [...Array(Math.ceil(pages.length / size))].map(_ => pages.splice(0,size))
  currentPage = pages[0];

  const UpdatePages = () => {
    pages = [...$VISIBLE_LAYOUT_CATALOG_ITEMS];
    pages = [...Array(Math.ceil(pages.length / size))].map(_ => pages.splice(0,size))
    ChangePage(0);
  }

  const ChangePage = (index) => {
    let currentActive = document.getElementsByClassName("active-button");
    if (currentActive[0])
      currentActive[0].classList.remove("active-button")

    let active = document.getElementById(index.toString())
    if (active)
      active.classList.add("active-button")

    currentPage = pages[index]
    pageIndex = index;
  }

  $: UpdatePages($VISIBLE_LAYOUT_CATALOG_ITEMS)
  $: ChangePage(0, button)

</script>

<div>
  <div class="box container">
    {#if pages.length > 0}
      {#each currentPage as item}
        {#if item}
          <article class="media">
            <div class="media-left">
              <figure class="image is-64x64">
                <Icon id={GetIcon(item.layout)}/>
              </figure>
            </div>
            <div class="media-content">
              <div class="content">
                  <p>
                    <Tooltip label={GetName(item.layout)} position="is-top" type="is-dark">
                      <strong>{Titleize(item.name)}</strong>
                    </Tooltip>
                    <small style="color:darkgray;"> @{item.creator}</small>
                    <small/>
                    <br>
                    {item.description}
                  </p>
                  <div class="mediaFooter">
                    <div class="footerButtons">
                      <nav class="level is-mobile" style="padding-top: 5px;">
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
                    </div>
                    {#if item.tags}
                      <div class="mediaFooter tags">
                        {#each item.tags.sort((a, b) => b.length - a.length) as tag}
                          <p>{tag}</p>
                        {/each}
                      </div>   
                    {/if}
                  </div>
                </div>
            </div>
          </article>
          {:else}
            <h1>No layouts found...</h1>
        {/if}
      {/each}
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
        <button bind:this={button} id={pages.indexOf(item)} on:click={() => ChangePage(pages.indexOf(item))}>{pages.indexOf(item) + 1}</button>    
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

<div class="active-button"/>

<style>
  .container {
    min-height: 1068px;
  }

  .mediaFooter {
    display: flex;
  }

  .footerButtons {
    display: contents;
  }

  .tags {
    justify-content: end;
    flex-grow: 1;
  }

  .tags p {
    margin-bottom: 0px;
    margin-right: 5px;
    font-size: 11px;

    padding: 5px;
    border: 1px solid gray;
    border-radius: 12px;
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

  .active-button {
    background-color: #3f4e4e !important;
    color: #1aad90;
  }

</style>