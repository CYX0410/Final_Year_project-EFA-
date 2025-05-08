const pool = require('../config/db');

exports.getNonEcoProducts = async (req, res) => {
    try {
        // Debug: Log the total count of non-eco products
        const [countRows] = await pool.query(`
            SELECT COUNT(*) as count FROM products WHERE is_eco_friendly = FALSE
        `);
        console.log('Total non-eco products in DB:', countRows[0].count);

        // Debug: Log the raw products before aggregation
        const [rawProducts] = await pool.query(`
            SELECT p1.* FROM products p1 WHERE p1.is_eco_friendly = FALSE
        `);
        console.log('Raw non-eco products:', rawProducts.length);

        // Main query with alternatives
        const [products] = await pool.query(`
            SELECT p1.product_id, p1.name, p1.description, p1.category,
                JSON_ARRAYAGG(
                    IF(p2.product_id IS NOT NULL,
                        JSON_OBJECT(
                            'product_id', p2.product_id,
                            'name', p2.name,
                            'description', p2.description,
                            'category', p2.category
                        ),
                        NULL
                    )
                ) as alternatives
            FROM products p1
            LEFT JOIN recommendations r ON p1.product_id = r.non_eco_product_id
            LEFT JOIN products p2 ON r.eco_product_id = p2.product_id
            WHERE p1.is_eco_friendly = FALSE
            GROUP BY p1.product_id, p1.name, p1.description, p1.category
        `);
        console.log('Final products with alternatives:', products.length);
        
        // Clean up NULL values from alternatives array
        const cleanedProducts = products.map(p => ({
            ...p,
            alternatives: JSON.parse(p.alternatives).filter(Boolean)
        }));

        res.json(cleanedProducts);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Server error');
    }
};