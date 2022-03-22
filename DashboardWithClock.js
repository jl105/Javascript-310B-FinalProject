// Getting it to show the current time on the page
let writeCurrentTime = function()
{
    var clockEl = document.getElementById('clock');
    var currentTime = new Date();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    var seconds = currentTime.getSeconds();
    var meridian = "AM";
 
    // Set hours
    if (hours >= 12)     {
        meridian = "PM";
        hours = hours % 12;
        if (hours == 0) {
            hours = 12;
        }
    }
 
    clockEl.innerText = `${hours} : ${checkTime(minutes)} : ${checkTime(seconds)} ${meridian}`;
};

function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
  }

// Getting the clock to increment on its own and change out messages and pictures
var updateClock = function() 
{
  var time = new Date().getHours();
  
  writeCurrentTime();
};
updateClock();

// Getting the clock to increment once a second
setInterval( updateClock, 1000);

//One or more Classes (must use static methods and/or prototype methods)
class PetBird {
    constructor(type, lifeSpanMedian) {
        this.type = type;
        this.lifeSpanMedian = lifeSpanMedian;
    }

    live(years) {
        return (`The ${this.type} parrot lives ${years}`);
    }
    static sort(a, b) {
        return b.lifeSpanMedian - a.lifeSpanMedian;
    }
}



//this part is for fetch
$(document).ready(function(){
    getListNames();
    $("#periodSelect").change(function(e) {
        e.preventDefault();
        // let datePicked = document.getElementById("book-date").value;
        getListNames();
    });

    //One or more Classes (must use static methods and/or prototype methods)
    PetBird.prototype.beakShape = "conical shape";
    let flinch = new PetBird("flinches", 7);
    flinch.beakShape = " long and pointed";
    let cockatiel = new PetBird("cockatiels", 6.5);
    let dove = new PetBird("doves", 20);
    const petBirdList = [
        flinch,
        cockatiel,
        dove
    ];
    let sortOrder = petBirdList.sort(PetBird.sort).map(b => b.type).join(",");
    localStorage.setItem("orderOfLifespan", sortOrder);
    let lifeSpanNbr = petBirdList.sort(PetBird.sort).map(b => b.lifeSpanMedian).join(",");
    $("#lifespan").html(`Lifespan from long to short: ${sortOrder}, with lifespan of ${lifeSpanNbr} respectively.`);

    $("#flinch").html(`${flinch.live("5 to 9 years")}. \nIts beak shape is ${flinch.beakShape}, while beak shape for cockatiels is ${cockatiel.beakShape}.`);
    $("#cockatiel").html(cockatiel.live("5 to 8 years"));
    $("#dove").html(dove.live("20 years"));

    $("#optPetbirds").click(function(e) {
        $("#nyList").fadeOut(500);
        $("#petbirds").fadeIn(500);
        $(".jasmine_html-reporter").fadeOut(500);
    })

    $("#optNYList").click(function(e) {
        $("#nyList").fadeIn(500);
        $("#petbirds").fadeOut(500);
        $(".jasmine_html-reporter").fadeOut(500);
    })

    $("#optJasmine").click(() => {
        $("#nyList").fadeOut(500);
        $("#petbirds").fadeOut(500);
        $(".col-sm-9").append($(".jasmine_html-reporter"));
        $(".jasmine_html-reporter").fadeIn(500);
    })

    $("#retrieveLS").click(() => {
        $("#lsTitle").html(`LocalStorage retrieved: ${localStorage.getItem("orderOfLifespan")}`);
    })

    $("#removeLS").click(() => {
        $("#lsTitle").html(`LocalStorage removed: ${localStorage.removeItem("orderOfLifespan")}`);
    })

    $("#setLS").click(() => {
        localStorage.setItem("orderOfLifespan", sortOrder);
        $("#lsTitle").html(`LocalStorage newly set: ${localStorage.getItem("orderOfLifespan")}`);
    })
})

//One or more fetch requests to a 3rd party API
let searchResultsEl = document.getElementById("searchResults");
let getListNames = function() {
    const url = 'https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=6qHvDlODWzBgro8ICWhj0PgG95ufriDo';
    // Fetch bestselling books for date and add top 5 to page
    fetch(url)
    .then(function(data) {
      return data.json();
    })
    .then(function(responseJson) {
        console.log(responseJson.results);
        let listNames = responseJson.results;
        if (listNames.length == 0) return;
    
        removeAllChildNodes(searchResultsEl);
    
        let periodSelected = $("#periodSelect").val();
        switch(periodSelected){
            case "1":
                listNames = listNames.filter(x => x.updated == "WEEKLY");
                break;
            case "2":
                listNames = listNames.filter(x => x.updated == "MONTHLY");
                break;
            default:
                break;
        }

        if (listNames.length == 0) return;

        let table = document.createElement("table");
        table.classList.add("table", "table-stripped", "table-sm");
        table.style.border = "1px solid #000";
        let tr = document.createElement("thead");
        tr.innerHTML = `<tr>
            <th>Display Name</th>
            <th>Newest Published Date</th>
            <th>Oldest Published Date</th>
            <th>Updated</th>
        </tr>`;
        table.appendChild(tr);
        let tb = table.createTBody();
        for(const listName of listNames) {
            tr = document.createElement("tr");
            tr.innerHTML = `<tr>
                                <td>${listName.display_name}</td>
                                <td>${listName.newest_published_date}</td>
                                <td>${listName.oldest_published_date}</td>
                                <td>${listName.updated}</td>
                            </tr>`;
            tb.appendChild(tr);
        }
        $("#searchResults").append(table);
    })
    .catch(() => {
        removeAllChildNodes(searchResultsEl);
        searchResultsEl.innerText = "No books for option.";
    });
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
  }


//Jasmine Unit Test
describe("Different Methods of Expect Block",function () {
    it("0 = 0 Should be true",function () {   
        //this will check whether the value of the variable  
        // currentVal is equal to 0 or not.  
        expect(myJasmineExam.realVal).toEqual(0);  
     });

    it("5 < 10 Should be True",function () {   
       expect(myJasmineExam.isLessThan10(5)).toBeTruthy();    
    });

    it("15 < 10 Should be False",function () {
        expect(myJasmineExam.isLessThan10(15)).toBeFalsy();   
     });
 }); 

 window.myJasmineExam = {  
    realVal: 0,   
    isLessThan10: function (num) {  
       if(num < 10)    
          return true;  
       else   
          return false;  
    },  
 };

