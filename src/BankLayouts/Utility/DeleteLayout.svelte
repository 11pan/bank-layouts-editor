<script>
    import { TAG_NAME, LAYOUTS, ACTIVE_LAYOUT } from '../Utility/stores.js'

    import LoadLayout from "../Utility/LoadLayout.svelte"
    let loadLayoutComponent;

    export const DeleteLayout = async () => {
        let layouts = JSON.parse($LAYOUTS || "[]");
        let index = layouts.findIndex(x => x.id === $ACTIVE_LAYOUT.id);

        layouts.splice(index, 1);
        $LAYOUTS = JSON.stringify(layouts);
        $ACTIVE_LAYOUT = {};

        loadLayoutComponent.LoadLayout("");
        $TAG_NAME = ''
    }

</script>

<LoadLayout bind:this={loadLayoutComponent}/>
