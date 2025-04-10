const pool = require('../config/db');

exports.getNonEcoProducts = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT p1.product_id, p1.name, p1.description, p1.category,
                COALESCE(
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'product_id', p2.product_id,
                            'name', p2.name,
                            'description', p2.description,
                            'category', p2.category
                        )
                    ),
                    '[]'
                ) as alternatives
            FROM products p1
            LEFT JOIN recommendations r ON p1.product_id = r.non_eco_product_id
            LEFT JOIN products p2 ON r.eco_product_id = p2.product_id
            WHERE p1.is_eco_friendly = FALSE
            GROUP BY p1.product_id
        `);

        const products = rows.map(row => ({
            ...row,
            alternatives: JSON.parse(row.alternatives)
        }));

        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};