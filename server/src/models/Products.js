const {getConnection} = require('../config/db')

const findAll  = async () => {
    const conn =  await getConnection()
    const [rows] = await conn.query('SELECT * FROM Products')
    return rows
}


const findByID =  async (product_id) => {
    const conn =  await getConnection ()
    const [rows] = await conn.query('SELECT * FROM Products WHERE Products_id = ?',[product_id])
    return rows[0]
}

const create = async (data) => {
  const conn = await getConnection();
  const { Product_name, Quantity, Min_stock } = data;
  
  const [result] = await conn.query(
    'INSERT INTO Products (Product_name, Quantity, Min_stock) VALUES (?, ?, ?)',
    [Product_name, Quantity, Min_stock]
  );
  return result;
};



const update = async (product_id, data) => {
  const conn = await getConnection();
  const { Product_name, Quantity, Min_stock } = data;
  const [result] = await conn.query(
    'UPDATE Products SET Product_name = ?, Quantity = ?, Min_stock = ? WHERE Products_id = ?',
    [Product_name, Number(Quantity), Number(Min_stock), parseInt(product_id)]
  );
  return result;
};


const remove = async (product_id) => {
  const conn = await getConnection()
  await conn.query('DELETE FROM Inventory_logs WHERE Product_id = ?', [product_id]);
  const [result] = await conn.query('DELETE FROM Products WHERE Products_id = ?', [parseInt(product_id)])
  return result
}

module.exports =  { findAll,findByID,create,update,remove }
