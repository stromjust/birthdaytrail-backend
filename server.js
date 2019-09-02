var express = require('express');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var mongoose = require('mongoose');
var cors = require('cors');
var notificationLoop = require('./notifications.js');
var app = express();
require('dotenv').config();

const authRoutes = require('./routes/auth.js');
const birthdayRoutes = require('./routes/birthday.js');
const subscriptionRoutes = require('./routes/subscription.js');

const corsOptions = {
	origin: process.env.CROSS_ORIGIN
}

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());

app.use(birthdayRoutes);
app.use(authRoutes);
app.use(subscriptionRoutes);

app.get('/*', (req, res) => res.status(404).send({message: "Resource not found"}));

notificationLoop(1000 * 60);
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true })
	.then(() => {
		app.listen(process.env.PORT, () => console.log('Launching server...'));
	})
	.catch(err => {
		console.log('Error connecting to MongoDB', err);
	});
