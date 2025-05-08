const pool = require('../../config/db');
const { v4: uuidv4 } = require('uuid');

async function migrateCompletedChallenges() {
    try {
        await pool.query('START TRANSACTION');

        // Get all completed challenges from user_challenge_progress
        const [completedChallenges] = await pool.query(
            `SELECT * FROM user_challenge_progress 
             WHERE completion_status = 'completed'`
        );

        // Insert each completed challenge into challenge_history
        for (const challenge of completedChallenges) {
            await pool.query(
                `INSERT INTO challenge_history 
                 (history_id, uid, challenge_id, completed_at, points_earned) 
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    uuidv4(),
                    challenge.uid,
                    challenge.challenge_id,
                    challenge.last_check_in,
                    challenge.total_points_earned / (challenge.completion_count || 1) // Calculate points per completion
                ]
            );
        }

        await pool.query('COMMIT');
        console.log(`Successfully migrated ${completedChallenges.length} completed challenges`);
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Migration failed:', error);
        throw error;
    }
}

// Run the migration
migrateCompletedChallenges().then(() => {
    console.log('Migration completed');
    process.exit(0);
}).catch(error => {
    console.error('Migration failed:', error);
    process.exit(1);
});