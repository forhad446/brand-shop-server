const express = require('express');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

// midleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.k9oitd7.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const productCollection = client.db("productDB").collection("products");

        app.get("/myCart", async (req, res) => {
            const result = await productCollection.find().toArray();
            res.send(result);
        })
        // get single id using get method
        app.get("/myCart/:id", async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: new ObjectId(id),
            };
            const result = await productCollection.find(query).toArray();
            res.send(result);
        })

        // delete single user
        app.delete("/myCart/:id", async (req, res) => {
            const id = req.params.id;

            const query = {
                _id: new ObjectId(id),
            };
            const result = await productCollection.deleteOne(query);
        });

        app.put("/myCart/:id", async (req, res) => {
            const id = req.params.id;
            const data = req.body;

            const filter = {
                _id: new ObjectId(id),
            };
            const options = { upsert: true };
            const updatedData = {
                $set: {
                    image: data.image,
                    name: data.name,
                    brandName: data.brandName,
                    categoryName: data.categoryName,
                    price: data.price,
                    shortDescription: data.shortDescription,
                    rating: data.rating
                },
            };
            const result = await productCollection.updateOne(
                filter,
                updatedData,
                options
            );
            res.send(result);
        });


        app.post("/product", async (req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product);
            res.send(result)
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

        // await client.close();
    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send('Mr. Computer server is running')
})

app.listen(port, () => {
    console.log(`Server running port: ${port}`);
})