
const subCategory=require('../Model/subCategory')
const {deleteFile}=require('../Route/deletephotounlink');
const path=require('path');
exports.subCategoryCreate=async(req,res)=>
{
 try{
req.body.image=`Uploads/${req.file?.filename}`;
const subCategories=await subCategory.create(req.body)

res.status(201).json({staus:true,message:'Data created',data:subCategories})

 }catch (err) {
    res.status(400).json({ status: false, error: err.message });
  }

}
exports.subCategoryUpdate=async(req,res)=>
{ const updateSubCategory=await subCategory.findById(req.params.id);
    try{
        if(!updateSubCategory)
        {
          return  res.status(404).json({staus:false,message:'Data not found'})
        }
        if(req.file!==undefined)
            {
                subCategory.image = `Uploads/${req.file?.filename}`;
                const oldfilepath=path.join(__dirname,'../Uploads',path.basename(updateSubCategory.image));
                deleteFile(oldfilepath)
                
                
            }else{
                req.body.image=subCategory.image;
            }
            Object.keys(req.body).forEach(key => {
                updateSubCategory[key] = req.body[key];
            
            });
            await updateSubCategory.save();
       res.status(200).json({status:true,message:'Data updated ',data:updateSubCategory})

    }catch(err)
    {
        res.status(400).json({status:false,error:err.message});

    }
}
exports.subCategoryDelete=async(req,res)=>
{const id=req.params.id;
    try{
        const deletesubCategory=await subCategory.findById(id);
        if(!deletesubCategory)
        {
          return  res.status(404).json({status:false,message:"Data not  found"});
        }
        if(req.file!==undefined)
            {
                subCategory.image = `Uploads/${req.file?.filename}`;
                const oldfilepath=path.join(__dirname,'../Uploads',path.basename(deletesubCategory.image));
                deleteFile(oldfilepath)
                
                
            }else{
                req.body.image=subCategory.image;
            }
        await subCategory.findByIdAndDelete(req.params.id);
        res.status(200).json({status:true,message:' Data deleted '});
    }catch(err)
    {
        res.status(500).json({status:false,error:err.message})
    }
   
   



}

exports.subCategoryGetAll=async(req,res)=>
{
    const getAllSubCategory=await subCategory.find().sort({created:-1});
    try{

        if(getAllSubCategory.length==0)
        {
          return  res.status(404).json({status:false,message:'Data not found'})
        }
        res.status(200).json({status:true,messaage:'Data access',data:getAllSubCategory})
    }
    catch(err)
    {
        res.status(500).json({status:false,error:err.message});
    }
}

exports.subCategoryGetById=async(req,res)=>
{const id=req.params.id;
    const getSubcategory=await subCategory.findById(id);
    try{

        if(getSubcategory.length==0)
        {
          return  res.status(404).json({status:false,message:'Data not found'})
        }
        res.status(200).json({status:true,messaage:'Data access',data:getSubcategory})
    }
    catch(err)
    {
        res.status(500).json({status:false,error:err.message});
    }
}
