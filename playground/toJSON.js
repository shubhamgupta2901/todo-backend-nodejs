
const pet = {
    name: 'Samwise',
    breed: 'Golden retriever',
}

pet.toJSON = function (){
    console.log(this);
    return {name: this.name};
}
console.log(JSON.stringify(pet));