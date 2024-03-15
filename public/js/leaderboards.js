var tabs = document.querySelectorAll(".leaderboard_tabs ul li");
var today = document.querySelector(".today");
var all_time = document.querySelector(".all_time");
var items = document.querySelectorAll(".leaderboard_item");

tabs.forEach(function(tab){
    console.log("test");
	tab.addEventListener("click", function(){
        console.log("test");
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
		}
		else if(currenttab == "all_time"){
			all_time.style.display = "block";
		}
	})
})