const mongoose = require('mongoose');
require('dotenv').config();
const uri = process.env.MONGODB_URI;

mongoose.connect(uri).then(async () => {
    const Product = mongoose.connection.collection('products');
    const count = await Product.countDocuments();
    const trendingCount = await Product.countDocuments({attributes: 'trending'});
    const newArrivalCount = await Product.countDocuments({attributes: 'newArrival'});
    
    console.log('--- MongoDB Check ---');
    console.log('Connected to:', mongoose.connection.name);
    console.log('Total products:', count);
    console.log('Trending products:', trendingCount);
    console.log('New Arrival products:', newArrivalCount);

    if (count > 0) {
        const sampleWithAttributes = await Product.findOne({ attributes: { $exists: true, $type: 'array', $ne: [] } });
        if (sampleWithAttributes) {
            console.log('Sample product existing attributes:', sampleWithAttributes.attributes);
        } else {
            console.log('No products have ANY attributes array populated.');
            const anyProduct = await Product.findOne({});
            console.log('Random product dump:', anyProduct);
        }
    }
    process.exit(0);
}).catch(console.error);
