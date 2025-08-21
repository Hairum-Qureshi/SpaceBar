import { Request } from "express";
import { FileUploadData, IUser } from "../../interfaces";
import path from "path";
import fs from "fs";
import User from "../../models/User";

export async function getFileUploadData(
	req: Request,
	currUID: string,
	imageFor: string,
): Promise<FileUploadData> {
	const ext: string = req.file?.mimetype.split("/").pop()!;
	const FOLDER_PATH = path.join(__dirname, "../../uploads");
	const fileName = `${
		imageFor === "pfp" ? `${currUID}.${ext}` : `gc-${currUID}.${ext}`
	}`;
	const fileBuffer: Buffer = fs.readFileSync(`${FOLDER_PATH}/${fileName}`);
	const { pfpImageID }: IUser = (await User.findById(currUID)) as IUser;

	return { FOLDER_PATH, fileName, fileBuffer, pfpImageID };
}
