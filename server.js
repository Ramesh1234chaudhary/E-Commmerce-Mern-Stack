const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDb = require('./config/db'); // Require using CommonJS syntax
const Authroutes =require('./routes/Authroutes')
const CategoryRoutes= require( './routes/CategoriesRoutes')
const ProductRoutes= require( './routes/ProductRoutes')
const path = require('path');


const cors= require('cors')
const app = express();

dotenv.config();

connectDb();
app.use(cors())
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname,'./client/build')));

//routes

app.use('/api/v1/auth',Authroutes);
app.use('/api/v1/category',CategoryRoutes)
app.use('/api/v1/product',ProductRoutes)

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, './client/build/index.html'));
});


// app.get('/', (req, res) => {
//   res.send({
//     message: 'Welcome to the e-comm app',
//   });
// });



const PORT = process.env.PORT || 4500;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
