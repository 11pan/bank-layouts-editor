<script>
    export const GetIcon = (layout) => { 
		let icon = layout.substring(layout.indexOf('banktag:'));
		icon = icon.substring(icon.indexOf(",") + 1).split(",")[0];
		return icon;
	}

	export const GetName = (layout) => { return layout.substring(layout.indexOf(":") + 1).split(',')[0] };

	export const Titleize = s => s.replace(/^([a-z])/, (_, r) => r.toUpperCase())
</script>