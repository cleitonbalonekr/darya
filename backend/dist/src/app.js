"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var express_1 = __importDefault(require("express"));
var celebrate_1 = require("celebrate");
var routes_1 = __importDefault(require("./routes"));
var mongoose_1 = __importDefault(require("mongoose"));
var app = express_1.default();
// app.use(cors());
app.use(express_1.default.json());
if (!(process.env.NODE_ENV === 'test'))
    mongoose_1.default.connect("" + process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    });
app.use(routes_1.default);
app.use(celebrate_1.errors());
exports.default = app;