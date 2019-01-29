export class User {
    constructor(
        public id: number,
        public firstName: string,
        public lastName: string,
        public email: string,
        public password: string
        ){}
}
let myUser = new User(12, 'Brid', 'Moynihan', 'moynihanbrid@gmail.com', '1234abcd');
console.log('User name: ' + myUser.firstName);
