<script>
	import { fragments, sets } from '../Data/FragmentData.js';
	import { Switch, Button, Icon } from 'svelma';

	import GLPK from 'glpk.js';

	let glpk;
	GLPK().then((x) => { glpk = x; });

	var allFragments = [];
	for (const [key, value] of Object.entries(fragments)) {
		value.forEach((x) => { x.unshift(allFragments.length); allFragments.push(x); })
	}

	var allSets = [];
	var nameToSet = {};
	for (const [key, value] of Object.entries(sets)) {
		value.forEach((x) => { x.id = allSets.length; allSets.push(x); nameToSet[x.name] = x; })
	}

	
	let checked = new Array(allFragments.length);
	checked.fill(false);

	
	let setsChecked = new Array(allSets.length).fill(false);
	let setsAlt = new Array(allSets.length).fill(false);
	

	let maxNumSolns = 100;
	let maxFrags = 7;
	let fragsChecked = 0;

	$: fragsChecked = checked.reduce((x, a) => x + (a ? 1 : 0), 0);

	let solutions = [];


	let calculate = (e, round) => {
		if (round === undefined) {
			solutions = [];
			round = [];
		} else if (round.length > maxNumSolns-1)
			return;
		
		const options = {
			msglev: glpk.GLP_MSG_NONE,
			presol: true,
		};

		var vars = [];
		for (var j = 0; j < allFragments.length; j++)
			vars.push(j + '');

		var total_constraint_vars = [];
		for (var i = 0; i < vars.length; i++)
			total_constraint_vars.push({ name: vars[i], coef: 1 });

		var set_constraints = [ { name: 'total', vars: total_constraint_vars, bnds: { type: glpk.GLP_UP, ub: maxFrags, lb: 0 } } ];


		for (var i = 0; i < allSets.length; i++) {
			if (setsChecked[i]) {
				var set_vars = [];

				for (var j = 0; j < allFragments.length; j++)
					if (allFragments[j].includes(allSets[i].name))
						set_vars.push({ name: vars[j], coef: 1 });

				set_constraints.push({ name: allSets[i].name + '1', vars: set_vars, bnds: { type: glpk.GLP_LO, ub: maxFrags, lb: (setsAlt[i] ? allSets[i].alt : allSets[i].req) } })
			}
		}

		for (var i = 0; i < allFragments.length; i++)
			if (checked[i])
				set_constraints.push( { name: allFragments[i][1], vars: [ { name: vars[i], coef: 1 } ], bnds: { type: glpk.GLP_LO, ub: maxFrags, lb: 1 } } );

		set_constraints = set_constraints.concat(round);

		const res = glpk.solve({
			name: 'LP',
			objective: { direction: glpk.GLP_MIN, name: 'total', vars: total_constraint_vars },
			subjectTo: set_constraints,
			binaries: vars
		}, options);

		res.then((x) => {
			var result = x.result;

			if (result.status == glpk.GLP_OPT) {
				var soln = [];
				var counts = {};

				var add = (x) => {
					if (x in counts) counts[x] += 1;
					else counts[x] = 1;
				}

				for (var i = 0; i < allFragments.length; i++)
					if (result.vars[i] == 1) {
						soln.push(allFragments[i][1]);
					
						add(allFragments[i][2]);
						add(allFragments[i][3]);
					}

				var sets = [];
				var alts = [];
				for (const [set, cnt] of Object.entries(counts))
					if (cnt >= nameToSet[set].req)
						sets.push([set, cnt]);
					else if (nameToSet[set].alt != 0 && cnt >= nameToSet[set].alt)
						alts.push([set, cnt]);
				
				sets.sort();
				alts.sort();

				sets = sets.concat(alts);
				

						
				solutions = [...solutions, [sets, ...soln]];

				// Add our constraint and go again
				var constraint_vars = [];
				for (var i = 0; i < allFragments.length; i++)
					if (result.vars[i] == 1)
						constraint_vars.push({ name: vars[i], coef: 1 });

				round = [...round, { name: 'round' + round.length, vars: constraint_vars, bnds: { type: glpk.GLP_UP, ub: soln.length-1, lb: 0 } }];

				calculate(e, round);
			}
		});
	}

</script>

<section class="section">
	<div class="container">
		<h1 class="title"> Fragment Solver </h1>
		<p class="subtitle"> Solve set effects for the <strong>Leagues 3: Shattered Relics</strong>  </p>

		<div class="section">
			<h2 class='title is-2 has-text-centered'> Fragments </h2>
			<p class="subtitle has-text-centered"> Select required Fragments </p>
			<div class='columns is-centered' id='fragments'>
				{#each Object.entries(fragments) as fragmentGroup, groupIdx}
					<div class='column is-3'>
						<h4 class='title is-3'>{fragmentGroup[0]}</h4>

						{#each fragmentGroup[1] as fragment, fragIdx}
							<Switch disabled={fragsChecked >= maxFrags && !checked[fragment[0]]} bind:checked={checked[fragment[0]]} on:click={() => { console.log('test'); }}>{fragment[1]}</Switch>
							<br />
						{/each}
					</div>
				{/each}
			</div>
		</div>
		

		<div class="section">
			<h2 class='title is-2 has-text-centered'> Set Effects </h2>
			<p class="subtitle has-text-centered"> Select your desired Set Effects </p>
			<div class='columns is-centered' id='sets'>
				{#each Object.entries(sets) as setGroup, groupIdx}
					<div class='column is-3'>
						<h4 class='title is-4'>{setGroup[0]}</h4>

						{#each setGroup[1] as set, fragIdx}
							<Switch bind:checked={setsChecked[set.id]}>{set.name}</Switch>
							{#if setsChecked[set.id] && set.alt > 0}
								{#if setsAlt[set.id]}
									<a style='vertical-align: text-top;' on:click={(e) => { setsAlt[set.id] = false; }}>Partial</a>
								{:else}
									<a style='vertical-align: text-top;' on:click={(e) => { setsAlt[set.id] = true; }}>Full</a>
								{/if}
							{/if}
							<br />
						{/each}
					</div>
				{/each}
			</div>
		</div>

		<div class="section">
			<div class="container has-text-centered">
				<Button type='is-primary' on:click={calculate}> Solve </Button>
			</div>
		</div>
		
		<div class="section">
			<h2 class='title is-2 has-text-centered'> Solution </h2>
			<p class="subtitle has-text-centered"> Your Answer (if there is one) </p>

			<table class='table is-fullwidth'>
				<tbody>
					{#each solutions as solution}
						<tr>
							{#each solution as frag, idx}
								<td>
									{#if idx == 0}
										{#each frag as set}
											<span class='tag is-link {set[1] == nameToSet[set[0]].alt ? "is-light" : ""}'>{set[0]}</span>&nbsp;
										{/each}
									{:else}
										{frag}
									{/if}
								</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>


	</div>
</section>
