var btnDelete = document.getElementsByClassName('btnDelete');
var itemInCart = document.getElementsByClassName('itemInCart');
var toastNoProduct = document.getElementById('toastNoProduct');
var btnDelete = document.querySelectorAll('.btnDelete');
var idItems = document.querySelectorAll('.idItems');
const API = 'http://localhost:3700/api/v1/cart/';
let cartFunc = () => {
    if (itemInCart.length === 0) {
        toastNoProduct.style.visibility = 'visible';
    }
    else {
        toastNoProduct.style.visibility = 'hidden';
        for (let i = 0; i < itemInCart.length; i++) {
            let valueIdItems = idItems[i].innerHTML;
            btnDelete[i].addEventListener('click', e => {
                e.preventDefault();
                let parentDelete = e.target.parentNode.parentNode;
                if (itemInCart.length !== 1) {
                    console.log(itemInCart.length);
                    parentDelete.remove();
                    fetchDelete(API + valueIdItems);
                }
                else {
                    parentDelete.remove();
                    toastNoProduct.style.visibility = 'visible';
                    fetchDelete(API + valueIdItems);
                }
            });
        };
    };
}
cartFunc();
let fetchDelete = (file) => {
    fetch(file, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(err => console.log(err));
}




