<script>
    import Icon from "../Components/Icon.svelte";
    import { SLOTS, TAG_NAME, LAYOUTS, ACTIVE_LAYOUT, ITEMS_IN_GRID } from '../Utility/stores.js'
    import { Toast } from 'svelma';
    import ModalCard from '../Components/ModalCard.svelte';

    let newLayout = true;
    let confirmationModalActive = false;

    export const createNewLayout = async (confirmed) => {
      if (confirmed) {
        let layouts = JSON.parse($LAYOUTS || "[]");

        let save_object = {
            id: Math.random().toString(26).slice(2),
            name: "New layout",
            icon: 952,
            layout_string: "banktaglayoutsplugin:New layout,banktag:New layout,952,"
          }
        layouts.push(save_object);
        $LAYOUTS = JSON.stringify(layouts);
        loadLayout(save_object);
      }
    }

    export const loadLayout = async (layout_object) => {
      newLayout = false;
      try {
        var layout_string = layout_object.layout_string;
        var type = '';
        type = 'Layout';

        var bankLayoutItems = layout_string.substring(layout_string.indexOf("banktaglayoutsplugin:") + 1, layout_string.indexOf(",banktag"));

        bankLayoutItems = bankLayoutItems.split(",");
        $TAG_NAME = bankLayoutItems[0].split(":")[1];

        var banktagItems = layout_string.substring(layout_string.indexOf("banktag:") + 1);
        banktagItems = banktagItems.split(',');
        $SLOTS['icon'][0] = parseInt(banktagItems[1]);

        var layoutItems = new Set();

        $SLOTS['grid'].fill(-1);
        for (var i = 1; i < bankLayoutItems.length; i++) {
          var parsed = bankLayoutItems[i].split(':');
          var item = parseInt(parsed[0]);
          var idx  = parseInt(parsed[1]);
          
          $SLOTS['grid'][idx] = item;
          layoutItems.add(item);
        }

        var tagItems = new Set();

        for (var i = 2; i < banktagItems.length; i++) {
          var item = parseInt(banktagItems[i]);
          if (!layoutItems.has(item))
            tagItems.add(item);
        }

        $SLOTS['taggedItems'] = [...tagItems];

        if (layout_object.layout_string != '') {
          $ACTIVE_LAYOUT = layout_object;
        }

		} catch (e) {
			Toast.create({ message: 'Error importing ' + type + ': ' + e.message, type: 'is-danger', position: 'is-bottom-left'});
		};
	}

  export const saveLayout = async (new_layout) => {
		try {
			var out = "";

			out += "banktaglayoutsplugin:" + $TAG_NAME + ",";

			for (var i = 0; i < $SLOTS['grid'].length; i++) 
				if ($SLOTS['grid'][i] >= 0) {
					out += ($SLOTS['grid'][i] + ":" + i + ",");
				}
			
			out += "banktag:"
			var banktag = $TAG_NAME + "," + ($SLOTS['icon'][0] >= 0 ? $SLOTS['icon'][0] : 0) + ',';
			banktag += $SLOTS['items'].filter(x => (x >= 0)).join(',');

      let layouts = JSON.parse($LAYOUTS || "[]");

      if (new_layout) { // SAVES A NEW LAYOUT 

        let save_object;

        if ($SLOTS['items'].filter(x => (x >= 0)).length > 0) {
          save_object = {
            id: Math.random().toString(26).slice(2),
            name: $TAG_NAME,
            icon: ($SLOTS['icon'][0] >= 0 ? $SLOTS['icon'][0] : 0),
            layout_string: (out + banktag)
          }
        } else {
          save_object = {
            id: Math.random().toString(26).slice(2),
            name: "New layout",
            icon: 952,
            layout_string: "banktaglayoutsplugin:New layout,banktag:New layout,952,"
          }
        }

        layouts.push(save_object);
        $LAYOUTS = JSON.stringify(layouts);
        loadLayout(save_object);

        Toast.create({ message: 'New layout created.', type: 'is-success', position: 'is-bottom-left'});
      } else { // UPDATES THE CURRENT ACTIVE LAYOUT
        let index = layouts.findIndex(x => x.id === $ACTIVE_LAYOUT.id);

        let save_object = {
          id: $ACTIVE_LAYOUT.id,
          name: $TAG_NAME,
          icon: ($SLOTS['icon'][0] >= 0 ? $SLOTS['icon'][0] : 0),
          layout_string: (out + banktag)
        };

        layouts[index] = save_object;
        $LAYOUTS = JSON.stringify(layouts)
        $ACTIVE_LAYOUT = save_object;

        Toast.create({ message: 'Layout updated.', type: 'is-success', position: 'is-bottom-left'});
      }
		} catch (e) {
			Toast.create({ message: 'Error saving layout: ' + e.message, type: 'is-danger', position: 'is-bottom-left'});
		}
	}

  export const deleteLayout = async () => {
    let layouts = JSON.parse($LAYOUTS || "[]");
    let index = layouts.findIndex(x => x.id === $ACTIVE_LAYOUT.id);

    layouts.splice(index, 1);
    $LAYOUTS = JSON.stringify(layouts);
    $ACTIVE_LAYOUT = {};

    loadLayout({id: 0, name: '', icon: 0, layout_string: ''});
    $TAG_NAME = ''
    newLayout = true;
  }

</script>

<nav class="panel">
  <div>
    <p class="panel-heading">
      <span class='container'>
        <span class='columns is-vcentered is-mobile is-1 is-variable'>
          <span class='column'>Layouts</span>
          {#if newLayout == true && $ITEMS_IN_GRID} 
          <span class='column is-narrow'>
            <button class="button is-small is-sucess is-pulled-right is-vcentered" on:click={() => {saveLayout(true)}}>
                <a>Save</a>
            </button>
          </span>
          {/if}
          <span class='column is-narrow'>
            <button class="button is-small is-pulled-right is-vcentered" on:click={() => { $SLOTS.items.filter((x) => x != -1).length > 0 ? confirmationModalActive = true : createNewLayout(true) }}>
              <span class="icon is-small">
                <i class="fas fa-plus"></i>
              </span>
            </button>
          </span>
        </span>
      </span>
        </p>
  </div>

  {#each JSON.parse($LAYOUTS) as item, index}
    <a class='panel-block has-text-centered' on:click|preventDefault={() => loadLayout(item)}>
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
            <button class="button is-success" on:click|stopPropagation={() => saveLayout(false)}>
              <span class="icon is-small">
                <i class="fas fa-solid fa-check"></i>
              </span>
            </button>
          </div>
          <div class="column is-narrow">
            <button class="button is-danger" on:click|stopPropagation={() => deleteLayout()}>
              <span class="icon is-small">
                <i class="fas fa-solid fa-ban"></i>
              </span>
            </button>		
          </div>
          {/if}
        </div>
      </div>
  </a>
  {/each}
</nav>


<ModalCard bind:active={confirmationModalActive} title='Are you sure?' successName='Confirm' on:success={createNewLayout}>
	<span>The grid contains items, any unsaved changes will be discarded.</span>
</ModalCard>
