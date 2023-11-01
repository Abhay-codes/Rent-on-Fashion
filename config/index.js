import dotenv from 'dotenv';
dotenv.config();
export const {
	APP_PORT,
	DEBUG_MODE,
	MONGO_URL,
	SECRET,
	REFRESH_SECRET,
	CLOUD_NAME,
	CLOUDINARY_API_KEY,
	CLOUDINARY_API_SECRET,
} = process.env;
