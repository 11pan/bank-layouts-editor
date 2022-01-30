export let fragments = {
	"Combat": [
		["Arcane Conduit", "Endless Knowledge", "Trailblazer"],
		["Bottomless Quiver", "Knife's Edge", "Trailblazer"],
		["Tactical Duelist", "Twin Strikes", "Absolute Unit"],
		
		["Armadylean Decree", "Double Tap", "Absolute Unit"],
		["Bandosian Might", "Twin Strikes", "Fast Metabolism"],
		["Divine Restoration", "Absolute Unit", "Twin Strikes"],
		["Larger Recharger", "Fast Metabolism", "Drakan's Touch"],
		["Livin' On A Prayer", "Knife's Edge", "Twin Strikes"],
		["Praying Respects", "Knife's Edge", "Drakan's Touch"],
		["Saradominist Defence", "Absolute Unit", "Knife's Edge"],
		["Slay 'n' Pay", "Twin Strikes", "Last Recall"],
		["Slay All Day", "Knife's Edge", "The Alchemist"],
		["Special Discount", "Twin Strikes", "Drakan's Touch"],
		["Superior Tracking", "Last Recall", "Absolute Unit"],
		["Thrall Damage", "Chain Magic", "Endless Knowledge"],
		["Unholy Ranger", "Double Tap", "Drakan's Touch"],
		["Unholy Warrior", "Knife's Edge", "Trailblazer"],
		["Unholy Wizard", "Chain Magic", "Drakan's Touch"],
		["Venomaster", "Fast Metabolism", "Absolute Unit"],
		["Zamorakian Sight", "Chain Magic", "Drakan's Touch"]
	],

	"Skilling": [
		["Alchemaniac", "Endless Knowledge", "Personal Banker"],
		["Catch Of The Day", "Personal Banker", "Unchained Talent"],
		["Certified Farmer", "Greedy Gatherer", "The Alchemist"],
		["Chef's Catch", "Greedy Gatherer", "Trailblazer"],
		["Chinchonkers", "Double Tap", "Last Recall"],
		["Deeper Pockets", "Chain Magic", "Personal Banker"],
		["Dine & Dash", "The Alchemist", "Unchained Talent"],
		["Dragon On A Bit", "The Craftsman", "Absolute Unit"],
		["Enchanted Jeweler", "Last Recall", "Endless Knowledge"],
		["Golden Brick Road", "The Alchemist", "Trailblazer"],
		["Grave Robber", "Fast Metabolism", "The Craftsman"],
		["Homewrecker", "The Alchemist", "Last Recall"],
		["Imcando's Apprentice", "The Craftsman", "Chain Magic"],
		["Just Druid!", "The Alchemist", "Greedy Gatherer"],
		["Mixologist", "The Alchemist", "Unchained Talent"],
		["Molten Miner", "Greedy Gatherer", "Personal Banker"],
		["Plank Stretcher", "Unchained Talent", "Endless Knowledge"],
		["Pro Tips", "The Craftsman", "Double Tap"],
		["Profletchional", "The Craftsman", "Last Recall"],
		["Rock Solid", "Greedy Gatherer", "Fast Metabolism"],
		["Rooty Tooty 2x Runeys", "Last Recall", "Chain Magic"],
		["Rumple-Bow-String", "The Craftsman", "Double Tap"],
		["Rune Escape", "Last Recall", "Absolute Unit"],
		["Seedy Business", "Personal Banker", "Trailblazer"],
		["Slash & Burn", "Greedy Gatherer", "Unchained Talent"],
		["Smithing Double", "Personal Banker", "Double Tap"],
		["Smooth Criminal", "Trailblazer", "Last Recall"]
	],

	"Other": [
		["Barbarian Pest Wars", "Twin Strikes", "Knife's Edge"],
		["Mother's Magic Fossils", "Chain Magic", "Endless Knowledge"],
		["Rogues' Chompy Farm", "Double Tap", "Unchained Talent"]
		["Clued In", "Last Recall", "Drakan's Touch"],
		["Hot On The Trail", "Fast Metabolism", "Chain Magic"],
		["Message In A Bottle", "Knife's Edge", "Greedy Gatherer"]
	]
}



export let sets = {
	"Combat": [
		{ req: 3, alt:2, name: "Absolute Unit"}, 
		{ req: 3, alt:2, name: "Drakan's Touch"},
		{ req: 2, alt:0, name: "Fast Metabolism"},
		{ req: 3, alt:2, name: "Knife's Edge"},
		{ req: 3, alt:2, name: "Twin Strikes"},	
		{ req: 3, alt:2, name: "Chain Magic"},
		{ req: 3, alt:2, name: "Double Tap"},
	],

	"Utility": [
		{ req: 3, alt:0, name: "Endless Knowledge"},
		{ req: 4, alt:0, name: "Last Recall"},
		{ req: 3, alt:0, name: "Trailblazer"},
		{ req: 3, alt:0, name: "Unchained Talent"},
	],

	"Skilling": [
		{ req: 3, alt:0, name: "The Alchemist"},
		{ req: 3, alt:0, name: "The Craftsman"},
		{ req: 3, alt:2, name: "Greedy Gatherer"},
		{ req: 3, alt:2, name: "Personal Banker"},
	]
}
