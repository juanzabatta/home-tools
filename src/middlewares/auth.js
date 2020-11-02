import jwt from 'jsonwebtoken';

// Verify token
export const verifyAuth = (req, res, next) => {
	const token = req.get('token');

	jwt.verify(token, 'HT-2020-Prod', (err, decoded) => {
		if (err) {
			return res.sendStatus(401);
		} else {
			req.user = decoded.data;
			next();
		}
	});
};

// Verify role
// export const verifyDirective = (req, res, next) => {
//   const role = req.user.role

//   if (role === 'DIRECTIVE') {
//     next();
//   } else {
//     return res.status(401).json({
//       message: 'Usuario no válido'
//     });
//   };
// };
