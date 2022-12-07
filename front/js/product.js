
//recuperer l'id du produit concerné

const KanapAPI = "http://localhost:3000/api/products/";

let getID = window.location.search;
let params = new URLSearchParams(document.location.search);
let urlId = params.get("id"); 

console.log(urlId);

const productIMG = document.querySelector('.item__img');



const selectPanier= document.querySelector("#addToCart");
//recuperer les informations du produit
let callProduit= KanapAPI + urlId;
fetch(callProduit)
    .then((res) => res.json())
    .then ((product) => {
        document.querySelector('title').textContent = product.name;
        const insertIMG = document.createElement("img");
        insertIMG.setAttribute("src", product.imageUrl)
        insertIMG.setAttribute("alt", product.altTxt)
        productIMG.appendChild(insertIMG);
        title.innerText = product.name;
        price.innerText = product.price;
        description.innerText = product.description;
        //choisir les couleurs
        for (let addColor of product.colors) {
            const newColor = document.createElement("option");
            newColor.setAttribute("value", `${addColor}`);
            newColor.innerText = addColor;
            colors.appendChild(newColor);
   
   
        }})

;

//creer l'objet

let arraySelection = []
let objectCart = {
    Id: urlId,
    Quantity: 0,
    Color: 'color'
    
};
console.log(objectCart);
// **********************************************
//          Local Storage
// ***********************************************/
    // 1-déclarer les couleurs et quantites
    // 2- verifier les selections
    // 3- inserer dans l'objet
    // 4- pousser le tableau dans le localstorage

//1//
const eventColors = document.getElementById("colors");
eventColors.addEventListener('change', function(){
    return objectCart.Color = eventColors.value;    
});
const eventQuantity = document.getElementById("quantity");
eventQuantity.addEventListener('input', function(){
    eventQuantity.value = parseInt(eventQuantity.value);
   let number = parseInt(eventQuantity.value);
    return objectCart.Quantity = number;    
});


//2 fonction de validation

function displayLs(){
    let arraySelection = objectCart;
    let valid = true ;
    let cartQuantity = objectCart.Quantity;
    let cartColor = objectCart.Color;
    console.log (cartQuantity);
    console.log (cartColor);
    if (isNaN(cartQuantity) 
        || cartQuantity<1 || cartQuantity>=101 || cartQuantity===null || cartQuantity===undefined) {
        console.log("erreur"); valid=false;
    }
        else{ 
            if (cartColor === 0 || cartColor ==="" || cartColor === undefined) { 
            console.log('erreur' + err );valid=false;
            } 
                if (cartColor==="Color" && cartQuantity===0) {
                    console.log("faux");
                    valid=false;

                }

            else  {
            valid=true;
            console.log(arraySelection);
            }
        }
        //nombre entier obligatoire
    if (!Number.isInteger(cartQuantity)){
         valid=false;
         alert("erreur");
         }
    if(valid){
        alert ("les select sont valides")
        return valid;
    }
    else {
        alert("les select ne sont pas valide")
        return valid;
    }
};
//fonction sauvegarde du local storage
function saveArray(arraySelection){  
    console.log(arraySelection);
    return localStorage.setItem('arraySelection',JSON.stringify(arraySelection));
};

// fonction Recuperer le local storage
function getArray(){
    let get = localStorage.getItem('arraySelection');
    if (get == null){
        return [];
    }
    else {
        return JSON.parse(get);
    }
    
};

//ecoute du boutton 
const eventCart = document.getElementById("addToCart");
eventCart.addEventListener('click', function(){
    let btn = objectCart;
    
    //recuperer le tableau dans le local storage
    if (displayLs(btn)){
        basket(); 
    }

});

function basket(){
    let verif = false;
    console.log(urlId);
    arraySelection = getArray();
    let a = objectCart;
    let product = arraySelection.find(p=>(p.Id === a.Id && p.Color === a.Color));
   /* arraySelection.forEach(element => {
        if (element.Id === a.Id && element.Color === a.Color){
            element.Quantity += a.Quantity;
            verif = true ;
            //arraySelection.push(a);
            console.log(arraySelection);
           // return cartQuantity;
        }
        else {
            verif = false;
            
        } 
    });*/
    console.log("test de update");
    console.log(product);
    if (product){
        product.Quantity += parseInt(a.Quantity);
        saveArray(arraySelection);
    }
    else {
        arraySelection.push(a);
        saveArray(arraySelection);
        console.log(arraySelection);
        
    }
    
};
//valider 100produit +100produit = 200produit probleme
//quand on revient pour rajouter une couleur deja select ca créer en nouvel objet


