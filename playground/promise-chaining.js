require('../src/db/mongoose');
const User = require('../src/models/user');



// User.findByIdAndUpdate('5d8c83a782bf476b96f6dd76',{age: 1})
// .then(user=> {
//     console.log(user);
//     return User.countDocuments({age: 1})
// })
// .then(count=> console.log(count))
// .catch(error=> console.log(error));


// const updateAgeAndCount =  async () => {
//     try {
//         const user = await User.findByIdAndUpdate('5d8c83d3a83abc6ba85f',{age: 1})
//         console.log(user);
//         const count =  await User.countDocuments({age: 26});
//         console.log(count);
//     } catch (error) {
//         console.log('Error: ' + error.message);
//     }
// }


// updateAgeAndCount();

const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id,{age});
    const count =  await User.countDocuments({age});
    return count;
}

updateAgeAndCount('5d8c8510a83abc6ba85f5780',1)
.then(count => console.log(count))
.catch(error => console.log(error.message));