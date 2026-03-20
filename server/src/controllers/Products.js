const ProductsModel =  require('../models/Products')

const getAll =  async (req,res,next) => {
    try{
        const products = await ProductsModel.findAll() 
        res.json(products)
    }catch (error) {
        next(error)
    }
}

const getByID = async (req,res,next) => {
    try{
        const products_id  = await ProductsModel.findByID(req.params.id)
        if (!products_id) return res.status(404).json({message: 'ไม่พบไอดี'}) 
            res.json(products_id)
    }catch (error) {
        next(error)
    }
}

const create = async (req, res, next) => {
    try {
        console.log("ข้อมูลที่รับมา:", req.body);
        const { Product_name, Quantity, Min_stock } = req.body;

        if (!Product_name || Quantity === undefined) { 
            return res.status(400).json({ message: 'กรุณากรอกชื่อสินค้าและจำนวนให้ครบถ้วน' });
        }
        
        const result = await ProductsModel.create({
            Product_name,
            Quantity: Number(Quantity),
            Min_stock: Number(Min_stock) || 0
        });

        res.json({ 
            message: 'เพิ่มสินค้าสำเร็จ', 
            insertId: result.insertId 
        });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const { Product_name, Quantity, Min_stock } = req.body;
        if (!Product_name || Quantity === undefined || Min_stock === undefined) {
            return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
        }
        const result = await ProductsModel.update(req.params.id, { Product_name, Quantity, Min_stock });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'ไม่พบสินค้า' });
        res.json({ message: 'แก้ไขสินค้าสำเร็จ' });
    } catch (error) {
        next(error);
    }
};

const remove = async (req,res,next) => {
    try{
        const result = await ProductsModel.remove(req.params.id)
        res.json({message: 'delete ok',data: result })
    }catch(error){
        next(error)
    }
}

module.exports = {getAll,getByID,create,update,remove}
