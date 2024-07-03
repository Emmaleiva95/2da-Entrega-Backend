import { Router } from "express";
import {promises as fsp} from "fs"

const router = Router();

router.get('/', (req, res) => {
    res.render('index', {})
});

router.get('/home', async (req, res) => {

  try{
    const data = await fsp.readFile('src/data/products.json')
    const arrayProductos = JSON.parse(data);
    console.log(arrayProductos);

    res.render('home', {productos: arrayProductos})
   
  }catch(error){
      console.log(error);
  }

    
});

router.get('/realtimeproducts', async (req, res) => {

    try{
      const data = await fsp.readFile('src/data/products.json')
      const arrayProductos = JSON.parse(data);
      console.log(arrayProductos);
  
      res.render('realtimeproducts', {productos: arrayProductos})
     
    }catch(error){
        console.log(error);
    }
  
      
  });


  
/*
router.get('/realtimeproducts/delete', (req,res) => {
    const socket = req.socketIO;
    socket.emit('productDeleted', 'Producto eliminado con éxito');
    res.json('Producto eliminado con éxito');

})
*/


export default router;