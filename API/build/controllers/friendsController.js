"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
class FriendsController {
    getFriends(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let userId = req["userId"];
            User_1.default.find({ _id: userId }, { friends: 1, _id: 0 }).exec((err, friends) => {
                if (err) {
                    console.log('error', err);
                }
                if (friends) {
                    res.json(friends);
                }
            });
        });
    }
    addFriend(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let userId = req["userId"];
            User_1.default.findByIdAndUpdate(userId, {
                $addToSet: {
                    friends: req.body.username
                }
            }).exec((err, friends) => {
                if (err) {
                    console.log('error', err);
                }
                if (friends) {
                    res.json(friends);
                }
            });
        });
    }
}
const friendsController = new FriendsController();
exports.default = friendsController;
