import { Router } from "express";
import {promises as fsp} from "fs"

const router = Router();

router.get('/api/products/', async (req, res) => {
  let limit = req.query.limit;
  try{
    const data = await fsp.readFile('src/data/products.json')
    const arrayProductos = JSON.parse(data);
    if(limit != undefined && limit > 0){
      let arrayProductosLimit = arrayProductos.slice(0,limit);
  
      res.send(arrayProductosLimit);
    }else{
    
      res.send(arrayProductos);
    }
   
  }catch(error){
      console.log(error);
  }

});

router.get('/api/products/:idp', async (req, res) => {
    const idProducto = req.params.idp;
    try{
      const data = await fsp.readFile('src/data/products.json')
      const arrayProductos = JSON.parse(data);
      const producto = arrayProductos.find((element) => { return element.id == idProducto});
      if(producto){
        res.send(producto);
      }else{
        res.send('Producto no encontrado: ');
      }

     
    }catch(error){
        console.log(error);
    }
   
  });

  // PETICIÓN POST - CREAR RECURSO
router.post('/api/products/', async (req,res) => {
    const {title, description, code, price, stock, category, thumbnails} = req.body;
    let status = true;

    if(title == '' || description == '' || code == '' || price == '' || stock == '' || description == undefined || category == '' || thumbnails == undefined){
      
      res.send('No puede dejar campos vacíos.');
    }else{
      let id = Date.now();
      let nuevoProducto = {id, title, description, code, price, status, stock, category, thumbnails}
      try {
        const data = await fsp.readFile('src/data/products.json')
        const arrayProductos = JSON.parse(data);
        arrayProductos.push(nuevoProducto);
        await fsp.writeFile('src/data/products.json', JSON.stringify(arrayProductos));
        res.send(nuevoProducto);

      } catch (error) {
        console.log(error);
      }

    }
  
})


// PETICIÓN PUT - ACTUALIZAR RECURSO
router.put('/api/products/:idp', async (req, res) => {
  const idProducto = req.params.idp;
  const {title, description, code,status, category, thumbnails} = req.body;
  const price = parseFloat(req.body.price)
  const stock = parseFloat(req.body.stock)
  
  if(title == '' || description == '' || code == '' || price == '' || stock == '' || description == undefined || category == '' || thumbnails == undefined){
    res.send('No puede dejar campos vacíos.');
  }else{
    try{
      const data = await fsp.readFile('src/data/products.json')
      const arrayProductos = JSON.parse(data);
      const indiceProducto = arrayProductos.findIndex((element) => { return element.id == idProducto});
      if(indiceProducto >= 0){
        
        arrayProductos[indiceProducto] = {... arrayProductos[indiceProducto], title, description, code, price,status, stock, category, thumbnails}
        await fsp.writeFile('src/data/products.json', JSON.stringify(arrayProductos));
        res.send(arrayProductos[indiceProducto]);
      }else{
        res.send('Producto no encontrado: ');
      }
  
     
    }catch(error){
        console.log(error);
    }
  }
  
 
});

// PETICIÓN DELETE - ELIMINAR RECURSO

router.delete('/api/products/:idp', async (req, res) => {
  const idProducto = req.params.idp;
  try{
    const data = await fsp.readFile('src/data/products.json')
    const arrayProductos = JSON.parse(data);
    const indiceProducto = arrayProductos.findIndex((element) => { return element.id == idProducto});
    if(indiceProducto >= 0){
      arrayProductos.splice(indiceProducto,1);
      await fsp.writeFile('src/data/products.json', JSON.stringify(arrayProductos));
      res.send('Producto eliminado');
    }else{
      res.send('Producto no encontrado: ');
    }

   
  }catch(error){
      console.log(error);
  }
 
});

export default router;
