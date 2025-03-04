const Banner = require("../Model/banner");
const fs=require("fs");
const path=require('path');
const{deleteFile}=require('../Route/deletephotounlink')
exports.create= async (req, res) => {
  try {
    req.body.image = `Uploads/${req.file?.filename}`;
  
    const banner = await Banner.create(req.body);

    res.status(201).json({ status: true,message:"Banner created ", data: banner });
  } catch (err) {
    res.status(400).json({ status: false, error: err.message });
  }
};


exports.getAll = async (req, res) => {
  try {
    const banner = await Banner.find().sort({createdAt : -1}); 

    if (banner.length === 0) {
      return res.status(404).json({status:false, message: 'No data found' });
    }

    res.status(200).json({status:"true",message:"Data access ",data:banner});  
  } catch (err) {
    console.error(err);
    res.status(500).json({ status:false,error:err.message });
  }
};


exports.getById=async(req,res)=>
{
const {id}=req.params;

try{
  const banner=await Banner.findById(id)
  
  if (!banner) {
    return res.status(404).json({status:false,message: 'Data not found'});
  }res.status(200).json({status:true,message:"Data access ",data:banner});

}catch(err)
{
console.error(err);
res.status(500).json({status:false,error:err.message});
}
}


exports.delete=async(req,res)=>
{ 
try{
  const bannerDelete = await Banner.findById(req.params.id);
if(!bannerDelete ){
  return res.status(404).json({status:false,message:"Data not found"});
}
if(bannerDelete .image)
{
  const imagepath=path.join(__dirname,'../Uploads',path.basename(bannerDelete.image));
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
 await Banner.findByIdAndDelete(req.params.id);

res.status(200).json({status:true,message:"Data delete successfuly",data:bannerDelete});
}catch(err)
{
  console.log(err)
  res.status(500).json({status:false,error:err.message});
}
}


exports.update=async(req,res)=>
{ 
  const updateBanner= await Banner.findById(req.params.id);
try{

  if (!updateBanner) {
    return res.status(404).json({ status: false, error: 'Data not found' });
  }
 
if(req.file!==undefined){
  Banner.image = `Uploads/${req.file?.filename}`;
  const oldfilepath=path.join(__dirname,'../Uploads',path.basename(updateBanner.image));
  deleteFile(oldfilepath)
  
}

else{
  req.body.image=updateBanner.image;
}
Object.keys(req.body).forEach(key => {
  updateBanner[key] = req.body[key];
});
await updateBanner.save();

res.status(200).json({ status: true,message:'Data updated successfully', data: updateBanner });
} catch (err) {
res.status(400).json({ status: false, error: err.message });
}


}


