const fs=require('fs').promises;

const deleteFile=async(filepath)=>
{
    try{
        await fs.unlink(filepath);
        console.log('file unlink success');
    }
    catch(error)
    {
        console.log(error.message);
    }
}
module.exports={
    deleteFile
}