// Create a new channel
const express = require("express");
const router = express.Router();


// Handle the main routes
// Main page
router.get('/', function (req, res) {
    // Get user from session
    const user = req.session.user || null; 

    // Define a function to encapsulate the rendering logic.
    function renderPage(userData, worksData) {
        res.render('index.ejs', { user: userData, works: worksData });
    }

    // The logic here is mainly used to display the number of votes available to the user, and the number of votes that have been cast for the current entry.
    // If the user is already logged in, the user's remaining votes will be retrieved first.
    if (user) {
        const userQuery = "SELECT votes_remaining FROM users WHERE user_id = ?";
        db.query(userQuery, [user.id], function (err, userResult) {
            if (err) {
                console.log("获取用户票数失败：", err);
                return res.redirect('/')
            }

            if (userResult.length > 0) {
                //Update the number of votes remaining for the user in the session
                req.session.user.votes_remaining = userResult[0].votes_remaining;
            }

            // Now query the work data again
            let sqlquery = "SELECT * FROM works";
            db.query(sqlquery, function (err, works) {
                if (err) {
                    console.error("error fetching works", err);
                    return res.redirect('/');
                }

                // Render again when both the user and the artwork are ready.
                renderPage(req.session.user, works);
            });
        });
    } else {
        //User not logged in to search for works only
        let sqlquery = "SELECT * FROM works";
        db.query(sqlquery, function (err, works) {
            if (err) {
                console.error("Error fetching works:", err);
            }
            renderPage(null, works);
        });
    }
});



// Voting logic implementation section
router.post('/vote', (req, res) => {
    // Get the user ID from the session
    const userId = req.session.user?.id;
    // Get the id of the work in the request body
    const { work_id } = req.body;

    //Non-logged-in users cannot vote
    if (!userId) {
        return res.status(403).send('You must be logged in to vote.');
    }

    //Check if the current user has already voted for the work
    const checkVoteQuery = "SELECT * FROM votes WHERE user_id = ? AND work_id = ?";
    db.query(checkVoteQuery, [userId, work_id], function (err, results) {
        if (err) {
            return res.status(500).send('Database error');
        }

        if (results.length > 0) {
            // Users who have already voted for this entry cannot vote again.
            return res.status(400).send('You have already voted for this work.');
        }

        // If no votes have been cast, insert the vote record into the votes table
        const insertVoteQuery = "INSERT INTO votes (user_id, work_id) VALUES (?, ?)";
        db.query(insertVoteQuery, [userId, work_id], function (err, result) {
            if (err) {
                return res.status(500).send('Database error');
            }

            // Upon successful insertion of a voting record, update the user's remaining votes (minus 1)
            const updateUserVotesQuery = "UPDATE users SET votes_remaining = votes_remaining - 1 WHERE user_id = ? AND votes_remaining > 0";
            db.query(updateUserVotesQuery, [userId], function (err, result) {
                if (err) {
                    return res.status(500).send('Error updating user votes');
                }

                // Number of votes received for updated works (plus 1)
                const updateWorkVotesQuery = "UPDATE works SET votes_received = votes_received + 1 WHERE work_id = ?";
                db.query(updateWorkVotesQuery, [work_id], function (err) {
                    if (err) {
                        return res.status(500).send('Error updating work votes');
                    }

                    // Update the number of remaining votes for the user in the session to maintain consistency
                    const getUserQuery = "SELECT votes_remaining FROM users WHERE user_id = ?";
                    db.query(getUserQuery, [userId], function (err, userResult) {
                        if (!err && userResult.length > 0) {
                            req.session.user.votes_remaining = userResult[0].votes_remaining;
                        }

                        // Return to home page after success
                        res.redirect('/');
                    });
                });
            });
        });
    });
});


//Export the router object so index.js can access it
module.exports = router;