const dotenv = require("dotenv");
const mongoose = require("mongoose");
const process = require("process");
dotenv.config({ path: "./env" });
const app = require("./app");

process.on('unhandledRejection', (err) => {
	console.log('inside unhandledRejection: ');
	console.error(err.name, err.message);
});

process.on('uncaughtException', (err) => {
	console.error('inside uncaughtException: ', err);
	console.log("shutting down server in 3 seconds");
	 setTimeout(() => {
    process.exit(1); 
  }, 3000); 
})


const connectToDatabase = async () => {
	const uri = process.env.DATABASE;
	try {
		await mongoose.connect(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("\x1b[36mDB connected successfully!\x1b[0m");


		const server = app.listen(8000, () => {
		console.log("Server is running on port 8000");


		// handling ctrl + c server shutdown 
		process.on('SIGINT',()=>{
			console.log("command received, shutting down!");
			server.exit(()=>{
				mongoose.connection.close(false, (error)=>{
					if (error) {
						console.log('Error when closing connection: ', error)
					} else {
						console.log('Closing connection with mongodb!')
					}
					process.exit(0)
				} )
			})
		})
});
	} catch (error) {
		console.error('\x1b[40mError connecting to database:\x1b[0m', error);
		process.exit(1)
	}
};


connectToDatabase();


