const cards = document.getElementById('cards');
const items = document.getElementById('items');
const footer = document.getElementById('footer');
const templateCard = document.getElementById('template-card').content;
const templateFooter = document.getElementById('template-footer').content;
const templateCarrito = document.getElementById('template-carrito').content;
const fragment = document.createDocumentFragment();
let carrito = [];

document.addEventListener('DOMContentLoaded',() => {
    fetchData();
})

const fetchData = async() => {
    try{
        const res = await fetch('api.json');
        const data = await res.json(); // Cargo lo que tengo en api.json en data
        paintCards(data);
    } catch (error){
        console.log(error);
    }
}

const paintCards = data => {
    data.forEach(producto => {
        templateCard.querySelector('h5').textContent = producto.title;
        templateCard.querySelector('p').textContent = producto.precio;
        templateCard.querySelector('img').setAttribute('src',producto.thumbnailUrl); // Incorporamos la imagen del producto al src vacio del html
        templateCard.querySelector('.btn-dark').dataset.id = producto.id; // le agregamos el atributo id a cada boton

        const clone = templateCard.cloneNode(true);
        fragment.appendChild(clone);
    })
    cards.appendChild(fragment);
}

// EVENT DELEGATION

cards.addEventListener('click', e => {
    addToCart(e);
});

items.addEventListener('click', e => {
    btnAumentarDisminuir(e);
})

function addToCart(e){
    if(e.target.classList.contains('btn-dark')){
       setCarrito(e.target.parentElement);
    }
    e.stopPropagation()
}

const setCarrito = objeto => {
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }

    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1;
    }

    carrito[producto.id] = {...producto}; // Agrego el producto al final del carrito
    paintCart(); 
}

const paintCart = () => { // Supongamos que carrito [3] = 'auto', 'camion',pizza
    console.log(carrito);
    items.innerHTML = '';
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id,
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title,
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad,
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id,
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id,
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio;
        
        const clone = templateCarrito.cloneNode(true);
        fragment.appendChild(clone);
    })
    items.appendChild(fragment);


    paintFooter();
}

const paintFooter = () => {

    footer.innerHTML = '';    
    if(Object.keys(carrito).length === 0){
        footer.innerHTML = `
        <th scope = "row" coLspan = "5"> Carrito vacio - comience a comprar! </th>
        `
        return;
    }
    
    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad , 0);
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio,0);
    console.log(nPrecio);

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad;
    templateFooter.querySelector('span').textContent = nPrecio;

    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone);
    footer.appendChild(fragment);

    const btnEliminarCarrito = document.getElementById('vaciar-carrito');
    btnEliminarCarrito.addEventListener('click', () => {
        carrito = {};
        paintCart();
    });
}

const btnAumentarDisminuir = e => {
    if (e.target.classList.contains('btn-info')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = { ...producto }
        paintCart()
    }

    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        } else {
            carrito[e.target.dataset.id] = {...producto}
        }
        paintCart()
    }
    e.stopPropagation()
}