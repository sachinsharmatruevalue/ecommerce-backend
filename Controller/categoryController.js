
const Category = require("../Model/category")
const {deleteFile}=require('../Route/deletephotounlink');
const path=require('path');
exports.categoryCreate=async(req,res)=>
{
 try{
    req.body.image=`Uploads/${req.file?.filename}`;
    const category= await Category.create(req.body);
    res.status(201).json({status:true,message:'Data created',data:category})
 }
 catch(err)
 {
    res.status(400).json({status:false,error:err.message})
 }
}

exports.categoryUpdate=async(req,res)=>
{
 const updateCategory= await Category.findById(req.params.id);
 try{
    if(!updateCategory)
        {
       return res.status(404).json({status:false,message:'Data not found'});
        }
        if(req.file!==undefined)
        {
        Category.image = `Uploads/${req.file?.filename}`;
            const oldfilepath=path.join(__dirname,'../Uploads',path.basename(updateCategory.image));
            deleteFile(oldfilepath)
            
            
        }else{
            req.body.image=Category.image;
        }
        Object.keys(req.body).forEach(key => {
          updateCategory[key] = req.body[key];
        
        });
        await updateCategory.save();
        res.status(200).json({ status: true,message:'Data updated ' ,data: updateCategory });

    }
    catch(err)
    {
        res.status(400).json({ status: false, error: err.message });
    }
}

exports.categoryDelete=async(req,res)=>
{
    const categoryId = req.params.id;
    try {
      const deletedCategory = await Category.findByIdAndDelete(categoryId);
      if (!deletedCategory) {
        return res.status(404).json({status:false, message: 'Data not found' });
      }
      if(deletedCategory .image)
      {
        const imagepath=path.join(__dirname,'../Uploads',path.basename(deletedCategory.image));
        if(fs.existsSync(imagepath))
        {
          fs.unlink(imagepath,(err)=>
          {
           if(err)
           {
            console.err('Failed to delete',err);
           }
          })
        }
      }
      await banner.findByIdAndDelete(req.params.id);
      res.status(200).json({status:true, message: 'Data deleted ' });
    } catch (err) {
      res.status(500).json({status:false, error: err.message});
    }
  
}

exports.categoryGetAll=async(req,res)=>
{
 const category=await Category.find().sort({createdAt:-1});
 try
 {
    if(category.length==0) {
        return res.status(404).json({status:false, message: 'Data not found' });
        }
        res.status(200).json({status:true,message:'All data access ',data:category}) 
 }catch(err)
 {
    res.status(500).json({status:false,error:err.message});
 }
  
}

exports.categoryGetById=async(req,res)=>
{
  const id=req.params.id;
  const category=await Category.findById(id);
  try
  {
     if(category.length==0) {
         return res.status(404).json({status:false, message: 'Data not found' });
         }
         res.status(200).json({status:true,message:'Data access',data:category}) 
  }catch(err)
  {
     res.status(500).json({status:false,error:err.message});
  }
}

