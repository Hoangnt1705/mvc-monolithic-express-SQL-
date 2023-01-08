let btnAddCart = document.getElementsByClassName("btnAddCart");
let btnEdit = document.querySelectorAll('.btnEdit');
let API = 'http://localhost:3700/api/v1/cart-post';
let fetchGet = (file) => {
    fetch(file)
        .then(response => response.json())
        .then(data => {
            let dataParse = data.data
            for (let i = 0; i < dataParse.length; i++) {
                btnAddCart[i].addEventListener('click', e => {
                    e.preventDefault();
                    console.log(dataParse[i]);
                    let fromPost = {
                        idProduct: dataParse[i].id,
                        idCart: dataParse[i].id_number,
                        title: dataParse[i].title
                    }
                    fetch(file, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(fromPost)
                    })
                        .then(response => response.json())
                        .then(data => console.log(data, "success"))
                        .catch(err => console.log(err));
                });
            };
        })
        .catch(err => console.error(err));
};
fetchGet(API);
