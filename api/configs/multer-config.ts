import multer from "multer";

const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, "./uploads");
	},
	filename: (req, file, callback) => {
		const ext: string = file.mimetype.split("/").pop()!;

		callback(
			null,
			file.fieldname === "profilePicture"
				? `${req.user._id}.${file.mimetype.split("/")[1]}`
				: `${req.body.conversationID}-${new Date().getTime()}-${
						file.originalname
				  }.${ext}`
		);
	}
});

export default storage;
