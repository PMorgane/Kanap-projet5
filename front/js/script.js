const KanapAPI = "http://localhost:3000/api/products/";
const addArticle = document.querySelector('#items');
const displayProduit = (productsRes) => {
    for (let product of productsRes) {
        // Insertion des produits sur la page d'acceuil
        const newId = document.createElement("a");
        newId.setAttribute("href", `product.html?id=${product._id}`);
        newId.innerHTML = `
        <article>
        <img src="${product.imageUrl}" alt="${product.altTxt}">
        <h3 class="">${product.name}</h3>
        <p class="productDescription">${product.description}</p>
      </article>`;
        addArticle.appendChild(newId);
    };
}
// Requete API des informations des produits
function Api() {

    fetch(KanapAPI)
        .then((res) => res.json())
        .then(displayProduit)
        .catch(function (err) {
            console.log("Une erreur est survenue !!");
        })

} 
Api();