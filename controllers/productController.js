const multer = require('multer');
const fs = require('fs');
import cloudinary from '../services/Cloudinary';
import path from 'path';
import { Claim, Product } from '../models';
import CustomErrorHandler from '../services/CustomErrorHandler';

const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, 'uploads/'),
	filename: (req, file, cb) => {
		const uniqueName = `${Date.now()}-${Math.round(
			Math.random() * 1e9
		)}${path.extname(file.originalname)}`;
		cb(null, uniqueName);
	},
});

const handleMultipartData = multer({
	storage,
	limits: {
		fileSize: 1000000 * 5, //5mb
	},
}).array('image', 4);

const productController = {
	async store(req, res, next) {
		//Multipart form data
		handleMultipartData(req, res, async (err) => {
			if (err) {
				return next(CustomErrorHandler.serverError('Only 4 photos required'));
			}

			const uploader = async (path) => await cloudinary.uploads(path, 'Images');
			console.log(req.files);
			const files = req.files;
			console.log(files);
			let url = [];
			console.log(typeof url);
			try {
				for (const file of files) {
					const { path } = file;
					const newPath = await uploader(path);
					//console.log(newPath.url);
					url.push(newPath.url);
					fs.unlink(path, () => {
						console.log('first');
					});
				}
			} catch (err) {
				//console.log('ME');
				res.status(500).json({ err });
			}

			const { userId } = req.user;
			const {
				type,
				name,
				description,
				sizes,
				price,
				Style_tip,
				Address,
				City,
				Landmark,
				State,
				Pincode,
				longitude,
				latitude,
			} = req.body;
			const location = {
				type: 'Point',
				coordinates: [longitude, latitude],
			};
			const product = new Product({
				owner_id: userId,
				type,
				name,
				description,
				sizes,
				price,
				images: url,
				Style_tip,
				Address,
				City,
				Landmark,
				State,
				Pincode,
				location,
			});
			try {
				const result = await product.save();
				res.status(201).json({ response: 'Added Successfully', result });
			} catch (err) {
				return next(err);
			}
		});
	},
	async search(req, res, next) {
		try {
			let { page, limit, lat, lon } = req.query;
			const type = req.params.type;
			page = parseInt(page);
			lat = parseFloat(lat);
			lon = parseFloat(lon);
			//console.log(lon,lat);
			const result = await Product.find({
				$and: [
					{
						type,
					},
					{
						location: {
							$near: {
								$geometry: {
									type: 'Point',
									coordinates: [lon, lat],
								},
								$maxDistance: 10000,
							},
						},
					},
				],
			})
				.skip((page - 1) * limit)
				.limit(limit);

			res.status(200).json({ page, result });
		} catch (err) {
			console.log(err);
			res.status(444).json(err);
		}
	},
	async claim(req, res, next) {
		console.log('me1');
		let { owner_id, product_id, from, to } = req.body;
		console.log('me2');
		from = parseInt(from);
		to = parseInt(to);
		const { userId } = req.user;
		console.log('me3');
		console.log(typeof from);
		try {
			const claim = await Claim.create({
				owner_id,
				product_id,
				request_person_id: userId,
				from,
				to,
			});
			res.status(201).json({ res: 'upadated successfully' });
		} catch (err) {
			res.status(402).json({ err });
		}
	},
	async accept(req, res, next) {
		try {
			const { product_id, _id } = req.body;
			const result = await Claim.findOne({ _id });
			//console.log(result);
			try {
				await Claim.findByIdAndUpdate(_id, { status: 1 });
			} catch (err) {
				console.log(err);
			}
			try {
				const others = await Claim.find({
					$and: [
						{ product_id },
						{ from: { $gte: parseInt(result.from) } },
						{ status : 0},
						{ from: { $lte: parseInt(result.to + 1) } },
					],
				});
				console.log(others);
				others.map(async (ele) => {
					await Claim.findByIdAndUpdate(ele._id,{
                          status: -1
					})
				})
			} catch (err) {
				//console.log('AKHIL');
				console.log(err);
			}

			res.status(201).json({ msg: 'success' });
		} catch {
			res.status(505).json({ err });
		}
	},
	async request(req, res, next) {
		try {
			const id = req.params._id;
			const result = await Claim.find({ request_person_id: id });
			res.status(201).json({ result });
		} catch {
			res.status(505).json({ err });
		}
	},
	async calendar(req, res, next) {
		try {
			const id = req.params._id;
			console.log(id);
			const date = new Date();
			const tdate =
				date.getFullYear() * 10000 +
				(date.getMonth() + 1) * 100 +
				date.getDate();
			console.log(typeof tdate);
			console.log(tdate);
			console.log('me2');
			const result = await Claim.find(
				{
					$and: [
						{ product_id: id },
						{ status: 1 },
						{ from: { $gte: 20220303 } },
					],
				},
				{ from: 1, to: 1, _id: 0 }
			);
			console.log(result);
			res.status(201).json({ result });
		} catch (err) {
			res.status(404).json({ err });
		}
	},
};

export default productController;
