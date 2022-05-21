const express = require('express')
const jwt = require('jwt')
const dotenv = require('dotenv')

dotenv.config({
    path:'backend/config/config.env'
})


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const books = [
  {
    id: 1,
    name: 'Chi Pheo',
    author: 'ABC',
  },
  {
    id: 2,
    name: 'Chien tranh va Hoa Binh',
    author: 'DEF',
  },
];

app.get('/books', authenToken, (req, res) => {
  res.json({ status: 'Success', data: books });
});

// middleware, trước khi trả về route book cần chạy qua middleware authen để xác thực có chính xác người dùng hay không 
function authenToken(req, res, next) {
  const authorizationHeader = req.headers['authorization']; // get header
  // 'Beaer [token]'
  const token = authorizationHeader.split(' ')[1]; // split ( divide) the string and get the 2nd value
  if (!token) res.sendStatus(401); // if token is null => send 404

  //verify method of JWT
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
    console.log(err, data);
    if (err) res.sendStatus(403); // 403 mean forbidden
    next(); //if token valid, call next to get into /books 
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});