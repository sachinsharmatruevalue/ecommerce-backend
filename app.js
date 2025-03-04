const express =require("express");
const app=express();
const path = require('path');
const cors=require('cors');
const userRoutes = require('./Route/userroute');
const bannerRoutes = require('./Route/bannerrouter');
const notificationRouter=require('./Route/notificationroute');
const adminroute=require('./Route/adminroute');
const categoryRouter=require('./Route/categoryroute');
const subCategoryRouter=require('./Route/subcategoryroute');
const productRoute=require('./Route/productroute');
const brandRoute=require('./Route/brandroute')
const useraddressRoute=require('./Route/useraddress')
const productdetailsRoute=require('./Route/productdetailsroute')

app.use(cors());
app.use('/Uploads', express.static(path.join(__dirname, 'Uploads')));
app.use(express.json())
app.use('/api/user', userRoutes);
app.use('/api/admin',adminroute);
app.use('/api/bann',bannerRoutes);
app.use('/api/notification', notificationRouter);
app.use('/api/Category',categoryRouter);
app.use('/api/subcategory',subCategoryRouter);
app.use('/api/product',productRoute);
app.use('/api/brand',brandRoute);
app.use('/api/address',useraddressRoute)
app.use('/api/productdetails',productdetailsRoute)



module.exports =app;