(() => {
  const PLAYERS = {
    "Top-Order Batsmen": [
      "Virat Kohli",
      "Rohit Sharma",
      "Chris Gayle",
      "David Warner",
      "Shikhar Dhawan",
      "Gautam Gambhir",
      "Shubman Gill",
      "Abhishek Sharma",
      "Ruturaj Gaikwad",
      "Yashasvi Jaiswal",
      "Travis Head",
      "Sai Sudharsan",
    ],
    "Middle-Order Batsmen": [
      "AB de Villiers",
      "Suryakumar Yadav",
      "Shreyas Iyer",
      "Tilak Varma",
      "Rinku Singh",
    ],
    "Wicket-Keepers": [
      "MS Dhoni",
      "KL Rahul",
      "Jos Buttler",
      "Nicholas Pooran",
      "Heinrich Klaasen",
      "Rishabh Pant",
      "Sanju Samson",
      "Robin Uthappa",
      "Ambati Rayudu",
      "Dinesh Karthik",
      "Ishan Kishan",
    ],
    "All-Rounders": [
      "Suresh Raina",
      "Sunil Narine",
      "Shane Watson",
      "Andre Russell",
      "Ravindra Jadeja",
      "Hardik Pandya",
      "Dwayne Bravo",
      "Axar Patel",
      "Yuvraj Singh",
      "Krunal Pandya",
      "Rashid Khan",
      "Kieron Pollard",
      "Ravichander Ashwin",
      "Ben Stokes",
    ],
    Bowlers: [
      "Lasith Malinga",
      "Jasprit Bumrah",
      "Yuzvendra Chahal",
      "Bhuvneshwar Kumar",
      "Amit Mishra",
      "Piyush Chawla",
      "Harbhajan Singh",
      "Kagiso Rabada",
      "Trent Boult",
      "Harshal Patel",
      "Sandeep Sharma",
      "Mohammed Siraj",
      "Mohammed Shami",
      "Dale Styne",
    ],
  };
  const TEAM_LIST = [
    "Chennai Super Kings",
    "Delhi Capitals",
    "Gujarat Titans",
    "Kolkata Knight Riders",
    "Lucknow Super Giants",
    "Mumbai Indians",
    "Punjab Kings",
    "Rajasthan Royals",
    "Royal Challengers Bengaluru",
    "Sunrisers Hyderabad",
  ];
  const CORE = [
    "Mumbai Indians",
    "Royal Challengers Bengaluru",
    "Chennai Super Kings",
  ];
  const GT = "Gujarat Titans";
  const $ = (id) => document.getElementById(id);

  let userTeam = "",
    purse = 120,
    index = 0;
  let squads = {},
    boughtCount = 0;
  const order = Object.entries(PLAYERS).flatMap(([cat, names]) =>
    names.map((name) => ({ cat, name }))
  );

  const teamSelect = $("teamSelect"),
    auction = $("auction"),
    summary = $("summary");
  const teamBox = $("teams");

  TEAM_LIST.forEach((team) => {
    const btn = document.createElement("button");
    btn.className = "team";
    btn.textContent = team;
    btn.addEventListener("click", () => selectTeam(team));
    teamBox.appendChild(btn);
  });

  function opponentsFor(team) {
    return CORE.includes(team)
      ? CORE.filter((x) => x !== team).concat(GT)
      : CORE.slice();
  }

  function selectTeam(team) {
    userTeam = team;
    purse = 120;
    index = 0;
    boughtCount = 0;
    squads = {};
    const opponents = opponentsFor(team);
    squads[team] = [];
    opponents.forEach((t) => (squads[t] = []));
    $("teamName").textContent = team;
    $("purse").textContent = purse;
    $("count").textContent = 0;
    $("opponents").textContent = opponents.join(" • ");
    teamSelect.classList.add("hidden");
    auction.classList.remove("hidden");
    bindAuctionButtons();
    showPlayer();
  }

  function bindAuctionButtons() {
    $("bid1").onclick = () => buy(1);
    $("bid2").onclick = () => buy(2);
    $("bid5").onclick = () => buy(5);
    $("bid10").onclick = () => buy(10);
    $("skip").onclick = skip;
  }

  function showPlayer() {
    if (index >= order.length) {
      finish();
      return;
    }
    const p = order[index];
    $("category").textContent = p.cat;
    $("player").textContent = p.name;
    $("number").textContent = `Player ${index + 1} of ${order.length}`;
    $("result").textContent = "Choose a bid or Skip.";
  }

  function buy(price) {
    if (purse < price) {
      $(
        "result"
      ).textContent = `You only have ₹${purse} Cr left. Choose a lower bid or Skip.`;
      return;
    }
    const p = order[index];
    purse -= price;
    boughtCount++;
    squads[userTeam].push({ ...p, price });
    $("purse").textContent = purse;
    $("count").textContent = boughtCount;
    $("result").textContent = `You bought ${p.name} for ₹${price} Cr.`;
    computerBids(p);
    next();
  }

  function skip() {
    const p = order[index];
    $("result").textContent = `You skipped ${p.name}.`;
    computerBids(p);
    next();
  }

  function computerBids(p) {
    opponentsFor(userTeam).forEach((team) => {
      // Computer sometimes buys a player; price is one of the exact allowed bids.
      if (Math.random() < 0.38) {
        const price = [1, 2, 5, 10][Math.floor(Math.random() * 4)];
        squads[team].push({ ...p, price });
      }
    });
  }

  function next() {
    index++;
    setTimeout(showPlayer, 250);
  }

  function finish() {
    auction.classList.add("hidden");
    summary.classList.remove("hidden");
    $(
      "summaryIntro"
    ).textContent = `Your team: ${userTeam} • Remaining purse: ₹${purse} Cr. Every player below shows the price paid.`;
    const all = opponentsFor(userTeam).concat(userTeam);
    $("allTeams").innerHTML = all.map(renderTeam).join("");
  }

  function renderTeam(team) {
    let html = `<div class="team-summary"><h2>${team}</h2>`;
    let has = false;
    Object.keys(PLAYERS).forEach((cat) => {
      const arr = (squads[team] || []).filter((x) => x.cat === cat);
      if (arr.length) {
        has = true;
        html += `<div class="cat-block"><h3>${cat}</h3><div class="chips">`;
        arr.forEach(
          (x) =>
            (html += `<span class="chip">${x.name} — ₹${x.price} Cr</span>`)
        );
        html += "</div></div>";
      }
    });
    if (!has) html += "<p class='empty'>No players bought.</p>";
    return html + "</div>";
  }

  $("newAuction").addEventListener("click", () => location.reload());
})();