"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IndexController {
    index(req, res) {
        res.send('Hello');
    }
}
const indexController = new IndexController();
exports.default = indexController;
