const products = document.querySelectorAll('.product-card');


const totalItemsAmount = document.getElementById('total-items-amount');
const cartContainer = document.querySelector('.product-cart-container');
const cartImg = document.querySelector('.cart-img');
const cartPlaceHolder = document.querySelector('.cart-placeholder')
const orderTotalCont = document.querySelector('.order-total-container');
const orderTotal = document.getElementById('order-total');
const confirmBtn = document.querySelector('.confirm-order-btn');
const carbonNeutral = document.querySelector('.carbon-neutral-container');


let itemsAmount = 0;
let orderTotalRes = 0;


class ProductObj {
    constructor(name, id, description, price) {
        this.name = name;
        this.id = id;
        this.description = description;
        this.price = price;
        this.quantity = 0;
    }

addQuantity() {
    this.quantity++;
    console.log(this.quantity);
}

subQuantity() {
    this.quantity--;
    console.log(this.quantity);
}

}

const productObjets = [];

products.forEach(product => {
    // Use a unique identifier for each product;
    
    const productNameEl = product.querySelector('.product-name');
    const productName = productNameEl.textContent;
    const productId = productName;
    const productDescription = product.querySelector('.product-description').textContent;
    const productPrice = product.querySelector('.product-price').textContent;
    const priceNumber = parseFloat(productPrice.replace('$', '').trim());
    const addBtn = product.querySelector('.add-btn');

    const productObj = new ProductObj (
            productName, productId, productDescription, priceNumber
    );

   

    productObjets.push(productObj);

    addBtn.addEventListener('click', (e) => {
        if (itemsAmount === 0) {
            hideOrShowEl(orderTotalCont);
            hideOrShowEl(cartImg);
            hideOrShowEl(cartPlaceHolder);
            hideOrShowEl(carbonNeutral);
            hideOrShowEl(confirmBtn);
        }
        itemsAmount++;


        displayAmount();
        // addProduct( productId, productDescription, productPrice, priceNumber);
        activateBtn(product, productId, priceNumber, addBtn);



    });
});

const productToFind = 'Waffle';

productObjets.find(product => product.name === productToFind).addQuantity();
productObjets.find(product => product.name === productToFind).addQuantity();
productObjets.find(product => product.name === productToFind).addQuantity();
productObjets.find(product => product.name === productToFind).subQuantity();

console.log(productObjets.find(product => product.name === productToFind));

const hideOrShowEl = (element) => {
    if (element.classList.contains('hidden')) {
        element.classList.remove('hidden');

    } else {
        element.classList.add('hidden');

    }
}


const displayAmount = () => {
    totalItemsAmount.textContent = `(${itemsAmount})`;
}


const updateOrderTotal = (num) => {
    orderTotalRes = orderTotalRes + num;
    orderTotal.textContent = '$' + orderTotalRes.toFixed(2);
}

const deleteItem = (e) => {
    let item = e.target.parentElement;
    let itemId = item.id
    let deletedAmount = item.querySelector('.product-amount').textContent;
    let deletedTotalItemPrice = item.querySelector('.total-item-price').textContent;
    let deletedPriceNumber = parseFloat(deletedTotalItemPrice.replace('$', '').trim());
    


    if (parseInt(deletedAmount)) {
        itemsAmount = itemsAmount - parseInt(deletedAmount);
    } else {
        itemsAmount -= 1
    }
    updateOrderTotal(-deletedPriceNumber);
    displayAmount();
    productMap.delete(item.id);
    item.remove();
    if (itemsAmount === 0) {
        
        hideOrShowEl(orderTotalCont);
        hideOrShowEl(cartImg);
        hideOrShowEl(cartPlaceHolder);
        hideOrShowEl(carbonNeutral);
        hideOrShowEl(confirmBtn);
    }
}


const createItemEl = (product, quantity, itemAdded, productId, productDescription, productPrice, priceNumber) => {

    
 
    itemAdded = document.createElement('div');
    itemAdded.classList.add('cart-item');
    itemAdded.id = productId;

    const itemAddedDescription = document.createElement('h4');
    const itemAddedPrice = document.createElement('p');
    const totalItemPrice = document.createElement('p');
    const itemAddedAmount = document.createElement('label');
    const deleteBtn = document.createElement('img');

    deleteBtn.src = 'assets/images/icon-remove-item.svg';
    deleteBtn.alt = 'Remove item icon';

    itemAdded.appendChild(itemAddedDescription);
    itemAdded.appendChild(itemAddedAmount);
    itemAdded.appendChild(itemAddedPrice);
    itemAdded.appendChild(totalItemPrice);
    itemAdded.appendChild(deleteBtn);

    itemAddedAmount.classList.add('product-amount');
    totalItemPrice.classList.add('total-item-price');
    deleteBtn.classList.add('delete-btn');

    deleteBtn.addEventListener('click', (e) => {
        deleteItem(e);
        
        
    });
    // Store reference in the map
    productMap.set(productId, { element: itemAdded, amount: 1 });

    itemAddedDescription.textContent = productDescription;
    itemAddedAmount.textContent = '1x';
    itemAddedPrice.textContent = "@" + productPrice;
    totalItemPrice.textContent = `$${priceNumber.toFixed(2)}`;
    updateOrderTotal(priceNumber)
    // For easier querying later

    cartContainer.appendChild(itemAdded);
    displayAmount()

}

const updateProductEl = (productId, priceNumber, quant) => {
    const { element, amount } = productMap.get(productId);
    const newAmount = amount + quant;

    const totalItemPriceElement = element.querySelector('.total-item-price');
    const amountElement = element.querySelector('.product-amount');
    const totalItemPrice = parseFloat((newAmount * priceNumber).toFixed(2))

    amountElement.textContent = `${newAmount}x`;
    totalItemPriceElement.textContent = `$${totalItemPrice.toFixed(2)}`;

    if (quant >= 0) {
        updateOrderTotal(priceNumber);
    } else {
        updateOrderTotal(-priceNumber);
    }


    
}


const addProduct = (product, quantity, productId, productDescription, productPrice, priceNumber) => {
    let itemAdded = productMap.get(productId);


    if (!itemAdded) {
        // Create a new product entry
        createItemEl(product, quantity, itemAdded, productId, productDescription, productPrice, priceNumber)

    }
}

window.onload = displayAmount;




const activateBtn = (quantity, product, productId, priceNumber, el) => {

    const cartEl = document.getElementById(productId);

    const activeBtn = document.createElement('button');
    activeBtn.classList.add('add-btn', 'active');

    const quantityP = document.createElement('p');
    
    quantityP.textContent = quantity;

    const decrementDiv = document.createElement('div');
    const decrementImg = document.createElement('img');
    decrementImg.src = 'assets/images/icon-decrement-quantity.svg';
    decrementImg.alt = 'decrement icon';
    decrementImg.classList.add('decrement-btn');
    decrementDiv.appendChild(decrementImg);

    decrementDiv.addEventListener('click', () => {


        updateProductEl(productId, priceNumber, -1);

        

        quantity--;
        
        
        quantityP.textContent = quantity;
        if (quantity < 1) {
            const deleteBtn = cartEl.querySelector('.delete-btn')

            hideOrShowEl(activeBtn);
            hideOrShowEl(el);


            deleteBtn.click();

        } else {
            itemsAmount--
            displayAmount();
        }
        
    })

    const incrementDiv = document.createElement('div');
    const incrementImg = document.createElement('img');
    incrementImg.src = 'assets/images/icon-increment-quantity.svg';
    incrementImg.alt = 'increment icon';
    incrementImg.classList.add('increment-btn');
    incrementDiv.appendChild(incrementImg);

    incrementDiv.addEventListener('click', () => {

        updateProductEl(productId, priceNumber, 1);
        quantity++;
        itemsAmount++;
        quantityP.textContent = quantity;
        displayAmount();
    })


    activeBtn.appendChild(decrementDiv);
    activeBtn.appendChild(quantityP);
    activeBtn.appendChild(incrementDiv);

    product.insertBefore(activeBtn, el);
    hideOrShowEl(el)
}



