
const KanapAPI = "http://localhost:3000/api/products/";
//recuperer l'id du produit concerné
let getID = window.location.search;
let params = new URLSearchParams(document.location.search);
let urlId = params.get("id");

const productIMG = document.querySelector('.item__img');

const title = document.querySelector('#title');
const price = document.querySelector('#price');
const description = document.querySelector('#description');
const colors = document.querySelector('#colors');

const selectPanier = document.querySelector("#addToCart");
//recuperer les informations du produit
let callProduit = KanapAPI + urlId;


function callProduct() {
    fetch(callProduit)
        .then((res) => res.json())
        .then((product) => {

            const insertIMG = document.createElement("img");
            insertIMG.setAttribute("src", product.imageUrl);
            insertIMG.setAttribute("alt", product.altTxt);
            productIMG.appendChild(insertIMG);
            title.innerText = product.name;
            price.innerText = product.price;
            description.innerText = product.description;
            document.getElementById("quantity").value = 0;
            //choisir les couleurs
            for (let addColor of product.colors) {
                const newColor = document.createElement("option");
                newColor.setAttribute("value", `${addColor}`);
                newColor.innerText = addColor;
                colors.appendChild(newColor);


            }
            console.log(addColor);
        })

};
callProduct();

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
const eventColors = document.getElementById("colors");
eventColors.addEventListener('change', function () {
    return objectCart.Color = eventColors.value;
});
const eventQuantity = document.getElementById("quantity");
eventQuantity.addEventListener('input', function () {
    eventQuantity.value = parseInt(eventQuantity.value);
    let number = parseInt(eventQuantity.value);
    return objectCart.Quantity = number;
});



// 2- verifier les selections
function checkLs() {
    let arraySelection = objectCart;
    let valid = true;
    let cartQuantity = objectCart.Quantity;
    let cartColor = objectCart.Color;
    console.log(cartQuantity);
    console.log(cartColor);
    if (isNaN(cartQuantity)
        || cartQuantity < 1 || cartQuantity >= 101 || cartQuantity === null || cartQuantity === undefined) {
        console.log("erreur"); valid = false;

    }
    else {
        if (cartColor === 0 || cartColor === "color" || cartColor === "" || cartColor === undefined) {
            alert("Erreur sur la couleur et/ ou la quantité")
            return false;
        }
        if (cartColor === "Color" && cartQuantity === 0) {
            console.log("faux");
            valid = false;

        }

        else {
            valid = true;
            console.log(arraySelection);
        }
    }
    //nombre entier obligatoire
    if (!Number.isInteger(cartQuantity)) {
        valid = false;
        alert("erreur");
    }
    if (valid) {
        alert("Vous venez d'ajouter le produit dans votre panier")
        return valid;
    }
    else {
        alert("Erreur sur la couleur et/ ou la quantité")
        return false;
    }
};
//fonction sauvegarde du local storage
function saveArray(arraySelection) {
    return localStorage.setItem('arraySelection', JSON.stringify(arraySelection));
};

// fonction Recuperer le local storage
function getArray() {
    let get = localStorage.getItem('arraySelection');
    if (get == null) {
        return [];
    }
    else {
        return JSON.parse(get);
    }

};

//ecoute du boutton 
const eventCart = document.getElementById("addToCart");
eventCart.addEventListener('click', function () {
    let btn = objectCart;

    //recuperer le tableau dans le local storage
    if (checkLs(btn)) {
        basket();
    }

});
/*  3- inserer l'objet dans le tableau => LS
   Fonction qui vérifie la présence d'un produit dans le LS 
   Si l'id et la couleur d'un même produit sont présent : modifier la quantité 
   Sinon créer un nouveau produit 
   La variable stopQuantity permet de bloquer l'envoi du produit 
   si la quantité total de celui-ci est supérieur à 100
*/
function basket() {
    let verif = false;
    let stopQuantity = true;
    console.log(urlId);
    arraySelection = getArray();
    let product = arraySelection.find(p => (p.Id === objectCart.Id && p.Color === objectCart.Color));
    console.log(product);
    if (product) {
        product.Quantity += parseInt(objectCart.Quantity);
        if (product.Quantity < 101) {
            verif = true;
        } else {
            stopQuantity = false;
            console.log('attention quantité suppérieur à 100');
            alert("attention la quantité totale ne doit pas dépasser 100 pour le même produit");
        }
    }



    if (stopQuantity) {
        if (verif) {
            saveArray(arraySelection);
            //alert("attention la quantité totale ne doit pas dépasser 100 pour le même produit");
        } else {
            arraySelection.push(objectCart);
            saveArray(arraySelection);

        }
    };
};