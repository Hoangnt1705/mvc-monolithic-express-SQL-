let btnAddCart = document.querySelectorAll(".btnAddCart");
let API = 'http://localhost:3700/router/api/v1/cart-post';
let fetchGet = (file) => {
    fetch(file)
        .then(response => response.json())
        .then(data => {
            let dataParse = data.data
            for (let i = 0; i < dataParse.length; i++) {
                console.log(dataParse);
                btnAddCart[i].addEventListener('click', e => {
                    e.preventDefault();
                    let formPost = {
                        idProduct: dataParse[i].id,
                        idCart: dataParse[i].id_number,
                        title: dataParse[i].title,
                        idItem: dataParse[i].id_items
                    }
                    fetchPost(API, formPost)
                });
            };
        })
        .catch(err => console.error(err));
};
fetchGet(API);
let fetchPost = (file, formPost) => {
    fetch(file, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formPost)
    })
        .then(response => response.json())
        .then(data => console.log(data, "success"))
        .catch(err => console.log(err));
}


