import { MongoClient, ServerApiVersion} from 'mongodb';

const uri = process.env.ATLAS_URI || "";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    });

try {
    await client.connect();
    console.log("Connected to the database");

    await client.db("admin").command({ ping: 1 });
    console.log("Ping command executed successfully");
}
catch (err){
    console.log("Error connecting to the database: ", err);
}

let db = client.db("digitShield");

export default db;