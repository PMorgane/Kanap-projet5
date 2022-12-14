//recuperer le catalogue Api
const KanapAPI = "http://localhost:3000/api/products/";
//recuperer le local storage

let cart = getCart();
//recup dans le dom
let addArticle = document.querySelector('#cart__items');
let totalQty = document.querySelector('#totalQuantity');
let totalPrice = document.querySelector('#totalPrice');


//objet vide
let allArticlePrice = [];

//constructor
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
//fonction testLs
function testLs() {
    cart = getCart();
    console.log(cart);
    if (cart.length > 0) {
        checkLs();

    }
    else {
        const basketNull = document.createElement("p");
        addArticle.appendChild(basketNull);
        basketNull.textContent = "Pannier vide";
        cart = null;
    }
};
testLs();
function checkLs() {
    console.log(cart);
    for (let product of cart) {

        fetch(KanapAPI + product.Id)
            .then(function (res) {
                if (res.ok) {
                    return res.json();
                }
            })
            .then(function (b) {
                console.log(b);
                const newProduct = new articlePrice(b._id, b.price, product.Color, b.imageUrl, b.altTxt, b.description, product.Quantity);
                console.log(newProduct);
                console.log(product);
            //stock ton panier
                allArticlePrice.push(newProduct);
                //visuel du produit dans le dom
                articleChoice(newProduct);
                //recalul le total
                PrintTotal();
                //appel fonction suppression produit
                delectProduct();
            })
            .catch(function (err) {
                console.log("erreur" + err);
            })
    }
};

// tableau du local storage

//fonction sauvegarde du local storage
function saveArray(arraySelection) {
    console.log(arraySelection);
    return localStorage.setItem('arraySelection', JSON.stringify(arraySelection));
};


//  2- recuperer le tableau du localstorage ********************************************
// R??cuperer le tableau du localStorage
function getCart() {

    let cart = localStorage.getItem('arraySelection');
    if (cart == null) { return []; }
    else { return JSON.parse(cart); };

};

// Insertion d'articles dans la page


//cr??er les ??l??ments dans le dom
function articleChoice(arg) {
    let article = document.createElement("article");
    addArticle.appendChild(article);
    article.classList.add("cart__item");
    article.setAttribute("data-id", `${arg.id}`);
    article.setAttribute("data-color", `${arg.color}`);
    let divImg = document.createElement("div");
    article.appendChild(divImg);
    divImg.classList.add("cart__item__img");
    let img = document.createElement("img");
    divImg.appendChild(img);
    console.log(img);
    img.setAttribute("src", `${arg.urlImg}`);
    img.setAttribute("alt", `${arg.altImg}`);
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
    pPrice.textContent = `Tarif : ${arg.price} ???`;
    let divSettings = document.createElement("div");
    divContent.appendChild(divSettings);
    divSettings.classList.add("cart__item__content__settings");
    let divQuantity = document.createElement("div");
    divSettings.appendChild(divQuantity);
    divQuantity.classList.add("cart__item__content__settings__quantity");
    divQuantity.style = "padding-bottom: 16px;";
    let pQuantity = document.createElement("p");
    divQuantity.appendChild(pQuantity);
    pQuantity.textContent = "Qt?? : ";
    let inputQ = document.createElement("input");
    divQuantity.appendChild(inputQ);
    inputQ.classList.add("itemQuantity");
    inputQ.setAttribute("type", "number");
    inputQ.setAttribute("name", "itemQuantity");
    inputQ.setAttribute("min", "1");
    inputQ.setAttribute("max", "100");
    inputQ.setAttribute("value", `${arg.qty}`);
    let divDelete = document.createElement("div");
    divSettings.appendChild(divDelete);
    divDelete.classList.add("cart__item__content__settings__delete");
    let pDelete = document.createElement("p");
    divDelete.appendChild(pDelete);
    pDelete.classList.add("deleteItem");
    pDelete.textContent = "Supprimer";
    // Ecoute de la quantit??, argument donn?? : " product " , nouvelle quantit??   
    inputQ.addEventListener("input", () => {
        console.log("click");
        updateQty(arg, parseInt(inputQ.value))
    }
    );

}

//**************  Fonction qui met ?? jour la quantit?? dans LS et boite *******************/
// Fonction qui met ?? jour la quantit?? dans LS et " boite "
function updateQty(arg, newValue) {
    const articlePrice = arg;
    const idProd = articlePrice.id;
    const colorProd = articlePrice.color;
    articlePrice.qty = newValue;
    if (articlePrice.qty > 0 && articlePrice.qty <= 100) {
        let product = cart.find(p => (p.Id === idProd && p.Color === colorProd));
        console.log("test de update");
        console.log(product);
        if (product)
            product.Quantity = parseInt(articlePrice.qty);
        saveArray(cart);

        PrintTotal(); // recalcule le total
    } else {
        alert("La quantit?? choisie n'est pas valide");

        let product = cart.find(p => (p.Id === idProd && p.Color === colorProd));

        if (product) {
            cart[i].Quantity = 1;
            saveArray(cart);
            if (allArticlePrice[i].id === idProd && allArticlePrice[i].color === colorProd) {
                allArticlePrice[i].qty = 1;
            }

        }
        PrintTotal();  // recalcule le total
    };
}
//**********Fonction qui affiche le prix total et la Q total *******************//
// Fonction qui calcul et affiche le prix total et la Quantit?? total 
function PrintTotal() {
    let totalPrice = 0;
    let totalQuantity = 0;
    let a = 0; // vaut quantit?? de un produit
    let b = 0; // vaut prix de un produit    
    for (i in allArticlePrice) {
        b = allArticlePrice[i].qty * allArticlePrice[i].price;
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
function delectProduct() {
    const bouton = document.querySelectorAll(".deleteItem");
    bouton.forEach(elt => {
        elt.addEventListener('click', function () {
            const delectAticle = elt.closest(".cart__item");
            const articleId = delectAticle.dataset.id;
            const articleColor = delectAticle.dataset.color;
            delectAticle.remove();
            PrintTotal();
            for (i in cart) {
                if (cart[i].Id == articleId && cart[i].Color == articleColor) {
                    let a = i;
                    cart.splice(a, 1);
                    saveArray(cart);
                    allArticlePrice.splice(a, 1);


                }
            }

        })

    });


}

//****************  FORMULAIRE *************************  
//D??claration de l'objet contact  */
let contact = {
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    email: ""
};

let validBox = false;

// regex 
let regexName = /^[a-zA-Z??????????????????????????'\s-][a-zA-Z??????????????????????????????'\s-]{2,60}$/;
let regexAddress = /^[a-zA-Z??????????????????????????0-9][0-9a-zA-Z??????????????????'\s-]{5,100}$/;
let regexCity = /^[a-zA-Z??????????????????????????][a-zA-Z??????????????????'\s-]{2,100}$/;
let regexEmail = /^[a-zA-Z0-9._-]+[@]{1}[a-zA-Z0-9._-]+[.]{1}[a-z]{2,10}$/;
//champs du formulaire
validateField("firstName", "firstNameErrorMsg", regexName, " du pr??nom ");
validateField("lastName", "lastNameErrorMsg", regexName, " du nom ");
validateField("address", "addressErrorMsg", regexAddress, " de l'adresse ");
validateField("city", "cityErrorMsg", regexCity, " de la ville ");
validateField("email", "emailErrorMsg", regexEmail, " de l'email ");

// Fonction -> r??cup??re les ??l??ments du DOM / ??coute l'??venement / appel les fonction suivante
function validateField(id, errorMsgId, regexString, messageError) {
    const element = document.getElementById(id);
    const errorElement = document.getElementById(errorMsgId);

    element.addEventListener("change", function () {
        validationForm(this, regexString, errorElement, messageError);
        if (validBox === false) {
            setContactValue(id, "")
        } else {
            setContactValue(id, this.value)
        }
    });

}
//test les regex et valider les regex
// Fonction de validation de la saisie du formulaire / affiche un message d'erreur personnalis??
function validationForm(currentComponent, regex, componentError, errorMsg) {
    let Regex = regex;
    if (!Regex.test(currentComponent.value)) {
        const ErrorMsg = componentError;
        ErrorMsg.textContent = "La saisie" + errorMsg + "n'est pas valide";
        validBox = false;
        return validBox;
    } else {
        const ErrorMsg = componentError;
        ErrorMsg.textContent = "";
        validBox = true;
        return validBox;
    }
}
// Fonction -> permet d'attribuer la bonne valeur ?? l'objet Contact
function setContactValue(field, value) {
    if (field === "firstName") {
        contact.firstName = value;
    }
    if (field === "lastName") {
        contact.lastName = value;
    }
    if (field === "address") {
        contact.address = value;
    }
    if (field === "city") {
        contact.city = value;
    }
    if (field === "email") {
        contact.email = value;
    }
}

// D??claration du tableau comprenant les ID produits
let products = [];
function ArrayID() {
    for (i in cart) {
        if (cart[i].Id) {
            products.push(cart[i].Id)
        }
    }
}
ArrayID();

// test si l'object contact est rempli ou pas  avec un compteur (y)
function testcontact() {
    let z = Object.values(contact);
    let y = 0;
    for (i in z) {
        if (z[i] === null || z[i] === undefined || z[i] === '') {
            y = -1;// bloque tout             
        } else {
            y += 1
        }
    }
    if (y === 5) { // valide et appel la fonction d'envoi des donn??es ?? l'API
        send();
    } else {
        alert("Il manque des informations dans le formulaire. Veillez ?? remplir tous les champs");
    }
}

/* R??cup??ration noeud du DOM 
    Ecoute du bouton " commander "
    v??rifie la pr??sence d'un produit au minimum dans le LS
    informe l'utilisateur si le panier est vide
*/
const commande = document.getElementById("order");
commande.addEventListener('click', function (e) {
    e.preventDefault();
    if (cart && cart.length != 0) {
        testcontact();
    } else {
        alert('Votre panier est vide, veuillez choisir au moins un produit');
    }
});

/* Fonction d'envoi des donn??es
    fetch avec le verbe post => envoi de donn??es
    information utilisateur : propose une redirection sur la page confirmation     
*/
function send() {
    fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ products, contact })//ref??rence dans l'api dans le back-end / controllers product.js
    })
        .then(function (res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function (value) {
            let x = value.orderId;
            if (confirm('Vous allez ??tre rediriger sur la page de confirmation')) {

                console.log('redirection ok');
                //insertion de l'id dans url
                window.location.href = `confirmation.html?id=${x}`;
                localStorage.clear();

            } else {
                console.log('stay here')
            }
        })
        .catch(function (err) {
            console.log("Une erreur est survenue dans l'envoi de la commande!!");
            console.log(err);
        });
}
