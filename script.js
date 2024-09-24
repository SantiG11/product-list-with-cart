const products = document.querySelectorAll('.product-card');


const totalItemsAmount = document.getElementById('total-items-amount');
const cartContainer = document.querySelector('.product-cart-container');
const cartImg = document.querySelector('.cart-img');
const cartPlaceHolder = document.querySelector('.cart-placeholder');
const orderTotalCont = document.querySelector('.order-total-container');
const orderTotal = document.getElementById('order-total');
const confirmBtn = document.querySelector('#confirm-order');
const carbonNeutral = document.querySelector('.carbon-neutral-container');
const startNewOrderBtn = document.getElementById('start-new-order');
const modal = document.querySelector('.modal-backdrop');
const confirmedModal = document.getElementById('confirmed-modal');

let itemsAmount = 0;
let orderTotalRes = 0;


class ProductObj {
    constructor(name, id, description, price, added) {
        this.name = name;
        this.id = id;
        this.description = description;
        this.price = price;
        this.quantity = 0;
        this.added = false;
    }

addQuantity() {
    this.quantity++;
    
}

subQuantity() {
    this.quantity--;
    
}

}

const productObjets = [];

const displayAmount = () => {
    totalItemsAmount.textContent = `(${itemsAmount})`;
}

const displayOrderTotal = () => {
    orderTotal.textContent = '$' + orderTotalRes.toFixed(2);
    console.log(orderTotalRes.toFixed(2))
}

window.onload = displayAmount;

const hideOrShowEl = (element) => {
    if (element.classList.contains('hidden')) {
        element.classList.remove('hidden');

    } else {
        element.classList.add('hidden');

    }
}


const increment = (productSelected, quantityP, totalItemPrice, cartItemAmount ) => {
    itemsAmount++;
    displayAmount();
    productSelected.addQuantity();
    quantityP.textContent = productSelected.quantity;

    const totalPrice = productSelected.quantity * productSelected.price;
    cartItemAmount.textContent = productSelected.quantity + 'x';
    totalItemPrice.textContent = '$' + totalPrice.toFixed(2);
}

const decrement = (productSelected, quantityP, el, activeBtn, cartItem, totalItemPrice, cartItemAmount) => {
    itemsAmount--;
    
    if (itemsAmount === 0) {
        hideOrShowEl(orderTotalCont);
        hideOrShowEl(cartImg);
        hideOrShowEl(cartPlaceHolder);
        hideOrShowEl(carbonNeutral);
        hideOrShowEl(confirmBtn);
    }
    displayAmount();
    productSelected.subQuantity();
    if(!productSelected.quantity){
        hideOrShowEl(el);
        cartItem.remove();
        activeBtn.remove();
    }

    const totalPrice = productSelected.quantity * productSelected.price;
    quantityP.textContent = productSelected.quantity;
    cartItemAmount.textContent = productSelected.quantity + 'x';
    totalItemPrice.textContent = '$' + totalPrice.toFixed(2);
    
}

const activateBtn = (productSelected,product, el, cartItem, totalItemPrice, cartItemAmount) => {

    const cartEl = document.getElementById(productSelected.id);
    
    const activeBtn = document.createElement('button');
    activeBtn.classList.add('add-btn', 'active');

    const quantityP = document.createElement('p');
    
    quantityP.textContent = productSelected.quantity;

    const decrementDiv = document.createElement('div');
    const decrementImg = document.createElement('img');
    decrementImg.src = 'assets/images/icon-decrement-quantity.svg';
    decrementImg.alt = 'decrement icon';
    decrementImg.classList.add('decrement-btn');
    decrementDiv.appendChild(decrementImg);

    const incrementDiv = document.createElement('div');
    const incrementImg = document.createElement('img');
    incrementImg.src = 'assets/images/icon-increment-quantity.svg';
    incrementImg.alt = 'increment icon';
    incrementImg.classList.add('increment-btn');
    incrementDiv.appendChild(incrementImg);

    decrementDiv.addEventListener('click', () => {
        decrement(productSelected, quantityP, el, activeBtn, cartItem, totalItemPrice, cartItemAmount);
        
        orderTotalRes -= parseFloat(productSelected.price);
        displayOrderTotal();
    })

    incrementDiv.addEventListener('click', () => {
        increment(productSelected, quantityP, totalItemPrice, cartItemAmount);
        
        orderTotalRes += parseFloat(productSelected.price);
        displayOrderTotal();
    })
    

    activeBtn.appendChild(decrementDiv);
    activeBtn.appendChild(quantityP);
    activeBtn.appendChild(incrementDiv);

    product.insertBefore(activeBtn, el);
    hideOrShowEl(el)
}

const removeItem = (cartItem, product, productSelected, addBtn) => {
        itemsAmount -= productSelected.quantity;
        displayAmount();
        orderTotalRes -= parseFloat(productSelected.price * productSelected.quantity);
        displayOrderTotal();
        if (itemsAmount === 0) {
            hideOrShowEl(orderTotalCont);
            hideOrShowEl(cartImg);
            hideOrShowEl(cartPlaceHolder);
            hideOrShowEl(carbonNeutral);
            hideOrShowEl(confirmBtn);
        }

        const productActiveBtn = product.querySelector('.active')
        
        cartItem.remove();
        productSelected.quantity = 0;
        productActiveBtn.remove();
        hideOrShowEl(addBtn);
}

const addCartItem = (productSelected, product, addBtn, thumbnail) => {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.id = 'cart-item-' + productSelected.id;
    cartItem.setAttribute('name', productSelected.name);

    const cartItemDetails = document.createElement('div');
    const cartItemDescription = document.createElement('h4');
    const cartItemPrice = document.createElement('p');
    const totalItemPrice = document.createElement('p');
    const cartItemAmount = document.createElement('label');
    const deleteBtn = document.createElement('img');
    

    deleteBtn.src = 'assets/images/icon-remove-item.svg';
    deleteBtn.alt = 'Remove item icon';


    cartItemDetails.appendChild(cartItemDescription);
    cartItemDetails.appendChild(cartItemAmount);
    cartItemDetails.appendChild(cartItemPrice);
    cartItemDetails.appendChild(totalItemPrice);

    cartItem.appendChild(thumbnail);
    cartItem.appendChild(cartItemDetails);
    cartItem.appendChild(deleteBtn);
    
    cartItemDetails.classList.add('product-details');
    cartItemAmount.classList.add('product-amount');
    totalItemPrice.classList.add('total-item-price');
    deleteBtn.classList.add('delete-btn');

    cartItemDescription.textContent = productSelected.description;
    cartItemAmount.textContent = productSelected.quantity + 'x';
    cartItemPrice.textContent = "@" + productSelected.price;
    totalItemPrice.textContent = `$${productSelected.price}`;

    cartContainer.appendChild(cartItem);
    activateBtn(productSelected, product, addBtn, cartItem, totalItemPrice, cartItemAmount);


    deleteBtn.addEventListener('click', () => {
        removeItem(cartItem,product, productSelected, addBtn);
        
       
    } )
}


const addToCart = (productName, product, addBtn, thumbnail) => {
    if (itemsAmount === 0) {
        hideOrShowEl(orderTotalCont);
        hideOrShowEl(cartImg);
        hideOrShowEl(cartPlaceHolder);
        hideOrShowEl(carbonNeutral);
        hideOrShowEl(confirmBtn);
    }
    const productSelected = productObjets.find(product => product.name === productName);
    productSelected.addQuantity();
    itemsAmount++;
    displayAmount();
    orderTotalRes += parseFloat(productSelected.price);
    displayOrderTotal();
    addCartItem(productSelected, product, addBtn, thumbnail);
    
}

products.forEach(product => {

    const productNameEl = product.querySelector('.product-name');
    const productName = productNameEl.textContent;
    const productDescription = product.querySelector('.product-description').textContent;
    const productPrice = product.querySelector('.product-price').textContent;
    const priceNumber = parseFloat(productPrice.replace('$', '').trim()).toFixed(2);
    const addBtn = product.querySelector('.add-btn');
    const thumbnail = product.querySelector('.thumbnail');

    const productObj = new ProductObj (
            productName, productName, productDescription, priceNumber
    );

    productObjets.push(productObj);

    addBtn.addEventListener('click', () => {
        addToCart(productName, product, addBtn, thumbnail);
    });

});



confirmBtn.addEventListener('click', () => {
    const clonedContainer = cartContainer.cloneNode(true);
    const clonedTotalContainer = orderTotalCont.cloneNode(true);
    Array.from(clonedContainer.children).forEach(node => {
        
        const thumbnail = node.querySelector('.thumbnail');
        const removeIcon = node.querySelector('.delete-btn');
        const totalPriceP = node.querySelector('.total-item-price');
        hideOrShowEl(thumbnail);
        hideOrShowEl(removeIcon)
    })
    
    
    modal.style.display = 'block';
    confirmedModal.insertBefore(clonedContainer, startNewOrderBtn);
    confirmedModal.insertBefore(clonedTotalContainer, startNewOrderBtn);
    hideOrShowEl(confirmedModal);
    

})


startNewOrderBtn.addEventListener('click', () => {
    let itemsAmount = 0;
    let orderTotalRes = 0;
    hideOrShowEl(confirmedModal);
    modal.style.display = 'none';
    
    const modalCartContainer = confirmedModal.querySelector('.product-cart-container');
    const orderTotal = confirmedModal.querySelector('.order-total-container')
    modalCartContainer.remove();
    orderTotal.remove();
    const cartItems = cartContainer.childNodes;

    for(let i = cartItems.length - 1; i > 0; i--){
        let deleteButton = cartItems[i].querySelector('.delete-btn');
        // cartItems[i].deleteBtn.click();
        // console.log(deleteButton);
        deleteButton.click();
       
        
    }
})