<script>
    const facts = [
        "Dropping a gold ring in the wilderness volcano spawns Gollum from LOTR.",
        "Abyssal whip is the spine of an Abyssal demon.",
        `If you use a herring on a tree, you'll get a reference to Monty Python and the Holy Grail. - "This is not the mightiest tree in the forest."`,
        "Mod Jed sold IPs to RoT, a pking clan.",
        "There are meant to be a bunch of crows in Tirannwn and Zeah, but due to a copy-paste mistake, they all end up teleporting to the Lumbridge cow field a few seconds after the server restarts.",
        "OTB will never get a phoenix.",
    ];

</script>

<div class="center-screen">
    <div class="container">
        <img src="media/todt.gif" alt="todt.gif"/>
        <h1>Loading resources...</h1>
        <small>If this takes too long, something probably broke</small>
        <div class="fun-fact-container">
            <h1>Did you know?</h1>
            <br/>
            <h2 style="padding-left: 30px; padding-right: 30px;">{facts[Math.floor(Math.random() * facts.length)]}</h2>
        </div>
    </div>
</div>

<style>
    .center-screen {
        display: flex;
        align-items: center;
        text-align: center;
        min-height: 100vh;
    }

    .container {
        display: block;
        border: 2px solid #343c3d;
        background-color: #282f2f;
        max-width: 500px;
        height: 500px;
    }

    .fun-fact-container {
        padding-top: 50px;
    }
</style>