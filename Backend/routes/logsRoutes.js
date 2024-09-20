import express from 'express';
import { ObjectId } from 'mongodb';
import db from '../db/conn.js';

const router = express.Router();

// List of all logs
router.get("/", async(req,res) => {
    let collection = await db.collection("logs");
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
});

// Get a specific log (By ID)
router.get("/:id", async(req,res) => {
    let collection = await db.collection("logs");
    let query = { _id: new ObjectId(req.params.id) };
    let result = await collection.findOne(query);

    if (result){
        res.send(result).status(200);
    }
    else {
        res.send("Log not found").status(404);
    }
});

// Create a new log
router.post("/", async(req,res) => {
    try{
        let data = req.body;
        let collection = await db.collection("logs");
        let result = await collection.insertOne(data);
        res.send(result).status(201);
    }
    catch (err){
        res.status(500).send(err);
    }
});


// Delete a log by ID
router.delete("/:id", async(req,res) => {
    try{
        let query = { _id: new ObjectId(req.params.id) };
        let collection = await db.collection("logs");
        let result = await collection.deleteOne(query);
        if (result.deletedCount === 1) {
            res.status(200).send({ message: "Log deleted successfully" });
        } else {
            res.status(404).send({ message: "Log not found" });
        }
    }
    catch (err){
        res.status(500).send(err);
    }
});

// TODO -> Patch for update (It's necessary to update logs?)

export default router;


