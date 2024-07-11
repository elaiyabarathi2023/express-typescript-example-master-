// // src/middleware/auth.ts
// // src/middleware/auth.ts

// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';
// // Assuming JWT_SECRET is defined in your config file

// interface AuthenticatedRequest extends Request {
//   decoded?: jwt.JwtPayload;
// }

// export const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
//   const bearerHeader = req.headers['authorization'];

//   if (typeof bearerHeader !== 'undefined') {
//     const bearer = bearerHeader.split(' ');
//     const token = bearer[1];

//     jwt.verify(token, '9965738658', (err, decoded) => {
//       if (err) {
//         return res.status(403).json({
//           message: 'Failed to authenticate token.'
//         });
//       }
//       // Token decoded successfully, attach decoded data to request object
//       req.decoded = decoded;
//       next();
//     });
//   } else {
//     return res.status(403).json({
//       message: 'No token provided.'
//     });
//   }
// };
