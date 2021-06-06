const UserModel = require("./models/User")

async function seedDB(){
    await UserModel.deleteMany({})
}


module.exports = {seedDB}