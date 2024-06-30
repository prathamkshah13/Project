const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./src/config/database');
const userRoutes = require('./src/routes/userRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const authRoutes = require('./src/routes/authRoutes');
const profileRoutes = require('./src/routes/profileRoutes');
const protectedRoutes = require('./src/routes/protectedRoutes');
const assignmentRoutes = require('./src/routes/assignmentRoutes');
const fileUpload = require('express-fileupload');

const app = express();
app.use(cors()); 
app.use(bodyParser.json({ limit: '50mb' })); 

app.use('/', userRoutes);
app.use('/', protectedRoutes)
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/assignments', assignmentRoutes);
app.use('/', dashboardRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await sequelize.authenticate();
  console.log('Database connected!');
  await sequelize.sync();
});