// =====================================
// Total Battle Calculator V4
// Part 3 - Settings & Startup
// =====================================


// ---------- CONSTANTS ----------

const SETTINGS = {

    DEFAULT_S8_MULTIPLIER: 1.008,

    TIER_MULTIPLIER: 1.81,

    OFFSETS: {

        Spearman:3,

        Archer:0,

        Rider:1,

        Flying:-1

    },

    MONSTERS:{

        M8_DIVISOR:6.3,

        M9_DIVISOR:1.85,

        M7_MULTIPLIER:2.21

    }

};


// ---------- ELEMENTS ----------

const leadershipInput =
    document.getElementById("leadership");

const multiplierInput =
    document.getElementById("s8Multiplier");

const calculateButton =
    document.getElementById("calculateButton");

const saveButton =
    document.getElementById("saveButton");

const resetButton =
    document.getElementById("resetButton");

const results =
    document.getElementById("results");


// ---------- LOAD SETTINGS ----------

function loadSettings(){

    const saved =
        localStorage.getItem("s8Multiplier");

    if(saved){

        multiplierInput.value = saved;

    }else{

        multiplierInput.value =
            SETTINGS.DEFAULT_S8_MULTIPLIER;

    }

}


// ---------- SAVE SETTINGS ----------

function saveSettings(){

    localStorage.setItem(

        "s8Multiplier",

        multiplierInput.value

    );

    alert("Default multiplier saved!");

}


// ---------- RESET SETTINGS ----------

function resetSettings(){

    multiplierInput.value =
        SETTINGS.DEFAULT_S8_MULTIPLIER;

    localStorage.removeItem(
        "s8Multiplier"
    );

    alert("Multiplier reset.");

}


// =====================================
// Part 4 - Tier Calculator
// =====================================


// ---------- CALCULATE BASE ----------

function getBaseLeadership(totalLeadership, s8Multiplier){

    const totalWeight =
        1 +
        s8Multiplier +
        SETTINGS.TIER_MULTIPLIER +
        (SETTINGS.TIER_MULTIPLIER * s8Multiplier)+
        Math.pow(SETTINGS.TIER_MULTIPLIER, 2);

    return totalLeadership / totalWeight;

}


// ---------- CALCULATE TIERS ----------

function calculateTierLeadership(base, s8Multiplier){

    return {

        G9: Math.floor(base),


        G8: Math.floor(
            base *
            SETTINGS.TIER_MULTIPLIER
        ),

        S8: Math.floor(
            base *
            SETTINGS.TIER_MULTIPLIER *
            s8Multiplier
        ),
        
        G7: Math.floor(
			base *
			Math.pow(SETTINGS.TIER_MULTIPLIER, 2)
		)

    };

}

// =====================================
// Part 5 - Split Tier
// =====================================

function splitTier(leadership){

    // Divide leadership evenly

    const perType =
        Math.floor(
            leadership / 4
        );

    let spear =
        perType + SETTINGS.OFFSETS.Spearman;

    let archer =
        perType + SETTINGS.OFFSETS.Archer;

    let rider =
        Math.floor(
            perType / 2
        ) + SETTINGS.OFFSETS.Rider;

    let flying =
        Math.floor(
            perType / 20
        ) + SETTINGS.OFFSETS.Flying;

    return {

        leadership,

        spear,

        archer,

        rider,

        flying

    };

}

// ---------- MAIN CALCULATE ----------

function calculate(){

    const totalLeadership =
        Number(
            leadershipInput.value
        );

    const s8Multiplier =
        Number(
            multiplierInput.value
        );

    if(totalLeadership <= 0){

        alert("Enter a leadership value.");

        return;

    }

    const base =
        getBaseLeadership(
            totalLeadership,
            s8Multiplier
        );

    const tiers =
        calculateTierLeadership(
            base,
            s8Multiplier
        );
        
    const stacks = {

		G9: splitTier(tiers.G9),

		G8: splitTier(tiers.G8),

		S8: splitTier(tiers.S8),
		
		G7: splitTier(tiers.G7)

		};
		
	const monsters = {

		M8: Math.floor(

			stacks.G9.flying /

			SETTINGS.MONSTERS.M8_DIVISOR

		)

		};

	monsters.M9 = Math.floor(

		monsters.M8 /

		SETTINGS.MONSTERS.M9_DIVISOR

		);

	monsters.M7 = Math.floor(

		monsters.M8 *

		SETTINGS.MONSTERS.M7_MULTIPLIER

		);



results.innerHTML = `

<h2>Stack Calculator</h2>

<table>

<tr>

<th>Tier</th>

<th>Leadership</th>

<th>Spearman</th>

<th>Archer</th>

<th>Rider</th>

<th>Flying</th>

</tr>

${Object.entries(stacks).map(([tier,data])=>`

<tr>

<td>${tier}</td>

<td>${data.leadership.toLocaleString()}</td>

<td>${data.spear.toLocaleString()}</td>

<td>${data.archer.toLocaleString()}</td>

<td>${data.rider.toLocaleString()}</td>

<td>${data.flying.toLocaleString()}</td>

</tr>

`).join("")}

</table>

<br><br>

<h2>Monster Stacks</h2>

<table>

<tr>

<th>Tier</th>

<th>Units</th>

</tr>

<tr>

<td>M9</td>

<td>${monsters.M9.toLocaleString()}</td>

</tr>

<tr>

<td>M8</td>

<td>${monsters.M8.toLocaleString()}</td>

</tr>

<tr>

<td>M7</td>

<td>${monsters.M7.toLocaleString()}</td>

</tr>

</table>

`;
}

// ---------- EVENTS ----------

calculateButton.addEventListener(

    "click",

    calculate

);

saveButton.addEventListener(

    "click",

    saveSettings

);

resetButton.addEventListener(

    "click",

    resetSettings

);


// ---------- START ----------

loadSettings();

