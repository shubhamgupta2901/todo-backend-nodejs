require('../src/db/mongoose');
const User = require('../src/models/user');



User.findByIdAndUpdate('5d8c83a782bf476b96f6dd76',{age: 1})
.then(user=> {
    console.log(user);
    return User.countDocuments({age: 1})
})
.then(count=> console.log(count))
.catch(error=> console.log(error));