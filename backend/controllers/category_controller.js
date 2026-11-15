
const categoryRepository = require('../repositories/category\_repository');

/**
 * Controlador HTTP para recuperar el listado de categorías.
 * Delega cualquier excepción al middleware global de errores mediante next(error).
 */
async function getCategories(req, res, next)
{
    try
    {
      const categories = await categoryRepository.getAll();  
      res.json(categories);
    }
   catch (error)
   {
    next(error);
   }
}

module.exports = { getCategories };