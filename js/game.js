(() => {
  const configs = {
    odd: {
      name: "Odd If Cricket",
      rules: "1 wicket • hand-number cricket",
      wickets: 1,
      balls: null,
    },
    quick: {
      name: "Quick Cricket",
      rules: "5 wickets • 10 overs",
      wickets: 5,
      balls: 60,
    },
    real: {
      name: "Real Cricket",
      rules: "10 wickets • 20 overs",
      wickets: 10,
      balls: 120,
    },
  };
  const type = new URLSearchParams(location.search).get("game") || "quick";
  const cfg = configs[type] || configs.quick;
  const $ = (id) => document.getElementById(id);

  let score = 0,
    wickets = 0,
    balls = 0,
    target = null,
    innings = 1,
    gameOver = false;
  let userBats = false,
    computerBats = false,
    computerScore = 0,
    computerWickets = 0,
    computerBalls = 0;

  $("title").textContent = cfg.name;
  $("rules").textContent = cfg.rules;

  $("headsBtn").addEventListener("click", () => doToss("Heads"));
  $("tailsBtn").addEventListener("click", () => doToss("Tails"));
  $("batBtn").addEventListener("click", () => startMatch(true));
  $("bowlBtn").addEventListener("click", () => startMatch(false));

  function doToss(choice) {
    $("headsBtn").disabled = true;
    $("tailsBtn").disabled = true;
    const coin = Math.random() < 0.5 ? "Heads" : "Tails";
    const won = choice === coin;
    $("tossResult").textContent = `Coin landed on ${coin}. ${ won ? "You won the toss!" : "Computer won the toss." }`;
    if (won) {
      $("decision").classList.remove("hidden");
      $("batBtn").disabled = false;
      $("bowlBtn").disabled = false;
    } else {
      $("decision").classList.add("hidden");
      // Computer automatically chooses. No stuck screen.
      const compChoice = Math.random() < 0.5 ? "bat" : "bowl";
      setTimeout(() => startMatch(compChoice === "bowl"), 500);
    }
  }

  function startMatch(userWillBat) {
    userBats = userWillBat;
    computerBats = !userWillBat;
    $("toss").classList.add("hidden");
    $("match").classList.remove("hidden");
    gameOver = false;
    score = 0;
    wickets = 0;
    balls = 0;
    target = null;
    computerScore = 0;
    computerWickets = 0;
    computerBalls = 0;
    if (userBats) {
      $("message").textContent = "You are batting — choose your shot.";
      renderControls();
    } else {
      $("message").textContent = "Computer is batting. You are bowling.";
      renderBowlControls();
    }
    update();
  }

  function renderControls() {
    if (type === "odd") {
      $("controls").innerHTML = `<div class="buttons hands"> <button onclick="window.playOdd(1)">☝️<small>1 RUN</small></button> <button onclick="window.playOdd(2)">✌️<small>2 RUNS</small></button> <button onclick="window.playOdd(3)">🤟<small>3 RUNS</small></button> <button onclick="window.playOdd(4)">4️⃣<small>4 RUNS</small></button> <button onclick="window.playOdd(5)">🖐️<small>5 RUNS</small></button> <button onclick="window.playOdd(6)">👍<small>6 RUNS</small></button> <button onclick="window.playOdd(0)">✊<small>DEFENCE</small></button> </div>`;
    } else {
      $("controls").innerHTML = `<div class="buttons hands"> <button onclick="window.playShot(0)">DEFENCE</button> <button onclick="window.playShot(1)">1 RUN</button> <button onclick="window.playShot(2)">2 RUNS</button> <button onclick="window.playShot(3)">3 RUNS</button> <button onclick="window.playShot(4)">4 RUNS</button> <button onclick="window.playShot(6)">6 RUNS</button> </div>`;
    }
  }

  function renderBowlControls() {
    $("controls").innerHTML = `<div class="buttons hands"> <button onclick="window.bowl(0)">DOT BALL</button> <button onclick="window.bowl(1)">1 RUN</button> <button onclick="window.bowl(2)">2 RUNS</button> <button onclick="window.bowl(3)">3 RUNS</button> <button onclick="window.bowl(4)">4 RUNS</button> <button onclick="window.bowl(6)">6 RUNS</button> <button onclick="window.bowlWicket()">🎯 WICKET</button> </div>`;
  }

  window.playShot = function (r) {
    if (gameOver || !userBats) return;
    balls++;
    if (Math.random() < 0.12) {
      wickets++;
      $("message").textContent = "Wicket!";
    } else {
      $("message").textContent =
        r === 0 ? "Defence." : `${r} run${r > 1 ? "s" : ""}!`;
      score += r;
    }
    update();
    checkUserInnings();
  };

  window.playOdd = function (r) {
    if (gameOver || !userBats) return;
    balls++;
    const computerHand = Math.floor(Math.random() * 6) + 1;
    if (r !== 0 && r === computerHand) {
      wickets = 1;
      $("message").textContent = `OUT! Computer chose ${computerHand}.`;
    } else {
      score += r;
      $("message").textContent =
        r === 0
          ? `Defence. Computer chose ${computerHand}.`
          : `${r} run${r > 1 ? "s" : ""}. Computer chose ${computerHand}.`;
    }
    update();
    checkUserInnings();
  };

  window.bowl = function (run) {
    if (gameOver || !computerBats) return;
    computerBalls++;
    const actual = Math.random() < 0.13 ? 0 : run;
    computerScore += actual;
    $("message").textContent =
      actual === 0
        ? "Dot ball."
        : `Computer scored ${actual} run${actual > 1 ? "s" : ""}.`;
    if (cfg.balls !== null && computerBalls >= cfg.balls) endComputerInnings();
    else if (computerScore > 0 && Math.random() < 0.08) {
      computerWickets++;
      if (computerWickets >= cfg.wickets) endComputerInnings();
    }
    updateComputer();
  };

  window.bowlWicket = function () {
    if (gameOver || !computerBats) return;
    computerBalls++;
    computerWickets++;
    $("message").textContent = "WICKET! 🎯";
    if (
      computerWickets >= cfg.wickets ||
      (cfg.balls !== null && computerBalls >= cfg.balls)
    )
      endComputerInnings();
    updateComputer();
  };

  function checkUserInnings() {
    if (wickets >= cfg.wickets || (cfg.balls !== null && balls >= cfg.balls)) {
      target = score + 1;
      endUserInnings();
    }
  }

  function endUserInnings() {
    gameOver = true;
    target = score + 1;
    update();
    if (type === "odd") {
      $("message").textContent = `You're out! Final score ${score}/${wickets}.`;
      return;
    }
    // Start computer chase automatically.
    gameOver = false;
    computerBats = true;
    userBats = false;
    computerScore = 0;
    computerWickets = 0;
    computerBalls = 0;
    $(
      "message"
    ).textContent = `Your innings ended at ${score}/${wickets}. Computer needs ${target}.`;
    renderBowlControls();
    update();
  }

  function endComputerInnings() {
    gameOver = true;
    updateComputer();
    if (computerScore >= target)
      $(
        "message"
      ).textContent = `Computer won! ${computerScore}/${computerWickets} chased ${target}.`;
    else
      $(
        "message"
      ).textContent = `You won! Computer scored ${computerScore}/${computerWickets}.`;
  }

  function update() {
    $("score").textContent = userBats
      ? `${score}/${wickets}`
      : `${computerScore}/${computerWickets}`;
    $("overs").textContent =
      cfg.balls === null
        ? userBats
          ? balls
          : computerBalls
        : `${Math.floor((userBats ? balls : computerBalls) / 6)}.${ (userBats ? balls : computerBalls) % 6 }`;
    $("target").textContent = target === null ? "—" : target;
  }
  function updateComputer() {
    update();
  }
  update();
})();