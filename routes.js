
const routes = require('express').Router();
const dbService = require('./database');
const multer = require('multer');
const upload = multer({dest: 'upload/'});
const fs = require("fs").promises;


//Klar och fungerar
routes.get('/GetUser/', async (req, res) => {
    try{
        const users = await dbService.getUserList();
        res.json(users);
    }
    catch(error)
    {
        console.log(error);
    }
});

//Klar och fungerar
routes.get('/GetProducts' , async (req, res) => {
    try{
        const productlist = await dbService.getProductList();
        res.json(productlist);
    }
    catch(error)
    {
        console.log(error);
    }
});

//Klar och fungerar
routes.post('/AddImg/:id', upload.single('file'), async (req,res) => { 
    
    const uploadedFile = req.file;
    const prodImgId = req.params.id;
    const exts = req.file.originalname.split('.');
    const fileEnd = exts[exts.length - 1];
    const fileName = './upload/' + prodImgId + '.' + fileEnd;
    try {
        if(/(jpe?g|png|gif|bmp)$/i.test(fileEnd))
        {
            const filewrite = await fs.rename(uploadedFile.path, fileName);
            const addImg = await dbService.addImgToProd(fileName, prodImgId);
            res.json("Image was uploaded to database.");
        }
        else 
        {
        await fs.unlink(uploadedFile.path);
        res.status(400).json('Something wrong when uploading image. !Must be jpg,jpeg, png, gif or bmp!');
        }
    }
    catch(error) 
    { 
        console.log(error);
    }
});


//Klar och fungerar
routes.post('/AddProduct', async (req, res) => {
    try{
        const Name = req.body.Name;
        const Description = req.body.Description;
        const Price = req.body.Price;
        const regexProdInfo = /[a-zA-Z0-9]+/;
        const regexP = /[0-9]{1,5}/;
        const priceRight = regexP.test(Price);
        const rightProdInfoName = regexProdInfo.test(Name);
        const rightProdInfoDes = regexProdInfo.test(Description);
        
        if(priceRight && rightProdInfoName && rightProdInfoDes){
            const result = await dbService.addProduct(Name, Description, Price);
        }
        else
        {
            res.json("Something went wrong when adding PRODUCT\n Check that Name and Decription is of charachters and Price is of integer.");
        }
    }
    catch(error)
    {
        console.log(error);
    }
    //res.json({status:'Ok'});
});

//Klar och fungerar
routes.post('/AddUser', async (req, res) => {
    try{
        const eMail = req.body.Email;
        const fName = req.body.FirstName;
        const lName = req.body.LastName;
        const pWord = req.body.Password;
        const regexFLName = /[a-zA-Z]+/;
        const regexPword = /[a-zA-Z0-9]+/;
        const regexMail = /^[a-zA-z0-9._%+-]+@[a-zA-z0-9.-]+\.[a-zA-Z]{2,}$/;
        const rightMail = regexMail.test(eMail);
        const rightFLName = regexFLName.test(fName, lName);
        const rightPword = regexPword.test(pWord);

            if(rightMail && rightFLName && rightPword){
                const res = await dbService.addUser(eMail, fName, lName, pWord);
            }
            else
            {
            res.json("Something went wrong when adding USER\n Check that Name and Decription is of charachters and Price is integer.");
            }
    }
    catch(error)
    {
        console.log(error);
    }
    //res.json({status: 'Ok'});
});

//Klar och fungerar
routes.delete('/DelProduct/:id', async (req, res) => {
    try{
        const prodId = req.params.id;
        await dbService.deleteProduct(prodId);
        res.json('Product deleted with id:'+prodId);
    }
    catch(error){
        console.log(error);
    }
  
});

//Klar och fungerar
routes.delete('/DelUser/:id', async (req, res) => {
    try{
        const userId = req.params.id;
        await dbService.deleteUser(userId);
        res.json('User deleted with id:'+userId);
    }
    catch(error){
        console.log(error);
    }
  
});
//Klar och fungerar
routes.get('/GetProduct/:id', async (req, res) => {
    try{
        const prodId = req.params.id;
        const result = await dbService.getProductById(prodId);
        res.json(result);
    }

    catch(error){
       console.log(error);
    }
});

//Klar och fungerar
routes.get('/GetUser/:id', async (req, res) => {
    try{
        const userId = req.params.id;
        const result = await dbService.getUserById(userId);
        res.json(result);
    }
    catch(error){
        console.log(error);
    }
});

//Klar och fungerar
routes.put('/UpdateProduct', async (req, res) => {
    
        const Name = req.body.Name;
        const Description = req.body.Description;
        const Price = req.body.Price;
        const id = req.body.id;
    try{
        const regexProdInfo = /[a-zA-Z0-9]+/;
        const regexPrID = /[0-9]{1,5}/;
        const rightProdInfoNam = regexProdInfo.test(Name);
        const rightProdInfoDes = regexProdInfo.test(Description);
        const priceRight = regexPrID.test(Price);
        const idRight = regexPrID.test(id);
    
        if(rightProdInfoDes && rightProdInfoNam && priceRight && idRight){
            const uProd = await dbService.updateProduct(Name, Description, Price, id);
            res.json("Product updated!");
        }

        else
        {
        res.json("Something went wrong when adding USER\n Check that Name and Description is of charachters and Price is integer.");
        }
    }
    catch(error)
    {
        console.log(error);
    }
    //res.json({status: 'OK'});
});

//Klar och fungerar
routes.post('/UserLogin/', async (req, res) => {
    try{
        const eMail = req.body.Email;
        const pWord = req.body.Password;
        const regexMail = /^[a-zA-z0-9._%+-]+@[a-zA-z0-9.-]+\.[a-zA-Z]{2,}$/;
        const regexPword = /[a-zA-Z0-9]+/;
        const rightMail = regexMail.test(eMail);
        const rightPword = regexPword.test(pWord);

        if(rightMail && rightPword){
            const result = await dbService.userLogin(eMail, pWord);
            res.json(result);
        }
        
    }
    catch(error)
    {
        console.log(error);
    }
});

module.exports = routes;