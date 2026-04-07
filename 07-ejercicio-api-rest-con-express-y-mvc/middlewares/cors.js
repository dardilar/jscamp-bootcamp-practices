import cors from 'cors'

/* Aquí debe ir la lógica de tu middleware */
const ACCEPTED_ORIGINS = [
  "http://localhost:1234",
  "http://localhost:5173",
  "http://localhost:3000",
];

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => {
    return cors({
        origin: (origin, callback) => {
            if (!origin || acceptedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(null, false);
        }
    });
}
