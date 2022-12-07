// функция посредик/middleware которая будет решать по токену можно ли возвращать какуюто секретную информацию
import jwt from "jsonwebtoken";

export default (req, res, next) => {
    // token parsing and decode it
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    
    if(token) {
        try {
            const decoded = jwt.verify(token, 'secret123');
            req.userId = decoded._id;

            // everthing is fine so next function can be called that goes after checkAuth
            next();
        } catch (err) {
            return res.status(403).json({
                message: 'No access',
            });
        }
    } else {
        return res.status(403).json({
            message: 'No access',
        });
    }
}