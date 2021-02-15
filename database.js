
const encryption = require('./encryption');
const sqlite3 = require('sqlite3');
const {open} = require('sqlite');
const bcrypt = require('bcrypt');



const dbPromise = (async () => {
    return open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    });
})();

const getUserList = async () => {
    try{
        const dbCon = await dbPromise;
        const users = await dbCon.all("SELECT Email, FirstName, LastName, id FROM users ORDER BY id ASC");
        return users;
    }
    catch(error)
    {
        throw new Error('Error getting userlist.:' + error);
    }
};

const getUserById = async (id) => {
    try{
        const dbCon = await dbPromise;
        const user = await dbCon.all("SELECT Email, FirstName, LastName, id FROM users WHERE id=?",[id]);
        return user;
    }
    catch(error){
        throw new Error('Error getting user by id.' + error);
    }
};

const getProductById = async (id) => {
    try{
        const dbCon = await dbPromise;
        const product = await dbCon.get("SELECT Name, Description, Price , id, img FROM products WHERE id=?",[id]);
        return product;
    }
    catch(error){
        throw new Error('Error getting product by id.' + error)
    }   
};

const getProductList = async () => {
    try{
        const dbCon = await dbPromise;
        const productlist = await dbCon.all("SELECT Name, Description, Price, id, img FROM products ORDER BY name ASC");
        return productlist;
    }
    catch(error)
    {
        throw new Error('Error getting productlist.'+ error);
    }
};

const addProduct = async (Name, Description, Price) => {
    try{
        const dbCon = await dbPromise;
        await dbCon.run("INSERT INTO products (Name, Description, Price) VALUES(?, ?, ?)", [Name, Description, Price]);
        return({ status: 'Ok'});
    }
    catch(error)
    {
        throw new Error('Error saving products.'+ error);
    }
};

const addUser = async (Email, FirstName, LastName, Password) => {
    try{
        const dbCon = await dbPromise;
        const hPass = await encryption.genPass(Password);
        await dbCon.run("INSERT INTO users (Email, FirstName, LastName, Password) VALUES(?, ?, ?, ?)", [Email, FirstName, LastName, hPass]);
        return({status: 'Ok'});
    }
    catch(error)
    {
        throw new Error('Error saving user.' + error);
    }
};

const deleteProduct = async (id) => {
    try{
        const dbCon = await dbPromise;
        const del = await dbCon.run("DELETE FROM products WHERE id=?",[id]);
    }
    catch(error)
    {
        throw new Error('Error deleting product.' + error);
    }
};

const deleteUser = async (id) => {
    try{
        const dbCon = await dbPromise;
        const del = await dbCon.run("DELETE FROM users WHERE id=?",[id]);
    }
    catch(error)
    {
        throw new Error('Error deleting user.' + error);
    }
};

const updateProduct = async (Name, Description, Price, id) => {
    try{
        const dbCon = await dbPromise;
        const update = await dbCon.run("UPDATE products SET Name=?, Description=?, Price=? WHERE id=?", [Name, Description, Price, id]);
    }
    catch(error)
    {
        throw new Error('Error updating product.'+ error);
    }
};

const addImgToProd = async (img, id) => {
    try{
        const dbCon = await dbPromise;
        const addImg = await dbCon.run("UPDATE products SET img=? WHERE id=?", [img, id]);
    }
    catch(error)
    {
        throw new Error('Error adding img to product' + error);
    }
};

const userLogin = async(Email, Password) => {
    try{
        const dbCon = await dbPromise;
        const userPassword = await dbCon.get("SELECT Password FROM users WHERE Email=?", [Email]);
        const match = await bcrypt.compare(Password, userPassword.Password);
            if(match)
            {
            const userinfo = await dbCon.get("SELECT Email, FirstName, LastName, id FROM users WHERE Email=?",Email);
            return userinfo;
            }
            else{
               return (res.json('Check your Password'));
                }
            }
        catch(error){
            throw new Error('Error logging check your Email.'+ error);
        }
};


module.exports = {
    getUserList : getUserList,
    addProduct : addProduct,
    getProductList : getProductList,
    addUser : addUser,
    getProductById : getProductById,
    getUserById : getUserById,
    deleteProduct : deleteProduct,
    updateProduct : updateProduct,
    deleteUser : deleteUser,
    userLogin : userLogin,
    addImgToProd : addImgToProd
};