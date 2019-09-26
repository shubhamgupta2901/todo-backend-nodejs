require('../src/db/mongoose');
const Task = require('../src/models/task');

Task.deleteOne({_id: '5d8a63568601bf18bbb00a27'})
.then((deleteResult) => Task.count({completed: false}))
.then(count => console.log(count))
.catch(error=> console.log(error));