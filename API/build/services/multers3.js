"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const nanoid_1 = require("nanoid");
const path_1 = __importDefault(require("path"));
aws_sdk_1.default.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'eu-west-3'
});
var s3 = new aws_sdk_1.default.S3();
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/PNG' || file.mimetype === 'image/JPG') {
        cb(null, true);
    }
    else {
        cb(new Error('El archivo que ha intentado subir no es una imagen'));
    }
};
var _multers3 = multer_1.default({
    fileFilter,
    storage: multer_s3_1.default({
        s3: s3,
        bucket: 'albertoripoll-tfgdaw-imagenes',
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: 'propiedad-fieldName' });
        },
        key: function (req, file, cb) {
            cb(null, nanoid_1.nanoid() + path_1.default.extname(file.originalname));
        }
    })
});
exports.default = _multers3;
