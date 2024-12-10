// 创建一个新的通道
const express = require("express");
const router = express.Router();


// Handle the main routes
//主页面
router.get('/', function (req, res) {
    const user = req.session.user || null; // 从 session 中获取用户

    // 定义一个函数用于完成渲染逻辑的封装
    function renderPage(userData, worksData) {
        res.render('index.ejs', { user: userData, works: worksData });
    }

    //此处逻辑主要用于显示用户的可投票数，以及当前作品的被投票数。
    // 如果用户已经登录，则先获取用户剩余票数
    if (user) {
        const userQuery = "SELECT votes_remaining FROM users WHERE user_id = ?";
        db.query(userQuery, [user.id], function (err, userResult) {
            if (err) {
                console.log("获取用户票数失败：", err);
                return res.redirect('/')
            }

            if (userResult.length > 0) {
                //更新session中用户剩余的票数
                req.session.user.votes_remaining = userResult[0].votes_remaining;
            }

            // 现在再次查询作品数据
            let sqlquery = "SELECT * FROM works";
            db.query(sqlquery, function (err, works) {
                if (err) {
                    console.error("error fetching works", err);
                    return res.redirect('/');
                }

                //用户和作品都准本好以后再次进行渲染
                renderPage(req.session.user, works);
            });
        });
    } else {
        //用户未登录只查询作品
        let sqlquery = "SELECT * FROM works";
        db.query(sqlquery, function (err, works) {
            if (err) {
                console.error("Error fetching works:", err);
            }
            renderPage(null, works);
        });
    }
});



// 投票逻辑实现部分
router.post('/vote', (req, res) => {
    // 从会话中获得用户ID
    const userId = req.session.user?.id;
    // 获取请求体中的作品id
    const { work_id } = req.body;

    //未登录用户无法投票
    if (!userId) {
        return res.status(403).send('You must be logged in to vote.');
    }

    //检查当前用户是否已经为该作品投过票
    const checkVoteQuery = "SELECT * FROM votes WHERE user_id = ? AND work_id = ?";
    db.query(checkVoteQuery, [userId, work_id], function (err, results) {
        if (err) {
            return res.status(500).send('Database error');
        }

        if (results.length > 0) {
            // 用户已为该作品投过票，不能重复投
            return res.status(400).send('You have already voted for this work.');
        }

        // 如果没有投过票，则将投票记录插入到votes表
        const insertVoteQuery = "INSERT INTO votes (user_id, work_id) VALUES (?, ?)";
        db.query(insertVoteQuery, [userId, work_id], function (err, result) {
            if (err) {
                return res.status(500).send('Database error');
            }

            // 成功插入投票记录后，更新用户的剩余票数（减1）
            const updateUserVotesQuery = "UPDATE users SET votes_remaining = votes_remaining - 1 WHERE user_id = ? AND votes_remaining > 0";
            db.query(updateUserVotesQuery, [userId], function (err, result) {
                if (err) {
                    return res.status(500).send('Error updating user votes');
                }

                // // 更新作品的获得票数（加1）
                const updateWorkVotesQuery = "UPDATE works SET votes_received = votes_received + 1 WHERE work_id = ?";
                db.query(updateWorkVotesQuery, [work_id], function (err) {
                    if (err) {
                        return res.status(500).send('Error updating work votes');
                    }

                    // 更新session中用户的剩余票数以保持一致性
                    const getUserQuery = "SELECT votes_remaining FROM users WHERE user_id = ?";
                    db.query(getUserQuery, [userId], function (err, userResult) {
                        if (!err && userResult.length > 0) {
                            req.session.user.votes_remaining = userResult[0].votes_remaining;
                        }
                        // 成功后返回主页
                        res.redirect('/');
                    });
                });
            });
        });
    });
});


//Export the router object so index.js can access it
module.exports = router;