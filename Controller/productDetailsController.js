const Productdetails=require('../Model/productDetails')

exports.create=async(req,res)=>
{try{
    const createdproduct=await Productdetails.create(req.body);
    res.status(201).json({status:true,message:'Data create ',data:createdproduct})
}catch(err){
    res.status(400).json({status:false,error:err.message})
}

}
exports.update=async(req,res)=>
    {const id=req.params.id;
        try{
            const createdproduct=await Productdetails.findById(id);
            if(!createdproduct)
            {
                res.status(404).json({status:false,message:'Data not found'})
            } 
             Object.keys(req.body).forEach(key => {
                createdproduct[key] = req.body[key];
            
            });
            await createdproduct.save();
            res.status(400).json({status:true,message:'Data updated ',data:createdproduct})
        }catch(err){
            res.status(400).json({status:false,error:err.message})
        }
          
    }
exports.delete=async(req,res)=>
{ const id=req.params.id;
    const deletes=await Productdetails.findById(id);
    try{
      if(!deletes)
      {
        res.status(404).json({status:false,message:'Data not found'});
      }
      await Productdetails.findByIdAndDelete(deletes)
      res.status(200).json({status:true,message:'Data deleted '});
    }catch(err)
    {
      res.status(500).json({status:false,error:err.message});
    }
}
exports.getAll=async(req,res)=>
    {
      try{
        const productget=await Productdetails.find().sort({created:-1});
        if(!productget)
        {
           return res.status(404).json({status:false,message:'Data no data'});
        }
         res.status(200).json({status:true,message:' Data access',data:productget});
      }  catch(err)
      {
        res.status(500).json({status:false,error:err.message});
      }
    }
exports.getById=async(req,res)=>
{
    try{
        const id=req.params.id;
        const productget=await Productdetails.findById(id);
        if(!productget)
        {
           return res.status(404).json({status:false,message:'Data not found'});
        }
         res.status(200).json({status:true,message:'Data access',data:productget});
      }  catch(err)
      {
        res.status(500).json({status:false,error:err.message});
      }
}