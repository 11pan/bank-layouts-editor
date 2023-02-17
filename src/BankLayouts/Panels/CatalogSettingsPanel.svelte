<script>
	import { Field, Input, Icon } from 'svelma';
    import { SHOW_CATALOG_PANEL, VISIBLE_LAYOUT_CATALOG_ITEMS, VISIBLE_TAG_CATALOG_ITEMS, LAYOUT_CATALOG, TAG_CATALOG, ACTIVE_CATALOG_TAB } from "../Utility/stores";

    import Fuse from 'fuse.js';

    const layoutNameFuse = new Fuse(Object.values($LAYOUT_CATALOG), { keys: ['name', 'description'] });
    const catalogNameFuse = new Fuse(Object.values($TAG_CATALOG), { keys: ['name', 'description'] });
    
    let layoutCreatorFuse;
    let tagCreatorFuse;

    const updateVisibleCatalog = (result) => {
        if (!result) return;
        if ($ACTIVE_CATALOG_TAB == 1) {
            $VISIBLE_LAYOUT_CATALOG_ITEMS = [];
        
            for (let i = 0; i < result.length; i++) 
                $VISIBLE_LAYOUT_CATALOG_ITEMS.push(result[i].item)

        } else {
            $VISIBLE_TAG_CATALOG_ITEMS = [];
        
            for (let i = 0; i < result.length; i++) 
                $VISIBLE_TAG_CATALOG_ITEMS.push(result[i].item)
        }

        layoutCreatorFuse = null;
        tagCreatorFuse = null;
    }

    const nameSearch = text => { 
        if (text == "") {
            if (creatorSearchText != "") {
                creatorSearch(creatorSearchText)
            } else {
                $VISIBLE_LAYOUT_CATALOG_ITEMS = $LAYOUT_CATALOG
                $VISIBLE_TAG_CATALOG_ITEMS = $TAG_CATALOG
            }
        } else {
            updateVisibleCatalog(($ACTIVE_CATALOG_TAB == 1) ? layoutNameFuse.search(`=${text}`) : catalogNameFuse.search(`=${text}`))
        }
    }

    const creatorSearch = text => { 
        if (text == "") {
            if (nameSearchText != "")
                nameSearch(nameSearchText);
            else
                $VISIBLE_LAYOUT_CATALOG_ITEMS = $LAYOUT_CATALOG
        } else {
            if ($ACTIVE_CATALOG_TAB == 1) {
                layoutCreatorFuse = new Fuse($VISIBLE_LAYOUT_CATALOG_ITEMS == $LAYOUT_CATALOG ? Object.values($LAYOUT_CATALOG) : Object.values($VISIBLE_LAYOUT_CATALOG_ITEMS), { keys: ['creator'] });
                updateVisibleCatalog(layoutCreatorFuse.search(`=${text}`))
            } else {
                tagCreatorFuse = new Fuse($VISIBLE_TAG_CATALOG_ITEMS == $TAG_CATALOG ? Object.values($TAG_CATALOG) : Object.values($VISIBLE_TAG_CATALOG_ITEMS), { keys: ['creator'] });
                updateVisibleCatalog(tagCreatorFuse.search(`=${text}`))
            }
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
