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
class ChatController {
    getMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let userId = req["userId"];
            let friend = req.params.friend;
            User_1.default.findById(userId, { messages: 1, _id: 0 }).exec((err, messages) => {
                if (err) {
                    console.log('error', err);
                }
                if (messages) {
                    let mensajesIntercambios = [];
                    messages.messages.forEach(message => {
                        if (message.from == friend || message.to == friend) {
                            mensajesIntercambios.push(message);
                        }
                    });
                    res.json(mensajesIntercambios);
                }
            });
        });
    }
    sendMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let userId = req["userId"];
            let message = req.body.message;
            User_1.default.findById(userId, { username: 1 }).exec((err, user) => {
                if (err) {
                }
                if (user) {
                    message.from = user.username;
                    User_1.default.findByIdAndUpdate(userId, { $addToSet: {
                            messages: message
                        }
                    }).exec((err, user) => {
                        if (err) {
                            console.log('error', err);
                        }
                        if (user) {
                            User_1.default.findOneAndUpdate({ username: message.to }, { $addToSet: {
                                    messages: message,
                                    friends: message.from
                                }
                            }).exec((err, user) => {
                                if (err) {
                                    console.log('error', err);
                                }
                                if (user) {
                                    res.json(true);
                                }
                            });
                        }
                    });
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
const chatController = new ChatController();
exports.default = chatController;
