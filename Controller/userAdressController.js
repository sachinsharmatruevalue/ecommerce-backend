const UserAddress=require('../Model/userAddress')
exports.create=async(req,res)=>
{
    try{
    const address=await UserAddress.create(req.body)
    res.status(201).json({status:true,message:'Data create successfully',data:address})
}catch(err)
{
    res.status(400).json({ status: false, error: err.message });
}
 
}


exports.getAll=async(req,res)=>
    {
        try{
            const address=await UserAddress.find().sort({created:-1});
            if(address.length==0)
                {
                    return res.status(404).json({status:false,messgae:'Data not found'});
                }
                res.status(400).json({status:true,message:'Data access',data:address});
        }catch(err)
        {
            res.status(500).json({ status: false, error: err.message });
        }
        
    }

    exports.delete=async(req,res)=>
    {
    const id=req.params.id;
    const deletes=await UserAddress.findById(id);
    try{
      if(!deletes)
      {
       return res.status(404).json({status:false,message:'Data not found'});
      }
      await UserAddress.findByIdAndDelete(deletes)
      res.status(200).json({status:true,message:'Data deleted '});
    }catch(err)
    {
      res.status(500).json({status: false, error: err.message });
    }
    }
    exports.update=async(req,res)=>
        {
            const id=req.params.id;
            const updated=await UserAddress.findById(id);  
            try{
                if(!updated)
                {
                 return res.status(404).json({status:false,message:'Data not found'});
                }
                Object.keys(req.body).forEach(key => {
                    updated[key] = req.body[key];
                
                });
                await updated.save();
                res.status(200).json({status:true,message:'Data updated',data:updated});
              }catch(err)
              {
                console.log(err);
                res.status(500).json({status: false, error: err.message });
              } 
        }

        exports.getById=async(req,res)=>
            {  const id=req.params.id;
                const address=await UserAddress.findById(id);
                try{
                   
                    if(address.length==0)
                        {
                            return res.status(404).json({status:false,messgae:'Data not found'});
                        }
                        res.status(400).json({status:true,message:'Data access',data:address});
                }catch(err)
                {
                    res.status(500).json({ status: false, error: err.message });
                }
            }