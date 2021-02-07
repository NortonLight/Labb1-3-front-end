
const bcrypt = require('bcrypt');
const saltRounds = 10;


const genPass = async (pwd) => {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(pwd, salt);
    return hash;
};

module.exports = {
    genPass : genPass
}