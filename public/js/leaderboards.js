import { getUserData, getAllUserData, request } from './db_conn.js';

var tabs = document.querySelectorAll(".leaderboard_tabs ul li");
var today = document.querySelector(".today");
var all_time = document.querySelector(".all_time");
var daily = document.querySelectorAll(".daily");
var total = document.querySelectorAll(".total");
var items = document.querySelectorAll(".leaderboard_item");
var dailyNames = document.querySelectorAll(".daily_name");
var totalNames = document.querySelectorAll(".total_name");
var scoresbarsDaily = document.querySelectorAll(".score_bar_daily");
var scorebarsTotal = document.querySelectorAll(".score_bar_total");
var pointsDaily = document.querySelectorAll(".points_daily");
var pointsTotal = document.querySelectorAll(".points_total");

const maxScore = 300;
let length = 0;

async function updateLeaderboard(){
	sessionStorage.getItem("username")
	const loggedIn = sessionStorage.getItem("logedin");
    if (loggedIn) {
        const username = sessionStorage.getItem("username"); // Retrieve the username from session storage
        if (username) {
            try {
                // Call getUserData function passing the username and request
                const userData = await getUserData(username, request);
                if (userData) {
					// Call getAllUserData function
					const allUserData = await getAllUserData();
					const dailyUserScoreSort = Object.values(allUserData).map(Object.entries).sort((a, b) => b[4][1] - a[4][1]);
					const totalUserScoreSort = Object.values(allUserData).map(Object.entries).sort((a, b) => b[5][1] - a[5][1]);

					let top5Daily = dailyUserScoreSort.slice(0,5);
					let top5AllTime = totalUserScoreSort.slice(0,5);
			
					length = top5Daily.length;
					
					//update scoreboard values
					for(let  i = 0; i < length; i++){
						//set names
						dailyNames[i].children[0].textContent = top5Daily[i][0][1];
						totalNames[i].children[0].textContent = top5AllTime[i][0][1];


						//set scorebar
						//get percentage of max score - 1
						let scorebarDailyWidth = (top5Daily[i][4][1]/maxScore) * 100;
						if( scorebarDailyWidth == 0){
							scoresbarsDaily[i].style.width = "0%"
						}
						else{
							scoresbarsDaily[i].style.width = (scorebarDailyWidth-1) + "%"
						}

						//get percentage of highest scorer - 1
						let scorebarTotalWidth = (top5AllTime[i][5][1]/top5AllTime[0][5][1]) * 100;
						if( scorebarTotalWidth == 0){
							scorebarsTotal[i].style.width = "0%"
						}
						else{
							scorebarsTotal[i].style.width = (scorebarTotalWidth-1) + "%"
						}

						//set points value
						pointsDaily[i].textContent = top5Daily[i][4][1] + " Points"
						pointsTotal[i].textContent = top5AllTime[i][5][1] + " Points"
					}

					tabs.forEach(function(tab){
						tab.classList.remove("active");
					})

					var currenttab = tabs[0].getAttribute("data-li");
					tabs[0].classList.add("active");
			
					items.forEach(function(item){
						item.style.display = "none";
					})
			
					if(currenttab == "today"){
						today.style.display = "block";
						for(let i = 0; i < length; i++){
							daily[i].style.display = "flex";
						}
					}
					else if(currenttab == "all_time"){
						all_time.style.display = "block";
						for(let i = 0; i < length; i++){
							total[i].style.display = "flex";
						}
					}

                } else {
                    throw new Error("User data not found");
                }
            } catch (error) {
                throw new Error("Error retrieving user data:", error);
            }
        } else {
            throw new Error("Username not found in session storage");
        }
    } else {
        throw new Error("User not logged in");
    }
}

tabs.forEach(function(tab){
	tab.addEventListener("click", async function(){

		//await updateLeaderboard();

		var currenttab = tab.getAttribute("data-li");
		
		tabs.forEach(function(tab){
			tab.classList.remove("active");
		})

		tab.classList.add("active");

		items.forEach(function(item){
			item.style.display = "none";
		})

		if(currenttab == "today"){
			today.style.display = "block";
			for(let i = 0; i < length; i++){
				daily[i].style.display = "flex";
			}
		}
		else if(currenttab == "all_time"){
			all_time.style.display = "block";
			for(let i = 0; i < length; i++){
				total[i].style.display = "flex";
			}
		}
	})
})

async function firstLoad(){
	while(true){
		try {
			await updateLeaderboard();
			break;
		}
		catch{
			await new Promise(r => setTimeout(r, 10));
		}
	}
}

firstLoad();