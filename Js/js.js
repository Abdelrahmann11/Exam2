function openleftMenu() {
    $("#leftMenu").animate({
        left: 0
    }, 300)

    $(".openCloseIcon").removeClass("fa-bars fa-2xl");
    $(".openCloseIcon").addClass("fa-xmark fa-2xl");
    
    for (let i = 0; i < 5; i++) {
        $(".Links li").eq(i).animate({
            top: 0
        }, (i + 5) * 100)
    }
}

function closeleftMenu() {
    $("#leftMenu").animate({
        left: -256.562
    }, 300)

    $(".openCloseIcon").removeClass("fa-xmark fa-2xl");
    $(".openCloseIcon").addClass("fa-bars fa-2xl");
    
    $(".links li").animate({
        top: 400
    }, 500)
}

closeleftMenu()
$("#leftMenu i.openCloseIcon").click(() => {
    if ($("#leftMenu").css("left") == "0px") {
        closeleftMenu()
    } else {
        openleftMenu()
    }
})

let data = document.getElementById("Data")

let DataArray;
if(localStorage.getItem("DataArray") == null){
    DataArray = []
} else{
    DataArray = JSON.parse(localStorage.getItem("DataArray"))
}

async function getData() {
    let MealsArr = ["Corba", "Sushi", "Burek", "Bistek", "Tamiya", "Kumpir", "Wontons", "Lasagne", "Kafteji", "Big Mac", "Poutine", "Koshari", "Dal fry", "Timbits", "Pancakes", "Kapsalon", "Fish pie", "Flamiche", "Shawarma", "Kedgeree", "Stamppot", "Moussaka", "Shakshuka", "Sugar pie", "Ribollita"]
    // let count =0;
    for (let i = 0; i < MealsArr.length; i++) {
        // console.log(MealName);
        // count++
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${MealsArr[i]}`)
        response = await response.json()

        DataArray?.push(response.meals[0])

        // let DataArrayLength = localStorage.getItem('DataArray');
        // console.log(DataArrayLength?.length);
        
        

        // console.log(response.meals[0]);
        displayMeals(DataArray)
    }
    // console.log(count);

    // let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${MealsArr}`)
    // response = await response.json()

    // DataArray?.push(response.meals)
    // localStorage.setItem("DataArray",JSON.stringify(DataArray))

    // console.log(response.meals);
}

getData();

function displayMeals(DataArray) {
    let cartoona = "";

    for (let i = 0; i < DataArray.length; i++) {
        // console.log(arr);
        cartoona += `
        <div class="col-md-3">
            <div onclick="getMealDetails('${DataArray[i].idMeal}')" class="mealCard position-relative overflow-hidden rounded-3" style="cursor: pointer;">
                <img src="${DataArray[i].strMealThumb}" alt="" class="w-100 "/>
                <div class="mealLayer position-absolute d-flex align-items-center">
                    <h3 style="color: black;">${DataArray[i].strMeal}</h3>   
                </div>
            </div>
        </div>
        `
    }

    data.innerHTML = cartoona
}

async function getMealDetails(mealID) {
    closeleftMenu()
    data.innerHTML = ""
    $(".Loading").fadeIn(300)

    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    respone = await respone.json();

    displayMealDetails(respone.meals[0])
    $(".Loading").fadeOut(300)
}

function displayMealDetails(Smeal) {

    let Ingred = ``

    for (let i = 1; i <= 20; i++) {
        if (Smeal[`strIngredient${i}`]) {
            Ingred += `<li class="alert alert-info m-2 p-1">${Smeal[`strMeasure${i}`]} ${Smeal[`strIngredient${i}`]}</li>`
        }
    }

    let Tags = Smeal.strTags?.split(",")
    // let tags = meal.strTags.split(",")
    if (!Tags) Tags = []

    let TagsStr = ''
    for (let i = 0; i < Tags.length; i++) {
        TagsStr += `
        <li class="alert alert-danger m-2 p-1">${Tags[i]}</li>`
    }

    let cartoona = `
    <div class="col-md-4">
                <img class="w-100 rounded-3" src="${Smeal.strMealThumb}"
                    alt="">
                    <h2>${Smeal.strMeal}</h2>
            </div>
            <div class="col-md-8">
                <h2>Instructions</h2>
                <p>${Smeal.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${Smeal.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${Smeal.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${Ingred}
                </ul>

                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${TagsStr}
                </ul>

                <a target="_blank" href="${Smeal.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${Smeal.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>`

    data.innerHTML = cartoona
}

async function getCategories() {
    data.innerHTML = ""
    $(".Loading").fadeIn(300)

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    response = await response.json()

    displayCategories(response.categories)
    $(".Loading").fadeOut(300)
}

function displayCategories(CatArr) {
    let cartoona = "";

    for (let i = 0; i < CatArr.length; i++) {
        cartoona += `
        <div class="col-md-3">
                <div onclick="getCategoryMeals('${CatArr[i].strCategory}')" class="mealCard position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${CatArr[i].strCategoryThumb}" alt="" srcset="">
                    <div class="mealLayer position-absolute text-center text-black p-2">
                        <h3 style="color: black;">${CatArr[i].strCategory}</h3>
                        <p style="color: black;">${CatArr[i].strCategoryDescription.split(" ").slice(0,20).join(" ")}</p>
                    </div>
                </div>
        </div>
        `
    }

    data.innerHTML = cartoona
}

async function getCategoryMeals(cat) {
    data.innerHTML = ""
    $(".Loading").fadeIn(300)

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`)
    response = await response.json()

    displayMeals(response.meals.slice(0, 20))
    $(".Loading").fadeOut(300)
}


async function getArea() {
    data.innerHTML = ""
    $(".Loading").fadeIn(300)

    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    respone = await respone.json()
    // console.log(respone.meals);

    displayArea(respone.meals)
    $(".Loading").fadeOut(300)
}

function displayArea(AreaArr) {
    let cartoona = ``;

    for (let i = 0; i < AreaArr.length; i++) {
        cartoona += `
        <div class="col-md-3">
                <div onclick="getAreaMeals('${AreaArr[i].strArea}')" class="rounded-2 text-center" style="cursor:pointer;">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${AreaArr[i].strArea}</h3>
                </div>
        </div>
        `
    }

    data.innerHTML = cartoona
}

async function getAreaMeals(area) {
    data.innerHTML = ""
    $(".Loading").fadeIn(300)

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
    response = await response.json()

    displayMeals(response.meals.slice(0, 20))
    $(".Loading").fadeOut(300)
}


async function getIngredients() {
    data.innerHTML = ""
    $(".Loading").fadeIn(300)

    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
    respone = await respone.json()
    // console.log(respone.meals);

    displayIngredients(respone.meals.slice(0, 20))
    $(".Loading").fadeOut(300)
}

function displayIngredients(IngArr) {
    let cartoona = ``;

    for (let i = 0; i < IngArr.length; i++) {
        cartoona += `
        <div class="col-md-3">
            <div onclick="getIngredientsMeals('${IngArr[i].strIngredient}')" class="rounded-2 text-center" style="cursor:pointer;">
                <i class="fa-solid fa-drumstick-bite fa-4x" style="color: #ffffff;"></i>
                <h3>${IngArr[i].strIngredient}</h3>
                <p>${IngArr[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
            </div>
        </div>
        `
    }

    data.innerHTML = cartoona
}

async function getIngredientsMeals(ing) {
    data.innerHTML = ""
    $(".Loading").fadeIn(300)

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ing}`)
    response = await response.json()

    displayMeals(response.meals.slice(0, 20))
    $(".Loading").fadeOut(300)
}

let SearchContainer = document.getElementById("SearchContainer")

function showSearchContainer(){
    SearchContainer.innerHTML = `<div class="row" style="padding-top: 24px; padding-bottom: 24px;">
            <div class="col-md-6">
                <input oninput="searchByName(this.value)" id="SearchByName" type="text" class="form-control text-white bg-transparent" placeholder="Search By Name"/>
            </div>
            <div class="col-md-6">
                <input oninput="searchByFLetter(this.value)" id="SearchByFLetter" type="text" class="form-control text-white bg-transparent" placeholder="Search By First Letter"/>
            </div>
        </div>
    `
    data.innerHTML = ""
}

async function searchByName(term) {
    closeleftMenu()
    data.innerHTML = ""
    $(".Loading").fadeIn(300)

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
    response = await response.json()

    response.meals ? displayMeals(response.meals) : displayMeals([])
    $(".Loading").fadeOut(300)

}

async function searchByFLetter(term) {
    closeleftMenu()
    data.innerHTML = ""
    $(".Loading").fadeIn(300)

    term == "" ? term = "a" : "";
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`)
    response = await response.json()

    response.meals ? displayMeals(response.meals) : displayMeals([])
    $(".Loading").fadeOut(300)

}

















// let Name = document.getElementById("Name")
// let Email = document.getElementById("Email")
// let Phone = document.getElementById("Phone")
// let Age = document.getElementById("Age")
// let Pass = document.getElementById("Pass")
// let RePass = document.getElementById("RePass")

// let NameError = document.getElementById("NameError")
// let EmailError = document.getElementById("EmailError")
// let PhoneError = document.getElementById("PhoneError")
// let AgeError = document.getElementById("AgeError")
// let PassError = document.getElementById("PassError")
// let RePassError = document.getElementById("RePassError")

// let ContactSubmitBtn = document.getElementById("ContactSubmitBtn")

// function NameValidation(){
//     var regex = /^[a-zA-Z]{2,}|\s[a-zA-Z]{2,}$/

//     if(regex.test((Name ).value)){
//         NameError.classList.replace("d-block", "d-none")
//         return true;
//     } else{
//         NameError.classList.replace("d-none", "d-block")
//         // NameError.innerHTML = '<span class="text-success m-3">Success</span>'
//         return false;
//     }
// }

// function EmailValidation(){
//     var regex = /^[a-zA-Z]{2,}[0-9]{0,}(@)((gmail\.com)|(hotmail\.com))$/

//     if(regex.test(Email.value)){
//         EmailError.classList.replace("d-block", "d-none")
//         return true;
//     } else{
//         EmailError.classList.replace("d-none", "d-block")
//         return false;
//     }
// }

// function PhoneValidation(){
//     var regex = /^(010)[0-9]{8}|(011)[0-9]{8}|(012)[0-9]{8}|(015)[0-9]{8}$/

//     if(regex.test(Phone.value)){
//         PhoneError.classList.replace("d-block", "d-none")
//         return true;
//     } else{
//         PhoneError.classList.replace("d-none", "d-block")
//         return false;
//     }
// }

// function AgeValidation(){
//     var regex = /^(1[6-9]|[2-5][0-9]|60)$/

//     if(regex.test(Age.value)){
//         AgeError.classList.replace("d-block", "d-none")
//         return true;
//     } else{
//         AgeError.classList.replace("d-none", "d-block")
//         return false;
//     }
// }

// function PassValidation(){
//     var regex = /^[a-zA-Z]{8,}[0-9]{0,}((@){0,}(%){0,})$/

//     if(regex.test(Pass.value)){
//         PassError.classList.replace("d-block", "d-none")
//         return true;
//     } else{
//         PassError.classList.replace("d-none", "d-block")
//         return false;
//     }
// }

// function RePassValidation(){
//     if(RePass.value !== Pass.value){
//         RePassError.classList.replace("d-block", "d-none")
//         return true
//     } else{
//         RePassError.classList.replace("d-none", "d-block")
//         return false
//     }
// }

// if(NameValidation() && EmailValidation() && PhoneValidation() && AgeValidation() && PassValidation()){
//     ContactSubmitBtn.removeAttribute("disabled")
// } else{
//     ContactSubmitBtn.setAttribute("disabled", true)
// }


// if (NameValidation() &&
//     EmailValidation() &&
//     PhoneValidation() &&
//     AgeValidation() &&
//     PassValidation()) {
//         ContactSubmitBtn.removeAttribute("disabled")
//     } else {
//         ContactSubmitBtn.setAttribute("disabled", true)
//     }


    function showContactUs() {
        data.innerHTML = `<div class="Contact d-flex align-items-center justify-content-center">
        <div class="container text-center w-75">
            <div class="row" style="--bs-gutter-y: 24px;">
                <div class="col-md-6">
                    <input oninput="NameValidation" type="text" id="Name" class="form-control" placeholder="Enter You Name"/>
                    <div id="NameError" class="error alert-danger w-100 d-none" style="margin-top: 8px;">Name must Start with capital letter, No sepcial charcharacters or numbers</div>
                </div>
                <div class="col-md-6">
                    <input oninput="EmailValidation" type="email" id="Email" class="form-control" placeholder="Enter You Email"/>
                    <div id="EmailError" class="error alert-danger w-100 d-none" style="margin-top: 8px;">Your email must contain number and end with (@gmai.com) or (@hotmail.com)</div>
                </div>
                <div class="col-md-6">
                    <input oninput="PhoneValidation" type="number" id="Phone" class="form-control" placeholder="Enter You Phone"/>
                    <div id="PhoneError" class="error alert-danger w-100 d-none" style="margin-top: 8px;">Your number must contain (010) or (011) or (012) or (015) and to be from 11 numbers</div>
                </div>
                <div class="col-md-6">
                    <input oninput="AgeValidation" type="number" id="Age" class="form-control" placeholder="Enter You Age"/>
                    <div id="AgeError" class="error alert-danger w-100 d-none" style="margin-top: 8px;">Your age must be from (16 - 60)</div>
                </div>
                <div class="col-md-6">
                    <input oninput="PassValidation" type="password" id="Pass" class="form-control" placeholder="Enter You Password"/>
                    <div id="PassError" class="error alert-danger w-100 d-none" style="margin-top: 8px;">Your password must be more than 8 characters (A- Z) may contain numbers</div>
                </div>
                <div class="col-md-6">
                    <input oninput="RePassValidation" type="password" id="RePass" class="form-control" placeholder="RePassword"/>
                    <div id="RePassError" class="error alert-danger w-100 d-none" style="margin-top: 8px;">Must match with the Password Field</div>
                </div>
            </div>
            <button id="ContactSubmitBtn" disabled="true" class="btn btn-outline-danger" style="margin-top: 16px; padding-left: 8px; padding-right: 8px;">Submit</button>
        </div>
    </div>
        `
        let Name = document.getElementById("Name")
        let Email = document.getElementById("Email")
        let Phone = document.getElementById("Phone")
        let Age = document.getElementById("Age")
        let Pass = document.getElementById("Pass")
        let RePass = document.getElementById("RePass")
        
        let NameError = document.getElementById("NameError")
        let EmailError = document.getElementById("EmailError")
        let PhoneError = document.getElementById("PhoneError")
        let AgeError = document.getElementById("AgeError")
        let PassError = document.getElementById("PassError")
        let RePassError = document.getElementById("RePassError")
        
        let ContactSubmitBtn = document.getElementById("ContactSubmitBtn")
        
        function NameValidation(){
            var regex = /^[a-zA-Z]{2,}|\s[a-zA-Z]{2,}$/
        
            if(regex.test((Name ).value)){
                NameError.classList.replace("d-block", "d-none")
                return true;
            } else{
                NameError.classList.replace("d-none", "d-block")
                // NameError.innerHTML = '<span class="text-success m-3">Success</span>'
                return false;
            }
        }
        
        function EmailValidation(){
            var regex = /^[a-zA-Z]{2,}[0-9]{0,}(@)((gmail\.com)|(hotmail\.com))$/
        
            if(regex.test(Email.value)){
                EmailError.classList.replace("d-block", "d-none")
                return true;
            } else{
                EmailError.classList.replace("d-none", "d-block")
                return false;
            }
        }
        
        function PhoneValidation(){
            var regex = /^(010)[0-9]{8}|(011)[0-9]{8}|(012)[0-9]{8}|(015)[0-9]{8}$/
        
            if(regex.test(Phone.value)){
                PhoneError.classList.replace("d-block", "d-none")
                return true;
            } else{
                PhoneError.classList.replace("d-none", "d-block")
                return false;
            }
        }
        
        function AgeValidation(){
            var regex = /^(1[6-9]|[2-5][0-9]|60)$/
        
            if(regex.test(Age.value)){
                AgeError.classList.replace("d-block", "d-none")
                return true;
            } else{
                AgeError.classList.replace("d-none", "d-block")
                return false;
            }
        }
        
        function PassValidation(){
            var regex = /^[a-zA-Z]{8,}[0-9]{0,}((@){0,}(%){0,})$/
        
            if(regex.test(Pass.value)){
                PassError.classList.replace("d-block", "d-none")
                return true;
            } else{
                PassError.classList.replace("d-none", "d-block")
                return false;
            }
        }
        
        function RePassValidation(){
            if (RePass.value !== Pass.value) {
                RePassError.classList.replace("d-block", "d-none");
                return true;
            } else {
                RePassError.classList.replace("d-none", "d-block");
                return false;
            }
        }
        
        if(NameValidation() && EmailValidation() && PhoneValidation() && AgeValidation() && PassValidation()){
            ContactSubmitBtn.removeAttribute("disabled")
        } else{
            ContactSubmitBtn.setAttribute("disabled", true)
        }
        
        
        if (NameValidation() &&
            EmailValidation() &&
            PhoneValidation() &&
            AgeValidation() &&
            PassValidation()) {
                ContactSubmitBtn.removeAttribute("disabled")
            } else {
                ContactSubmitBtn.setAttribute("disabled", true)
            }
}





