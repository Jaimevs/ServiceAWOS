import bcrypt from 'bcrypt'
const users = [{
    name: "Jose",
    lastname: "Fosado Animas",
    tel: "7641106843",
    email: "jfosadoanimas@gmail.com",
    type:'Administrador',
    password: bcrypt.hashSync('12341234', 10),
    verified: 1,
    token: null 
},{
    name: "Diego",
    lastname: "Mota Hernandez",
    tel: "6677339120",
    email: "mota@gmail.com",
    password: bcrypt.hashSync('12341234', 10),
    verified: 1,
    token: null
},
{
    name: "Jesus Alejandro",
    lastname: "Artiaga Morales",
    tel: "9876543210",
    email: "jesus@gmail.com",
    password: bcrypt.hashSync('12341234', 10),
    verified: 1,
    token: null
},
{
    name: "Brayan",
    lastname: "Bernabe Garcia",
    tel: "8763829126",
    email: "brayan@gmail.com",
    password: bcrypt.hashSync('12341234', 10),
    verified: 1,
    token: null
},
{
    name: "Octavio",
    lastname: "Lopez Martinez",
    tel: "9933994483",
    email: "octavioM@gmail.com",
    password: bcrypt.hashSync('12341234', 10),
    verified: 1,
    token: null
},
]


export default users;