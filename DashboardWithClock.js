//Begin Requirement 3: One or more timing functions
//Getting it to show the current time on the page
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
//End Requirement 3: One or more timing functions

//Begin Requirement 1: One or more Classes (must use static methods and/or prototype methods)
const personPrototype = {
    greet() {
      console.log(`Greetings, ${this.name}!`);
    }
  }
  
function Person(name) {
    this.name = name;
}

Person.prototype = personPrototype;
Person.prototype.constructor = Person;
const aPersonRichard = new Person('Richard');
console.log(aPersonRichard.greet()); // hello, Richard!


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
//2nd Classes (must use static methods and/or prototype methods)
let flinch = new PetBird("flinches", 7);
let cockatiel = new PetBird("cockatiels", 6.5);
let dove = new PetBird("doves", 20);
const petBirdList = [
    flinch,
    cockatiel,
    dove
];
let sortOrder = petBirdList.sort(PetBird.sort).map(b => b.type).join(",");


const refreshLocalStorageAndUI = (petBirdList) => {
    sortOrder = petBirdList.sort(PetBird.sort).map(b => b.type).join(",");
    localStorage.setItem("orderOfLifespan", sortOrder);
    let lifeSpanNbr = petBirdList.sort(PetBird.sort).map(b => b.lifeSpanMedian).join(",");
    $("#lifespan").html(`Lifespan from long to short: ${sortOrder}, with lifespan of ${lifeSpanNbr} respectively.`);
}

//End Requirement 1: One or more Classes (must use static methods and/or prototype methods)

//main body of the document ready module
$(document).ready(function(){
    getListNames();
    $("#periodSelect").change(function(e) {
        e.preventDefault();
        // let datePicked = document.getElementById("book-date").value;
        getListNames();
    });

    refreshLocalStorageAndUI(petBirdList);

    $("#flinch").html(`${flinch.live("5 to 9 years")}.`);
    $("#cockatiel").html(cockatiel.live("5 to 8 years"));
    $("#dove").html(dove.live("20 years"));

    $(".jasmine_html-reporter").hide();

    $("#optRequirement").click(function(e) {
        $("#requirements").fadeIn(500);
        $("#nyList").fadeOut(500);
        $("#petbirds").fadeOut(500);
        $(".jasmine_html-reporter").fadeOut(500);
    })

    $("#optPetbirds").click(function(e) {
        $("#requirements").fadeOut(500);
        $("#nyList").fadeOut(500);
        $("#petbirds").fadeIn(500);
        $(".jasmine_html-reporter").fadeOut(500);
    })

    $("#optNYList").click(function(e) {
        $("#requirements").fadeOut(500);
        $("#nyList").fadeIn(500);
        $("#petbirds").fadeOut(500);
        $(".jasmine_html-reporter").fadeOut(500);
    })

    $("#optJasmine").click(() => {
        $("#requirements").fadeOut(500);
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

    $("#petName").change(vallidatePetName);
    $("#myEmail").change(validateEmail);
    $("#petUrl").change(validateUrl);
    $("#petDescription").change(vallidatepetDescription);
    $("#petLifespan").change(vallidatePetLifespan);

    //form validation
    $("#btnSave").click(() => {
        vallidatePetName();
        validateEmail();
        validateUrl();
        vallidatepetDescription();
        vallidatePetLifespan();
        let pionus = new PetBird($("#petName").val(), $("#petLifespan").val());
        if (petBirdList.filter(b => b.type == $("#petName").val()).length == 0) {
            petBirdList.push(pionus);
            refreshLocalStorageAndUI(petBirdList);
            $("#tblPetBird tbody").append('<tr><td>' + petBirdList.length 
            + '</td><td>' + $("#petName").val() 
            + '</td><td>' + $("#petLifespan").val()
            + '</td><td><img src="' + $("#petName").val() + '.png" style="margin-left: 10px; float: right;"><p>' + $("#petDescription").val() + "</p>"
            + '</td></tr>');
        };
        $(this).find('form').trigger('reset');
        $('[data-dismiss="modal"]').click();
    })
    // $("#trFlinch td:eq(2)")
})

//Begin Requirement 4: One or more fetch requests to a 3rd party API
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

  //END Requirement 4: One or more fetch requests to a 3rd party API

  //BEGIN requirement 6: Contains form fields, validates those fields
  const vallidatePetName = (e) => {
      let petName = document.getElementById("petName");
      let spanEl = petName.closest(".input-group").querySelector("span");
        if (petName.value.length < 3) {
            petName.setCustomValidity("Your Pet Name must be 3 characters or more.");
            petName.reportValidity();
            spanEl.classList.remove("valid");
            spanEl.classList.add("invalid");
            console.log("Bad petName input");
            e.preventDefault();
            return false;
        } else {
            spanEl.classList.remove("invalid");
            spanEl.classList.add("valid");
            petName.setCustomValidity("");
            petName.reportValidity();
        }
    }
    
    const vallidatePetLifespan = (e) => {
        let petLifeSpan  = document.getElementById("petLifespan");
        let spanEl = petLifeSpan.closest(".input-group").querySelector("span");
          if (isNaN(petLifeSpan.value)) {
            petLifeSpan.setCustomValidity("Your Pet Lifespan must be a number.");
            petLifeSpan.reportValidity();
            spanEl.classList.remove("valid");
            spanEl.classList.add("invalid");
            console.log("Bad pet lifespan input");
            e.preventDefault();
            return false;
          } else {
            spanEl.classList.remove("invalid");
            spanEl.classList.add("valid");
            petLifeSpan.setCustomValidity("");
            petLifeSpan.reportValidity();
          }
      }
    const vallidatepetDescription = (e) => {
        let petDescription = document.getElementById("petDescription");
        let spanEl = petDescription.closest(".input-group").querySelector("span");
          if (petDescription.value.length < 3) {
            petDescription.setCustomValidity("Your Pet Description must be 10 characters or more.");
            petDescription.reportValidity();
            spanEl.classList.remove("valid");
            spanEl.classList.add("invalid");
            console.log("Bad pet description input");
            e.preventDefault();
            return false;
          } else {
            spanEl.classList.remove("invalid");
            spanEl.classList.add("valid");
            petDescription.setCustomValidity("");
            petDescription.reportValidity();
          }
      }

    const validateEmail = (e) => {
        const emailPattern = /\w+@\w+\.\w+/;
        const email = document.getElementById("myEmail");
        let spanEl = email.closest(".input-group").querySelector("span");
        if (emailPattern.test(email.value)) {
            spanEl.classList.remove("invalid");
            spanEl.classList.add("valid");
            email.setCustomValidity("");
            email.reportValidity();
        } else {
            spanEl.classList.remove("valid");
            spanEl.classList.add("invalid");
            email.setCustomValidity("Your email is not valid");
            email.reportValidity();
            console.log("Bad email input");
            e.preventDefault();
            return false;
        }
    }

    const validateUrl = (e) => {
        const urlPattern = /^(https?:\/\/)?[0-9a-z]+\.[-_0-9a-z]+\.[0-9a-z]+$/;
        const urlEl = document.getElementById("petUrl");
        let spanEl = urlEl.closest(".input-group").querySelector("span");
        if (urlPattern.test(urlEl.value)) {
            spanEl.classList.remove("invalid");
            spanEl.classList.add("valid");
            urlEl.setCustomValidity("");
            urlEl.reportValidity();
        } else {
            spanEl.classList.remove("valid");
            spanEl.classList.add("invalid");
            urlEl.setCustomValidity("Your pet url is not valid");
            urlEl.reportValidity();
            console.log("Bad url input");
            e.preventDefault();
            return false;
        }
    }
    //END requirement 6: Contains form fields, validates those fields
    
//BEGIN requiement 2: Write testable code, use Jasmine unit tests
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
 //END requiement 2: Write testable code, use Jasmine unit tests

