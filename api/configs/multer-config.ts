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
				? `${req.user._id}.${ext}`
				: file.fieldname === "groupChatPhoto"
				? `gc-${req.body.conversationID}-${file.originalname}.${ext}`
				: `${req.body.conversationID}-${new Date().getTime()}-${
						file.originalname
				  }.${ext}`
		);
	}
});

export default storage;
