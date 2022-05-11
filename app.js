const express = require('express');

const app = express();


app.get('/posts', (req,res) => {
  res.send('posts');
})

app.listen(3000);
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');


async function main() {
  
  const { MongoClient, ServerApiVersion } = require('mongodb');
  const uri = "mongodb+srv://quizza-user:m29FXAsAUwVvy9rT@quizzacluster.qcyt3.mongodb.net/quizzadb?retryWrites=true&w=majority";
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
  
  try {
    await client.connect();
    
    await printIfListingExists(client, "always under water/submerged");
  } finally {
    await client.close();
  }
}

async function printIfListingExists(client, nameOfListing) {
  const result = await client.db("sample_geospatial").collection("shipwrecks")
  .findOne({ watlev: nameOfListing });

  if (result) {
    console.log('found')
    console.log(result);
  } else {
    console.log('not found')
  }
}


app.get("/", async (req, res) => {
  main();
})
