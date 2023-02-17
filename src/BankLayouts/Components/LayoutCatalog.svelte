<script>
	import { LAYOUT_CATALOG, VISIBLE_LAYOUT_CATALOG_ITEMS } from '../Utility/stores.js'
  import Icon from "../Components/Icon.svelte";
  import { Tooltip, Toast } from 'svelma';
  import { onMount } from 'svelte';

	import { LoadLayout } from "../Utility/LoadLayout"
  import { SaveLayout } from "../Utility/SaveLayout"
  import { GetName, GetIcon, Titleize, GetShareUrl } from "../Utility/Helpers"

  $VISIBLE_LAYOUT_CATALOG_ITEMS = $LAYOUT_CATALOG;

</script>

<div class="box">
    {#each $VISIBLE_LAYOUT_CATALOG_ITEMS as item}
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
                <button href={null} class="level-item hideBackground" aria-label="copy" on:click={LoadLayout(item.layout)}>
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
    {#if $VISIBLE_LAYOUT_CATALOG_ITEMS.length < 1}
      <h1>Could not find any layouts.</h1>
    {/if}
</div>

<style>
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
</style>