const { MongoClient } = require('mongodb');
const fs = require('fs')

// Kết nối đến cơ sở dữ liệu MongoDB
const uri = 'mongodb+srv://sparking:Az123456@dbs.bgpecdq.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useUnifiedTopology: true });

async function exportCollectionToFile() {
  try {
    await client.connect();
    const database = client.db('ATH_UET');
    const collection = database.collection('parking');

    // Tìm document có trường "name" bằng giá trị "John"
    //const query = { nameParking: 'G2_UET_VNU' };
   // const result = await collection.findOne(query);

    const cursor = collection.find();

    const documents = await cursor.toArray();

    fs.writeFileSync('data.json', JSON.stringify(documents, null, 2));

    console.log('Data exported successfully')
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

exportCollectionToFile();