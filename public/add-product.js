var title = document.getElementById('formFetch').title;
var imageUrll = document.getElementById('formFetch').imageUrll;
var price = document.getElementById('formFetch').price;
var description = document.getElementById('formFetch').description;
var formFetch = document.getElementById('formFetch');
var save = document.getElementById('save');
var id = document.getElementById('id').innerHTML
var API = `http://localhost:3700/api/v1/cart/${id}`
console.log(API);
imageUrll.addEventListener('keyup', e => {
    e.preventDefault();
    console.log(imageUrll.value);
})

formFetch.addEventListener('submit', e => {
    e.preventDefault();
    let fetchPutAddProduct = (file) => {
        fetch(file, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title.value,
                imageUrl: imageUrll.value,
                price: Number(price.value),
                description: description.value,
            }),
        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(err => console.log(err));
    };
    fetchPutAddProduct(API)
})



