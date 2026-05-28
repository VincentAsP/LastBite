const pool = require('../config/db');

async function getUserEcoImpact(req, res) {
    const { userID } = req.params;

    if (!userID) return res.status(400).json({ message: "UserID is required!" });

    try {
        const impactQuery = `
            SELECT 
                COALESCE(SUM(oi.quantity), 0) AS total_food_saved,
                COALESCE(SUM((p.original_price - p.price) * oi.quantity), 0) AS total_money_saved,
                COALESCE(SUM(
                    oi.quantity * CASE 
                        WHEN p.category IN ('Vegan', 'Bakery', 'Dessert', 'Beverage') THEN 0.6
                        WHEN p.category IN ('Seafood', 'Local', 'Spicy', 'Dairy') THEN 1.6
                        ELSE 1.6
                    END
                ), 0) AS total_co2_prevented
            FROM \`order\` o
            JOIN order_item oi ON o.orderID = oi.orderID
            JOIN product p ON oi.productID = p.productID
            WHERE o.userID = ? AND o.status = 'completed'
        `;
        const [impactResult] = await pool.query(impactQuery, [userID]);
        
        const total_food_saved = parseInt(impactResult[0].total_food_saved);
        const total_money_saved = parseInt(impactResult[0].total_money_saved);
        const co2_prevented = parseFloat(impactResult[0].total_co2_prevented).toFixed(1);

        const datesQuery = `
            SELECT DISTINCT DATE(created_at) as order_date 
            FROM \`order\` 
            WHERE userID = ? AND status = 'completed'
            ORDER BY order_date DESC
        `;
        const [orderDates] = await pool.query(datesQuery, [userID]);
        
        let streak = 0;
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        for (let i = 0; i < orderDates.length; i++) {
            const orderDate = new Date(orderDates[i].order_date);
            orderDate.setHours(0, 0, 0, 0);
            
            const diffTime = Math.abs(currentDate - orderDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

            if (diffDays === 0 || diffDays === 1) {
                streak++;
                currentDate = orderDate;
            } else {
                break;
            }
        }

        const chartQuery = `
            SELECT DATE(o.created_at) as date, SUM(oi.quantity) as daily_saved
            FROM \`order\` o
            JOIN order_item oi ON o.orderID = oi.orderID
            WHERE o.userID = ? AND o.status = 'completed' AND o.created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY DATE(o.created_at)
            ORDER BY date ASC
        `;
        const [chartData] = await pool.query(chartQuery, [userID]);

        const historyQuery = `
            SELECT p.name AS product_name, o.created_at, u.full_name AS merchant_name, oi.quantity
            FROM \`order\` o
            JOIN order_item oi ON o.orderID = oi.orderID
            JOIN product p ON oi.productID = p.productID
            JOIN user u ON p.sellerID = u.userID
            WHERE o.userID = ? AND o.status = 'completed'
            ORDER BY o.created_at DESC
            LIMIT 3
        `;
        const [recentHistory] = await pool.query(historyQuery, [userID]);

        // KIRIM KE FRONT-END!
        res.status(200).json({
            message: "Eco-Impact data retrieved successfully!",
            data: {
                metrics: {
                    food_saved: total_food_saved,
                    money_saved: total_money_saved,
                    co2_prevented: parseFloat(co2_prevented),
                    current_streak: streak
                },
                weekly_chart: chartData,
                recent_history: recentHistory
            }
        });

    } catch (error) {
        console.error("Gagal mengambil data Eco-Impact:", error);
        res.status(500).json({ message: "Server error saat kalkulasi impact." });
    }
}

module.exports = { getUserEcoImpact };