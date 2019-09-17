'use strict';

const PORT = process.env.PORT || 3000;
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
app.use(cors());








app.listen(PORT,() => console.log(`listening on ${PORT}`));
