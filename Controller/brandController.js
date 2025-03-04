const Brands = require("../Model/brand");

exports.create=async(req,res)=>
{
    try{

        // const Brand=await Brands.create(req.body);

        const newUser = new Brands({
            name: req.body.name,
         });
         const savedProduct = await newUser.save();
        res.status(201).json({ status: true,message:"Data created", data: savedProduct});
    }
    catch (err) {
        res.status(400).json({ status: false, error: err.message });
        // console.log(err)
      }
 
}


exports.update=async(req,res)=>
{
    const id=req.params.id;
    const update=await Brands.findById(id);
    try{
 
 if(!update)
 {
   return res.status(404).json({status:false,message:"Data not found"});
 }
 Object.keys(req.body).forEach(key => {
    update[key] = req.body[key];
  });
 await update.save();
 res.status(200).json({status:true,message:'Data updated',data:update});
}catch (err) {
    res.status(400).json({ status: false, error: err.message });
    // console.log(err)
  }
    
}

exports.getAll=async(req,res)=>
{
    try {
        const datas = await Brands.find().sort({createdAt : -1}); 
    
        if (datas.length === 0) {
          return res.status(404).json({ status:false,message: 'Data not found' });
        }
    
        res.status(200).json({status:true,message:"Data access",data:datas});  
      } catch (err) {
        console.error(err);
        res.status(500).json({ status:false,error:err.message });
      }
}

exports.delete=async(req,res)=>
{
    const id=req.params.id;
    const deletes=await Brands.findById(id)
    try{
        if(!deletes)
        {
           return res.status(404).json({status:false,message:"Data not found"});
        }
        await Brands.findByIdAndDelete(id);
        res.status(200).json({status:true,message:"Data delete "});
    }catch(err)
    {
        res.status(500).json({status:false,error:message.err});
    }
}

exports.get=async(req,res)=>
    { const {id}=req.params;

try{
  const updated=await Brands.findById(id)
  
  if (!updated) {
    return res.status(404).json({status:false,message: 'Data  not found' });
  }res.status(200).json({status:true,message:" Data access ",data:updated});

}catch(err)
{
console.error(err);
res.status(500).json({status:false,error:err.message});
}
    }