import mongoose, { Schema, model } from 'mongoose'
import bcrypt from 'bcryptjs';

interface IUser {

    encryptPassword(password: string): string;
    comparePassword(password: string, receivedPassword: string): string;
    setDate() : string
}

interface UserModelInterface extends mongoose.Model<any> {
    encryptPassword(password: string): string;
    comparePassword(password: string, receivedPassword: string): string;
    setDate() : string
    build(attr: IUser): any
}

const userSchema = new mongoose.Schema({
    especialidad:{type: String},
    messages:[{
        date:{type: Date, default: Date.now},
        from:{type: String},
        to:{type: String},
        text:{type: String}
    }],
    confirmed:{       
         type: Boolean,
        default: false},
    ciudad:{
        type:String,
    },
    sexo:{
        type:String,
    },
    altura:{
        type:Number,
    },
    bio:{
        type:String
    },
    pesos: [{

        fecha:{type: String},
        peso:{type:Number}
    }],
    kcals: [{
        fecha:{type: String},
        kcal:{type:Number}
    }],
    rate:{
        type:Number,
        default:1
    },
    reviews: [{
        date:{type: Date, default: Date.now},
        user_id: { type: String },
        comment: { type: String },
        stars: {type: Number},
        image:{type:String}
    }],
    fullName: {
        type: String,
    },
    username: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,

    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "Offline"
    },
    profile_pic: {
        type: String,
        default: "https://albertoripoll-tfgdaw-imagenes.s3.eu-west-3.amazonaws.com/default.jpg"
    },
    total_Kcal: {
        type: Number,
        default: 0
    },
    week_Kcal: {
        type: Number,
        default: 0
    },
    rutinas_creadas: [
    ],
    rutinas_guardadas: [
    ],
    rutinas_recientes: [
    ],
    isEntrenador: {
        type: Boolean,
        default: false
    },
    friends: [
    ],
},
    {
        timestamps: true,
        versionKey: false,
    });

userSchema.statics.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
}
userSchema.statics.setDate = () => {
    let date = new Date;
    date.toString()
    return date.getDate()+'-'+(date.getMonth()+1)+'-'+date.getFullYear()
}
userSchema.statics.comparePassword = async (password, receivedPassword) => {
     return bcrypt.compare(password, receivedPassword);
}
userSchema.statics.build = (attr: IUser) => {
    return new User(attr)
}
const User = mongoose.model<any, UserModelInterface>('User', userSchema);

const build = (attr: IUser) => {
    return new User(attr)
}

export default User