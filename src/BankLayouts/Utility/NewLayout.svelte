<script>
    import { LAYOUTS, ACTIVE_LAYOUT } from './stores.js'

	import LoadLayout from "./LoadLayout.svelte"
	let loadLayoutComponent;

    export const CreateNewLayout = async (confirmed) => {
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
        $ACTIVE_LAYOUT = save_object
        loadLayoutComponent.LoadLayout(save_object.layout_string);
      }
    }
</script>

<LoadLayout bind:this={loadLayoutComponent}/>
