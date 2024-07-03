import { Router } from "express";
import { promises as fsp } from "fs"

const router = Router();

router.get('/api/carts/', async (req, res) => {

    try {
        const data = await fsp.readFile('src/data/cart.json')
        const listadoCarritos = JSON.parse(data);
        res.send(listadoCarritos);
    } catch (error) {
        console.log(error);
    }

});


// PETICIÓN GET ID - MOSTRAR PRODUCTOS DE UN CARRITO
router.get('/api/carts/:cid', async (req, res) => {
    const idCarrito = req.params.cid;
    console.log(idCarrito);
    try {
        const data = await fsp.readFile('src/data/cart.json')
        const listadoCarritos = JSON.parse(data);
        const cart = listadoCarritos.find((element) => { return element.idCart == idCarrito});
        if(cart){
          res.send(cart.products);
        }else{
          res.send('Carrito no encontrado: ');
        }
    } catch (error) {
        console.log(error);
    }

  


});


// PETICIÓN POST - CREAR CARRITO
router.post('/api/carts/', async (req, res) => {
    const { products } = req.body;
    try {
        if(products == undefined || products == '' || products.length == 0){
            res.send('No puede crear un carrito sin productos.');
        }else{
            let idCart = `c-${Date.now()}`;
            let nuevoCarrito = {idCart, products};
            const data = await fsp.readFile('src/data/cart.json')
            const listadoCarritos = JSON.parse(data);
            listadoCarritos.push(nuevoCarrito);
            await fsp.writeFile('src/data/cart.json', JSON.stringify(listadoCarritos));

            res.send(nuevoCarrito);
        }
       
    } catch (error) {
        console.log(error);
    }

});


// PETICIÓN POST - AGREGAR PRODUCTO AL CARRITO
router.post('/api/carts/:cid/product/:pid', async (req, res) => {
    const  quantity  = parseInt(req.body.quantity);
    const idCarrito = req.params.cid;
    const idProducto = req.params.pid;
    try {
        if(quantity == undefined || quantity <= 0){
            res.send('La cantidad debe ser mayor a 0.');
        }else{
            const data = await fsp.readFile('src/data/cart.json')
            const listadoCarritos = JSON.parse(data);
            const carrito = listadoCarritos.find((element)=> {return element.idCart == idCarrito})
            if(carrito){
                const indexProduct = carrito.products.findIndex((element) => { return element.product == idProducto})
                if(indexProduct >= 0){
                    carrito.products[indexProduct].quantity += quantity;
                }else{
                    carrito.products.push({product: idProducto, quantity});
                }
                const indiceCarrito = listadoCarritos.findIndex((element) => {return element.idCart == idCarrito});
                listadoCarritos[indiceCarrito] = carrito;
                await fsp.writeFile('src/data/cart.json', JSON.stringify(listadoCarritos));
                res.send(carrito)
            }else{
                res.send('El id del carrito ingresado es incorrecto')
            }
            
        }
       
    } catch (error) {
        console.log(error);
    }

});

export default router;