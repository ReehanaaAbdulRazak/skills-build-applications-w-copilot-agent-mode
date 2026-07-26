"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("./config/database");
const database_1 = require("./config/database");
const models_1 = require("./models");
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 8000;
const apiBaseUrl = process.env.CODESPACE_NAME
    ? `https://${process.env.CODESPACE_NAME}-8000.app.github.dev`
    : `http://localhost:${port}`;
app.use(express_1.default.json());
function registerResourceCollection(path, model) {
    app.get([path, `${path}/`], async (_req, res) => {
        try {
            await (0, database_1.waitForDatabaseConnection)();
            const items = await model.find({}).lean();
            res.json(items);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to load resources', error });
        }
    });
    app.post([path, `${path}/`], async (req, res) => {
        try {
            await (0, database_1.waitForDatabaseConnection)();
            const newItem = await model.create(req.body);
            res.status(201).json(newItem);
        }
        catch (error) {
            console.error(error);
            res.status(400).json({ message: 'Failed to create resource', error });
        }
    });
    app.get([`${path}/:id`, `${path}/:id/`], async (req, res) => {
        try {
            await (0, database_1.waitForDatabaseConnection)();
            const item = await model.findOne({ id: req.params.id }).lean();
            if (!item) {
                res.status(404).json({ message: 'Resource not found' });
                return;
            }
            res.json(item);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to load resource', error });
        }
    });
    app.put([`${path}/:id`, `${path}/:id/`], async (req, res) => {
        try {
            await (0, database_1.waitForDatabaseConnection)();
            const item = await model.findOneAndUpdate({ id: req.params.id }, { $set: req.body }, { new: true, runValidators: true });
            if (!item) {
                res.status(404).json({ message: 'Resource not found' });
                return;
            }
            res.json(item);
        }
        catch (error) {
            console.error(error);
            res.status(400).json({ message: 'Failed to update resource', error });
        }
    });
    app.delete([`${path}/:id`, `${path}/:id/`], async (req, res) => {
        try {
            await (0, database_1.waitForDatabaseConnection)();
            const item = await model.findOneAndDelete({ id: req.params.id });
            if (!item) {
                res.status(404).json({ message: 'Resource not found' });
                return;
            }
            res.status(204).send();
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to delete resource', error });
        }
    });
}
app.get(['/api/health', '/api/health/'], (_req, res) => {
    res.json({
        status: 'ok',
        service: 'octofit-tracker-backend',
        apiUrl: apiBaseUrl,
    });
});
app.get(['/api/config', '/api/config/'], (_req, res) => {
    res.json({
        apiUrl: apiBaseUrl,
        port,
        codespace: process.env.CODESPACE_NAME || null,
    });
});
registerResourceCollection('/api/users', models_1.User);
registerResourceCollection('/api/teams', models_1.Team);
registerResourceCollection('/api/activities', models_1.Activity);
registerResourceCollection('/api/leaderboard', models_1.LeaderboardEntry);
registerResourceCollection('/api/workouts', models_1.Workout);
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Backend listening on port ${port}`);
        console.log(`API URL: ${apiBaseUrl}`);
    });
}
exports.default = app;
