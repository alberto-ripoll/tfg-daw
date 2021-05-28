import AWS from 'aws-sdk';
import multer, { FileFilterCallback } from 'multer';
import multerS3 from 'multer-s3';
import { nanoid } from 'nanoid';
import path from 'path';

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'eu-west-3'
})
var s3 = new AWS.S3()

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'|| file.mimetype === 'image/PNG'|| file.mimetype === 'image/JPG' ) {
      cb(null, true);
    } else {
      cb(new Error('El archivo que ha intentado subir no es una imagen'));
    }
  };
var _multers3 = multer({
    fileFilter,
    storage: multerS3({
        s3: s3,
        bucket: 'albertoripoll-tfgdaw-imagenes',
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: 'propiedad-fieldName' });
        },
        key: function (req, file, cb) {
            cb(null, nanoid()+path.extname(file.originalname))
        }
    })
})

export default _multers3;
