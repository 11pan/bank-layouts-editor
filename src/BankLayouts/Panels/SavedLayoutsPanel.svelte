<script>
    import Icon from "../Components/Icon.svelte";
    import { SLOTS, LAYOUTS, ACTIVE_LAYOUT, ITEMS_IN_GRID } from '../Utility/stores.js'
    import { Tooltip } from 'svelma';
    import ModalCard from '../Components/ModalCard.svelte';

    import { NewLayout } from "../Utility/NewLayout.js"
    import { LoadLayout } from "../Utility/LoadLayout.js"
    import { SaveLayout } from "../Utility/SaveLayout.js"
    import { DeleteLayout } from "../Utility/DeleteLayout.js"

    let confirmationModalActive = false;
    let deleteLayoutConfirmation = false;
</script>


<nav class="panel">
  <div>
    <p class="panel-heading">
      <span class='container'>
        <span class='columns is-vcentered is-mobile is-1 is-variable'>
          <span class='column'>Layouts</span>
          {#if $ITEMS_IN_GRID && Object.entries($ACTIVE_LAYOUT).length < 1} 
            <span class='column is-narrow'>
            <Tooltip label="Save as new layout" position="is-top" type="is-dark">
                <button class="button is-small is-sucess is-pulled-right is-vcentered" on:click={() => {SaveLayout(true, false, false)}}>
                    <a href={null}>Save</a>
                </button>
            </Tooltip>
            </span>
          {/if}
          <span class='column is-narrow'>
            <Tooltip label="New layout" position="is-top" type="is-dark">
              <button class="button is-small is-pulled-right is-vcentered" on:click={() => { $SLOTS.items.filter((x) => x != -1).length > 0 ? confirmationModalActive = true : NewLayout(true) }}>
                <span class="icon is-small">
                  <i class="fas fa-plus"></i>
                </span>
              </button>
            </Tooltip>
          </span>
        </span>
      </span>
        </p>
  </div>

  {#each JSON.parse($LAYOUTS) as item, index}
    <a href={null} class='panel-block has-text-centered' on:click|preventDefault={() => { LoadLayout(item.layout_string); $ACTIVE_LAYOUT = item}}>
      <div class='container'>
        <div class="columns is-vcentered is-mobile is-1 is-variable">
          <div class="column is-narrow" style='height:64px;'>
            <Icon id={item.icon}/>
          </div>
          <div class="column has-text-left">
            {item.name ? item.name : ''}
          </div>
          {#if $ACTIVE_LAYOUT.id == item.id}
          <div class="column is-narrow is-pulled-right">
            <Tooltip label="Save changes" position="is-top" type="is-success">
              <button class="button is-success" on:click|stopPropagation={() => SaveLayout(false, false, false)}>
                <span class="icon is-small">
                  <i class="fas fa-solid fa-check"></i>
                </span>
              </button>
            </Tooltip>
          </div>
          <div class="column is-narrow">
            <Tooltip label="Delete layout" position="is-top" type="is-danger">
              <button class="button is-danger" on:click|stopPropagation={() => deleteLayoutConfirmation = true}>
                <span class="icon is-small">
                  <i class="fas fa-solid fa-ban"></i>
                </span>
              </button>		
            </Tooltip>
          </div>
          {/if}
        </div>
      </div>
  </a>
  {/each}
</nav>


<ModalCard bind:active={confirmationModalActive} title='Are you sure?' successName='Confirm' on:success={NewLayout}>
	<span>The grid contains items, any unsaved changes will be discarded.</span>
</ModalCard>

<ModalCard bind:active={deleteLayoutConfirmation} title='Are you sure?' successName='Confirm' on:success={() => {DeleteLayout(); deleteLayoutConfirmation = false; $ITEMS_IN_GRID = false;}}>
	<span>Are you sure you want to delete this layout?<br>This process cannot be undone.</span>
</ModalCard>
