<script>
	import { Field, Input, Icon } from 'svelma';
    import { SHOW_CATALOG_PANEL, VISIBLE_CATALOG_ITEMS, CATALOG } from "../Utility/stores";

    import Fuse from 'fuse.js';

    const nameFuse = new Fuse(Object.values($CATALOG), { keys: ['name', 'description'] });
    let creatorFuse;

    const updateVisibleCatalog = (result) => {
        if (!result) return;
        $VISIBLE_CATALOG_ITEMS = [];
        
        for (let i = 0; i < result.length; i++) 
            $VISIBLE_CATALOG_ITEMS.push(result[i].item)

        creatorFuse = null;
    }

    const nameSearch = text => { 
        if (text == "") {
            if (creatorSearchText != "")
                creatorSearch(creatorSearchText)
            else
                $VISIBLE_CATALOG_ITEMS = $CATALOG
        } else {
            updateVisibleCatalog(nameFuse.search(`=${text}`))
        }
    }

    const creatorSearch = text => { 
        if (text == "") {
            if (nameSearchText != "")
                nameSearch(nameSearchText);
            else
                $VISIBLE_CATALOG_ITEMS = $CATALOG
        } else {
            creatorFuse = new Fuse($VISIBLE_CATALOG_ITEMS == $CATALOG ? Object.values($CATALOG) : Object.values($VISIBLE_CATALOG_ITEMS), { keys: ['creator'] });
            updateVisibleCatalog(creatorFuse.search(`=${text}`))
        }
    }

    let nameSearchText = "";
    $: nameSearch(nameSearchText);

    let creatorSearchText = "";
    $: creatorSearch(creatorSearchText);

</script>

<div class='card'>
	<div class='card-content'>
		<div class='columns is-mobile'>
			<div class="align">
                <h1 class="title">Search</h1>
                <Field label="Name & Description">
                    <Input bind:value={nameSearchText} placeholder="" />
                </Field>
                    
                <Field label="Creator">
                    <Input bind:value={creatorSearchText} placeholder=""/>
                </Field>
			</div>
            <br>
		</div>
	</div>
	<div class='card-footer'>
		<a href={null} on:click={() => { $SHOW_CATALOG_PANEL = !$SHOW_CATALOG_PANEL}} class='card-footer-item'><Icon pack="fas" icon="backward" />&nbsp; Return</a>

	</div>
</div>

<style>
    .align {
        padding-left: 15%;
        margin-bottom: 10px;
    }

    .title {
        font-weight: bold;
        text-align: center;
    }
</style>
