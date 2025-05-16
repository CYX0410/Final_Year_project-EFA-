const pool = require('../config/db');

exports.getNonEcoProducts = async (req, res) => {
    try {
        // Main query with alternatives using MySQL JSON functions
        const [products] = await pool.query(`
            SELECT 
                p1.product_id, 
                p1.name, 
                p1.description, 
                p1.category,
                COALESCE(
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
                    ),
                    '[]'
                ) as alternatives
            FROM products p1
            LEFT JOIN recommendations r ON p1.product_id = r.non_eco_product_id
            LEFT JOIN products p2 ON r.eco_product_id = p2.product_id
            WHERE p1.is_eco_friendly = FALSE
            GROUP BY p1.product_id, p1.name, p1.description, p1.category
        `);

        // Clean up alternatives array
        const cleanedProducts = products.map(product => ({
            ...product,
            alternatives: Array.isArray(product.alternatives) 
                ? product.alternatives.filter(alt => alt && alt.product_id)
                : typeof product.alternatives === 'string'
                    ? JSON.parse(product.alternatives).filter(alt => alt && alt.product_id)
                    : []
        }));

        res.json(cleanedProducts);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ 
            message: 'Error fetching products',
            error: error.message 
        });
    }
};