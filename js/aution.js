const PLAYERS={
"Top-Order Batsmen":["Virat Kohli","Rohit Sharma","Chris Gayle","David Warner","Shikhar Dhawan","Gautam Gambhir","Shubman Gill","Abhishek Sharma","Ruturaj Gaikwad","Yashasvi Jaiswal","Travis Head","Sai Sudharsan"],
"Middle-Order Batsmen":["AB de Villiers","Suryakumar Yadav","Shreyas Iyer","Tilak Varma","Rinku Singh"],
"Wicket-Keepers":["MS Dhoni","KL Rahul","Jos Buttler","Nicholas Pooran","Heinrich Klaasen","Rishabh Pant","Sanju Samson","Robin Uthappa","Ambati Rayudu","Dinesh Karthik","Ishan Kishan"],
"All-Rounders":["Suresh Raina","Sunil Narine","Shane Watson","Andre Russell","Ravindra Jadeja","Hardik Pandya","Dwayne Bravo","Axar Patel","Yuvraj Singh","Krunal Pandya","Rashid Khan","Kieron Pollard","Ravichander Ashwin","Ben Stokes"],
"Bowlers":["Lasith Malinga","Jasprit Bumrah","Yuzvendra Chahal","Bhuvneshwar Kumar","Amit Mishra","Piyush Chawla","Harbhajan Singh","Kagiso Rabada","Trent Boult","Harshal Patel","Sandeep Sharma","Mohammed Siraj","Mohammed Shami","Dale Styne"]};
const TEAMS=["Chennai Super Kings","Delhi Capitals","Gujarat Titans","Kolkata Knight Riders","Lucknow Super Giants","Mumbai Indians","Punjab Kings","Rajasthan Royals","Royal Challengers Bengaluru","Sunrisers Hyderabad"];
const CORE=["Mumbai Indians","Royal Challengers Bengaluru","Chennai Super Kings"],GT="Gujarat Titans";
let userTeam="",purse=120,index=0,bought=[],squads={};
const order=Object.entries(PLAYERS).flatMap(([cat,names])=>names.map(name=>({cat,name})));
teams.innerHTML=TEAMS.map(t=>`<button class="team" onclick='selectTeam(${JSON.stringify(t)})'>${t}</button>`).join("");
function opponents(t){return CORE.includes(t)?CORE.filter(x=>x!==t).concat(GT):CORE}
function selectTeam(t){userTeam=t;purse=120;index=0;bought=[];squads={};teamSelect.classList.add("hidden");auction.classList.remove("hidden");teamName.textContent=t;const opp=opponents(t);document.getElementById("opponentList").textContent=opp.join(" • ");squads[t]=[];opp.forEach(x=>squads[x]=[]);show()}
function show(){if(index>=order.length)return finish();const p=order[index];category.textContent=p.cat;player.textContent=p.name;number.textContent=`Player ${index+1} of ${order.length}`;result.textContent="Choose ₹1 Cr, ₹2 Cr, ₹5 Cr, ₹10 Cr or Skip."}
function bid(price){if(purse<price)return result.textContent="Not enough purse.";const p=order[index];purse-=price;bought.push({...p,price});squads[userTeam].push({...p,price});document.getElementById("purse").textContent=purse;count.textContent=bought.length;result.textContent=`Bought ${p.name} for ₹${price} Cr.`;computerBid(p);index++;setTimeout(show,350)}
function skip(){const p=order[index];result.textContent=`Skipped ${p.name}.`;computerBid(p);index++;setTimeout(show,300)}
function computerBid(p){opponents(userTeam).forEach(t=>{if(Math.random()<0.28){const price=[1,2,5,10][Math.floor(Math.random()*4)];squads[t].push({...p,price})}})}
function renderTeam(t){let html=`<div class="team-summary"><h2>${t}</h2>`;Object.keys(PLAYERS).forEach(cat=>{const arr=squads[t].filter(x=>x.cat===cat);if(arr.length)html+=`<div class="cat-block"><h3>${cat}</h3><div class="chips">${arr.map(x=>`<span class="chip">${x.name} — ₹${x.price} Cr</span>`).join("")}</div></div>`});if(!Object.keys(PLAYERS).some(cat=>squads[t].some(x=>x.cat===cat)))html+="<p class='empty'>No players bought.</p>";return html+"</div>"}
function finish(){auction.classList.add("hidden");summary.classList.remove("hidden");summaryIntro.textContent=`Your team: ${userTeam}. Remaining purse: ₹${purse} Cr. Every player below shows the price paid.`;allTeams.innerHTML=[...opponents(userTeam),userTeam].map(renderTeam).join("")}
