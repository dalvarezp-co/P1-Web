const jsonInfo = "https://gist.githubusercontent.com/josejbocanegra/9a28c356416badb8f9173daf36d1460b/raw/5ea84b9d43ff494fcbf5c5186544a18b42812f09/restaurant.json";

fetch(jsonInfo).then(res => res.json()).then(restaurantEjecution);

let a = [];
function restaurantEjecution (productoArray) {

  let catList = document.getElementById("catList");

  productoArray.forEach(catProducto => {

    let li = document.createElement("li");
    li.className = "nav-item ";
    let a = document.createElement("a");
    a.className = "nav-link";
    a.textContent = catProducto.name;
    li.appendChild(a);
    catList.appendChild(li);
  });

  let prodCardsDiv = document.getElementById("products");
  let eleTable = document.getElementById("eleTable");
  let itemsOpc = document.getElementById("itemsOpc");
  let cantidad = [];

  document.querySelectorAll(".nav-link").forEach(itemNav => {

    itemNav.addEventListener("click", (event) => {
      let categoria = event.target.text;
      let catTitle = document.getElementById("catTitle");
      catTitle.textContent = categoria;
      let listCategory = productoArray.find(elementFood => elementFood.name == categoria);

      while (prodCardsDiv.lastElementChild) {
        prodCardsDiv.removeChild(prodCardsDiv.lastElementChild);
      }

      listCategory.products.forEach(item => {

        let tarDiv = document.createElement("div");
        tarDiv.className = "card cardItem";
        tarDiv.setAttribute("style", "width: 18rem;");

        let cardImg = document.createElement("img");
        cardImg.className = "card-img-top comidaImg";
        cardImg.setAttribute("src", item.image);
        cardImg.setAttribute("alt", item.name);
        
        let bodyCardDiv = document.createElement("div");
        bodyCardDiv.className = "card-body";
        
        let h5 = document.createElement("h5");
        h5.className = "card-title";
        h5.textContent = item.name;
        
        let descElem = document.createElement("p");
        descElem.className = "card-text";
        descElem.textContent = item.description;
        
        let precElem = document.createElement("p");
        precElem.className = "card-text";
        precElem.setAttribute("id", "precioElem");
        precElem.textContent = "$" + item.price;
        
        let aggButton = document.createElement("a");
        aggButton.className = "btn btn-warning btn-item";
        aggButton.setAttribute("type", "button");
        aggButton.setAttribute("id", "button-" + categoria + "-" + item.name);
        aggButton.setAttribute("position", "static")
        aggButton.textContent = "Add to card";

        aggButton.addEventListener("click", function() {
          contarElem(item, cantidad);
        });
        aggButton.addEventListener("click", function () {
          aggElems(item);
        });

        tarDiv.appendChild(cardImg);            
        bodyCardDiv.appendChild(h5);
        bodyCardDiv.appendChild(descElem);
        bodyCardDiv.appendChild(precElem);
        bodyCardDiv.appendChild(aggButton);
        tarDiv.appendChild(bodyCardDiv);
        prodCardsDiv.appendChild(tarDiv);
      });

      eleTable.innerHTML = "";
      itemsOpc.innerHTML = "";
    });
  });
    
  let headTabla = false;

  document.getElementById("eleCarrito").addEventListener("click", function () {

    eleTable.innerHTML = "";
    itemsOpc.innerHTML = "";

    while (prodCardsDiv.lastElementChild) {
      prodCardsDiv.removeChild(prodCardsDiv.lastElementChild);
    }

    let titulo = document.getElementById("catTitle");
    titulo.textContent = "Order detail";

    let tabla = document.createElement("table");
    tabla.className ="table table-striped";
        
    if(headTabla == false)
    {
      let hT = document.createElement("thead");
      let hTR = document.createElement("tr");
      let cols = ["Item", "Qty.", "Description", "Unit Price", "Amount", "Modify"];

      for (let i = 0; i < cols.length; i++) {
        let trHd = document.createElement("th");
        trHd.textContent = cols[i];
        trHd.setAttribute("scope", "col");
        hTR.appendChild(trHd);
      }

      hT.appendChild(hTR);
      tabla.appendChild(hT);
      headTabla = true;
    }

    let tBody = document.createElement("tbody");
    let totSpan;
    let index = 0;
    let total = 0;

    cantidad.forEach(element => {

      let tr = document.createElement("tr");
      let thIndex = document.createElement("th");
      thIndex.setAttribute("scope", "col");
      thIndex.textContent = index;
      let tdQty = document.createElement("td");
      tdQty.textContent = element.quantity;
      let tdDescription = document.createElement("td");
      tdDescription.textContent = element.food;
      let tdUnitPrice = document.createElement("td");
      tdUnitPrice.textContent = element.unitPrice;
      let tdAmount = document.createElement("td");
      tdAmount.textContent = element.amount;
      let tdButtons = document.createElement("td");
      let aggButton1 = document.createElement("a");
      aggButton1.className = "btn btn-warning add-btn";
      aggButton1.textContent = "+";
            
      aggButton1.addEventListener("click", function() {
        tdQty.textContent = ++element.quantity;
        tdAmount.textContent = element.quantity * element.unitPrice;
        element.amount = element.quantity * element.unitPrice;
        totSpan.textContent = "Total $" + recontTotalAgg(cantidad);
      });

      let delButton = document.createElement("a");
      delButton.className = "btn btn-warning add-btn";
      delButton.textContent = "-";

      delButton.addEventListener("click", function() {
        tdQty.textContent = --element.quantity;
        if(tdQty.textContent !== 0)
        {
          tdAmount.textContent = element.quantity * element.unitPrice;
          element.amount = element.quantity * element.unitPrice;
          totSpan.textContent = "Total $" + recontTotalDel(cantidad);
        }
        if(tdQty.textContent === "0")
        {
          tr.innerHTML = "";
          descontarElem();
        }
      });

      tr.appendChild(thIndex);
      tr.appendChild(tdQty);
      tr.appendChild(tdDescription);
      tr.appendChild(tdUnitPrice);
      tr.appendChild(tdAmount);


      tdButtons.appendChild(aggButton1);
      tdButtons.appendChild(delButton);


      tr.appendChild(tdButtons);
      tBody.appendChild(tr);
      total += element.amount;
      index++;
    });

    let filaDiv = document.createElement("div");
    filaDiv.className = "row";

    let spanDiv = document.createElement("div");
    spanDiv.className = "col";
    totSpan = document.createElement("span");
    totSpan.textContent = "Total: $" + total;
    totSpan.setAttribute("id", "elemTotal");
    spanDiv.appendChild(totSpan);
    
    let buttonDivs = document.createElement("div");
    buttonDivs.className = "col d-flex justify-content-end";
    buttonDivs.setAttribute("id", "divButtoms");

    let cancelarButton = document.createElement("button");
    cancelarButton.className = "btn btn-danger orden-btn";
    cancelarButton.textContent = "Cancel";
    cancelarButton.setAttribute("data-target", "#modCancel");
    cancelarButton.setAttribute("data-toggle", "modal");

    let confirmarButton = document.createElement("a");
    confirmarButton.className = "btn btn-success orden-btn";
    confirmarButton.textContent = "Confirm order";

    confirmarButton.addEventListener("click", function () {
      let i = 1;
      let order = [];
      cantidad.forEach(element => {
        let objectOrder = {};
        objectOrder["item"] = i;
        objectOrder["quantity"] = element.quantity;
        objectOrder["description"] = element.food;
        objectOrder["unitPrice"] = element.unitPrice;
        order.push(objectOrder);
      });
      console.log(order);
    });

    buttonDivs.appendChild(cancelarButton);
    buttonDivs.appendChild(confirmarButton);
    filaDiv.appendChild(spanDiv);
    filaDiv.appendChild(buttonDivs);
    tabla.appendChild(tBody);
    eleTable.appendChild(tabla);
    itemsOpc.appendChild(filaDiv);

    document.getElementById("buttonYes").addEventListener("click", function() {
      eleTable.innerHTML = "";
      itemsOpc.innerHTML = "";
      cantidad = [];
      headTabla = false;
      vaciarCarrito();
    });
  });
}

let itemCant = 0;
let itemCar = document.getElementById("appElem");

function vaciarCarrito () {
  itemCar.textContent = (0) + " items";
  itemCant = 0;
}

function contarElem(item, quantity) {
  itemCar.textContent = (itemCant + 1) + " items";
  let encontrado = quantity.find(elementFood =>  elementFood.food == item.name);
  if(encontrado === undefined)
  {
    let event = {};
    event["food"] = item.name;
    event["quantity"] = 1;
    event["unitPrice"] = item.price;
    event["amount"] = item.price;
    quantity.push(event);
  } else {
    encontrado.quantity ++;
    encontrado.amount = encontrado.quantity * encontrado.unitPrice;
  }
  itemCant = itemCant + 1;
}

function aggElems(item) {
    a.push(item);
}

function descontarElem() {
  itemCar.textContent = (itemCant - 1) + " items";
}

function recontTotalDel(quantity) {
  let total = 0;
  quantity.forEach(element => {
    total -= (-element.amount);
  });
  return total;
}

function recontTotalAgg(quantity) {
    let total = 0;
    quantity.forEach(element => {
      total += element.amount;
    });
    return total;
  }