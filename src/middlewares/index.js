const whiteList = [
	{
		url: 'http://localhost:3000',
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
  {
		url: 'http://localhost:3001',
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	},
	{
		url: 'https://web.postman.co',
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	},
];

export const corsOptions = (req, callback) => {
	const domainDetails = whiteList.find(
		(item) => item.url === req.header('Origin'),
  );
  
	if (domainDetails && domainDetails.methods.indexOf(req.method) !== -1) {
		callback(null, { origin: true, methods: true });
	} else {
		callback(null, { origin: false });
	}
};
