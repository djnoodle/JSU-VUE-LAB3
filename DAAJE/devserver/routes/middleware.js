//	Imports
const fs 			  = require ("fs");
const path            = require("path/posix");
const { v4: uuidv4 }  = require("uuid");
//const util 			  = require ('util');

//	Declarations
const dataPath = path.normalize(`${__dirname}/../public/data/`);
						//sync fn used here for only for server setup(serving mock questions). Use async for further db handling.
const mockQuestions = fs.readFileSync(path.join(dataPath, 'quizQuestions.json'));
const isVerified = (req) => {/* verify caller fn and return bool */};
const createDynamicReplacer = (postObj) => {/* Use recursion to iterate the incoming [{}] and return a string[] of all properties
											   and nested properties for the replacer*/
	return Object.getOwnPropertyNames(postObj);
};

//  Main export body
const mwFunctions = {
	headers(req, res, next) {
			let origin = 'http://localhost:8080';
			res.set({'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
					'Access-Control-Allow-Headers': 'content-type',
					'Access-Control-Allow-Credentials': true,});
			res.set('Access-Control-Expose-Headers', 'Access-Control-Allow-Origin');
			console.log('response headers set');
			next();
	    },
	getMockQuestions(req, res) {
			res.status(200).send(JSON.parse(mockQuestions));
	    },
	assignQuizId(req, res, next) {
			//add uuid property to request and go to next middleware

			//verify request
			//if(!isVerified(req)) {return};

			console.log('Request from: ' + req.url);
			let newId = uuidv4();

			// add uid to index 0 and continue
			/* req.body.unshift({ uuid: newId }); */
			req.body[0].id = newId;
			console.log(`Appended ID: ${newId}`);
			next();
	    },
	writeNewQuiz(req, res) {//write new quiz into db
			// create a frame array for stringify to know which properties to stringify
			console.log(`Handler recieved body: ${req.body} with id: ${req.body.uuid}`);

			// create an object from recieved array
			const dataObj = new Object(req.body);
			console.log(`Data object: ${Object.entries(dataObj)}`);

			// stringify quiz to write to db. *DONT FORGET TO UNCOMMENT REPLACER ARRAY WHEN READY!* now unused.
			const data = JSON.stringify(dataObj/* , createDynamicReplacer(req.body) */);
			console.log(`Handler provided body: ${data}`);

			//write to file and finish up
			fs.writeFile(path.join(dataPath, 'sessionUserQuiz.json'), data, isVerified)
			res.status(200).send({ msg: "Posted new quiz!" });
		},

};

module.exports = mwFunctions;