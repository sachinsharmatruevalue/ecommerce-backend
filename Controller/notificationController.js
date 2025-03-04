const Notification = require("../Model/notification");
const path = require('path');
const fs = require('fs');
const{deleteFile}=require('../Route/deletephotounlink')
exports.createNotification=async(req,res)=>
{
 try{
    req.body.image = `Uploads/${req.file?.filename}`;
 const notification=await Notification.create(req.body);
 res.status(201).json({status:true,message:'Data created ',data:notification})
}catch(err)
{
    res.status(400).json({status:false,error:err.message});
}
}

exports.getAllNotification = async (req, res) => {
    try {
      let filter = {};
  
      if (req.user.userType !== 'Admin') {
        filter.status = "Active"; 
       
      }
  
      const notifications = await Notification.find(filter).sort({ createdAt: -1 });
  
      res.status(200).json({ status: true,message:'Data access', data: notifications });
    } catch (err) {
      res.status(500).json({ status: false,error:err.message});
    }
  };
  

  exports.deleteNotification=async(req,res)=>
    { 
    try{
      const notificationDelete = await Notification.findById(req.params.id);
    if(!notificationDelete ){
      return res.status(404).json({status:false,message:"Data not found"});
    }
    if(notificationDelete .image)
    {
      const imagepath=path.join(__dirname,'../Uploads',path.basename(notificationDelete.image));
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
     await Notification.findByIdAndDelete(req.params.id);
    
    res.status(200).json({status:true,message:"Data  deleted",data:notificationDelete});
    }catch(err)
    {
      console.log(err)
      res.status(500).json({ status: false,error:err.message});
    }
    }
    
    exports.updateNotification = async (req, res) => {
        try {
          
          const notificationUpdate = await Notification.findById(req.params.id);
          if (!notificationUpdate) {
            return res.status(404).json({ status: false, error: 'Notification not found' });
          }
      
          // Check if an image file is provided
          if (req.file!==undefined) {
             Notification.image = `Uploads/${req.file?.filename}`;
              const oldfilepath=path.join(__dirname,'../Uploads',path.basename(notificationUpdate.image));
              deleteFile(oldfilepath)
          } else {
            // Retain the existing image
            req.body.image = notificationUpdate.image;
          }
      
          // Update the notification with new data
          Object.keys(req.body).forEach(key => {
            notificationUpdate[key] = req.body[key];
          });
      
          await notificationUpdate.save();
      
          res.status(200).json({ status: true,message:'Data updated ', data: notificationUpdate });
        } catch (err) {
          res.status(400).json({ status: false, error: err.message });
        }
      };

exports.getNotification=async(req,res)=>
{

  const {id}=req.params;

  try{
    const notification=await Notification.findById(id)
    
    if (!notification) {
      return res.status(404).json({status:false,message: 'Data not found'});
    }res.status(200).json({status:true,message:"Data access ",data:notification});
  
  }catch(err)
  {
  console.error(err);
  res.status(500).json({status:false,error:err.message});
  }
}
      