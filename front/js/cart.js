//recuperer le catalogue Api
const KanapAPI = "http://localhost:3000/api/products/";
//recuperer le local storage

//let cart = JSON.parse(localStorage.getItem("arraySelection"));
//console.log(cart);
let cart = getCart();
let addArticle = document.querySelector('#cart__items');
let totalQty = document.querySelector('#totalQuantity');
let totalPrice = document.querySelector('#totalPrice');
const order = document.getElementById("order");


let allArticlePrice = [];

class articlePrice {
    constructor(id, price, color, urlImg, altImg, description, qty, total) {
        this.id = id;
        this.price = price;
        this.color = color;
        this.urlImg = urlImg;
        this.altImg = altImg;
        this.description = description;
        this.qty = qty;
        this.total = total;
    }
};
function testLs(){
    cart = getCart();
    console.log(cart);
    if (cart.length > 0) {
        checkLs();            
        
    }
    else{
        const basketNull = document.createElement("p");
        addArticle.appendChild(basketNull);
        basketNull.textContent = "Pannier vide";
        cart = null;
    }
};
testLs();
function checkLs() {
    //cart = getCart();
    
    console.log(cart);
    for (let product of cart){
        
        fetch (KanapAPI+product.Id)
            .then(function(res){
                if(res.ok){
                    return res.json();
                }
            })
            .then(function(b){
                console.log(b);
                const newProduct = new articlePrice(b._id,b.price,product.Color,b.imageUrl,b.altTxt,b.description,product.Quantity);
                console.log(newProduct);
                
                console.log(product);
                allArticlePrice.push(newProduct);
                articleChoice(newProduct);
                PrintTotal();
                delectProduct();
            })
            .catch(function(err){
                console.log("erreur"+ err);
            })
    }
};
//checkLs();
/*
function callArticle (newProduct){
    articleChoice(newProduct);
    deleteProduct();
}*/
// tableau du local storage

//fonction sauvegarde du local storage
function saveArray(arraySelection){  
    console.log(arraySelection);
    return localStorage.setItem('arraySelection',JSON.stringify(arraySelection));
};


//  2- recuperer le tableau du localstorage ********************************************
// Récuperer le tableau du localStorage
function getCart(){
    
    let cart = localStorage.getItem('arraySelection');
    if (cart == null){ return [];}
    else {return JSON.parse(cart);};   
     
};

 // Insertion d'articles dans la page


//créer les éléments dans le dom
function articleChoice(arg){
    let article = document.createElement("article");
    addArticle.appendChild(article);
    article.classList.add("cart__item");
    article.setAttribute("data-id",`${arg.id}`);
    article.setAttribute("data-color",`${arg.color}`);
    let divImg = document.createElement("div");
    article.appendChild(divImg);
    divImg.classList.add("cart__item__img");
    let img = document.createElement("img");
    divImg.appendChild(img);
    console.log(img);
    img.setAttribute("src",`${arg.urlImg}`);
    img.setAttribute("alt",`${arg.altImg}`);
    let divContent = document.createElement("div");
    article.appendChild(divContent);
    divContent.classList.add("cart__item__content");
    let divDescription = document.createElement("div");
    divContent.appendChild(divDescription);
    divDescription.classList.add("cart__item__content__description");
    let nameProduct = document.createElement("h2");
    divDescription.appendChild(nameProduct);
    nameProduct.textContent = arg.name;
    let pColor = document.createElement("p");
    divDescription.appendChild(pColor);
    pColor.textContent = `Couleur : ${arg.color}`;
    let pPrice = document.createElement("p");
    divDescription.appendChild(pPrice);
    pPrice.textContent = `Tarif : ${arg.price} €`;
    let divSettings = document.createElement("div");
    divContent.appendChild(divSettings);
    divSettings.classList.add("cart__item__content__settings");
    let divQuantity = document.createElement("div");
    divSettings.appendChild(divQuantity);
    divQuantity.classList.add("cart__item__content__settings__quantity");
    divQuantity.style = "padding-bottom: 16px;";
    let pQuantity = document.createElement("p");
    divQuantity.appendChild(pQuantity);
    pQuantity.textContent = "Qté : ";
    let inputQ = document.createElement("input");
    divQuantity.appendChild(inputQ);
    inputQ.classList.add("itemQuantity");
    inputQ.setAttribute("type","number");
    inputQ.setAttribute("name","itemQuantity");
    inputQ.setAttribute("min","1");
    inputQ.setAttribute("max","100");
    inputQ.setAttribute("value",`${arg.qty}`);
    let divDelete = document.createElement("div");
    divSettings.appendChild(divDelete);
    divDelete.classList.add("cart__item__content__settings__delete");
    let pDelete = document.createElement("p");
    divDelete.appendChild(pDelete);
    pDelete.classList.add("deleteItem");
    pDelete.textContent = "Supprimer";
    // Ecoute de la quantité, argument donné : " product " , nouvelle quantité   
    inputQ.addEventListener("input", () => updateQty(arg, parseInt(inputQ.value)));
    }

    //**************  Fonction qui met à jour la quantité dans LS et boite *******************/
// Fonction qui met à jour la quantité dans LS et " boite "
    function updateQty(arg, newValue){
        const articlePrice = arg;
        const idProd = articlePrice.id;
        const colorProd = articlePrice.color;
        articlePrice.qty = newValue;   
        if (articlePrice.qty > 0 && articlePrice.qty <= 100 ){
            for (i in cart){
                if (cart[i].Id === idProd && cart[i].Color === colorProd){
                    cart[i].Quantity = articlePrice.Qty;                                      
                    saveArray(cart);
                    if (allArticlePrice[i].id === idProd && allArticlePrice[i].color === colorProd){
                        allArticlePrice[i].qty = articlePrice.qty;
                    }
                }
            }
            PrintTotal(); // recalcule le total
        }else{
            alert("La quantité choisie n'est pas valide");
            for (i in cart){
                if (cart[i].Id === idProd && cart[i].Color === colorProd){
                    cart[i].Quantity = 1;
                    saveArray(cart);
                    if (allArticlePrice[i].id === idProd && allArticlePrice[i].color === colorProd){
                        allArticlePrice[i].qty = 1;
                    }
                }
            }
            PrintTotal();  // recalcule le total
        };    
    }
//**********Fonction qui affiche le prix total et la Q total *******************//
// Fonction qui calcul et affiche le prix total et la Quantité total 
function PrintTotal(){
    let totalPrice = 0;
    let totalQuantity = 0;
    let a = 0; // vaut quantité de un produit
    let b = 0; // vaut prix de un produit    
    for (i in allArticlePrice){
        b = allArticlePrice[i].qty*allArticlePrice[i].price;
        totalPrice += b;
        a = allArticlePrice[i].qty;
        totalQuantity += a;
    };         
    const totalP = document.querySelector("#totalPrice");
    const totalQ = document.querySelector("#totalQuantity");
    totalP.textContent = totalPrice;
    totalQ.textContent = totalQuantity;
}
                                       

//supprimer
function delectProduct(){
    const bouton = document.querySelectorAll(".deleteItem");
    bouton.forEach(elt => {
        elt.addEventListener('click',function(){
            const delectAticle = elt.closest(".cart__item");
            const articleId= delectAticle.dataset.id;
            const articleColor= delectAticle.dataset.color;
            delectAticle.remove();
            PrintTotal();
            for(i in cart){
                if (cart[i].Id == articleId && cart[i].Color == articleColor){
                    let a=i;
                    cart.splice(a,1);
                    saveArray(cart);
                    allArticlePrice.splice(a,1);
                    
    
                }
            }
    
        } )
      
    });
    

}
//formulaire
//Déclaration de l'objet contact et regex 

// Regex pour verification des champs inputs
const allRegex = [
    {
        name: "firstName",
        regex: /^[A-Za-zÀ-ü-' ]+$/,
        error: "firstNameErrorMsg",
        validate: "Prénom ✓"
    },
    {
        name: "lastName",
        regex: /^[A-Za-zÀ-ü-' ]+$/,
        error: "lastNameErrorMsg",
        validate: "Nom ✓"
    },
    {
        name: "address",
        regex: /^[0-9]+\s[A-Za-zÀ-ü-'\s]+/,
        error: "addressErrorMsg",
        validate: "Adresse ✓"
    },
    {
        name: "city",
        regex: /^[A-Za-zÀ-ü-' ]+$/,
        error:  "cityErrorMsg",
        validate: "Ville ✓"
    },
    {
        name: "email",
        regex: /.+\@.+\..+/,
        error: "emailErrorMsg",
        validate: "email ✓"
    }
];

function testInput(input, regex) {
    let test = regex.test(input.value);
    if (test) {
        return true;
    }
    else {
        return false;
    }
}

// Verification direct des champs avec message (Soucis restant : ordre d'affichage)
function liveCheckInputs() {
    for(infos of allRegex) {
        let infosContent = infos;
        let input = document.getElementById(infosContent.name);
        let error = input.nextElementSibling;
        input.addEventListener("change", () => {
            let regex = infosContent.regex;
            let returnTest = testInput(input,regex);
            if(returnTest){
                error.innerText = infosContent.validate;

            }
            else {
                error.innerText = infosContent.error;
            }  
        })
    }
}
/*
// Verification + Requete POST à l'api (Soucis restant : Verification non complet ou décalé)
function sendPost() {
    order.addEventListener("click", (event) => {
        event.preventDefault();
        let next = true;
        for(infos of allRegex){
            let infosContent = infos;
            let input = document.getElementById(infosContent.name);
            let regex = infosContent.regex;
            let test = testInput(input,regex);
            let error = input.nextElementSibling;
            if(test){
                next = true;
            }
            else {
                next = false;
                error.innerText = infosContent.error;
                break;
                
            }
        }
        if (next){
            fetch("http://localhost:3000/api/products/order", {
                method: 'POST',
                body: JSON.stringify(
                    {contact: {
                        firstName: document.getElementById("firstName").value,
                        lastName: document.getElementById("lastName").value,
                        address: document.getElementById("address").value,
                        city: document.getElementById("city").value,
                        email: document.getElementById("email").value
                    },
                    products: cartList.map(product => product._id)
                    }),
                headers : {
                    'Content-Type': 'application/json'
                },
            })
                .then(res => res.json())
                .then(back => {
                    localStorage.clear('cart');
                    document.location = `./confirmation.html?id=${back.orderId}`;
                });
        }
        else{
            alert("Veuillez remplir les champs correctements.");
        }
    })
}*/