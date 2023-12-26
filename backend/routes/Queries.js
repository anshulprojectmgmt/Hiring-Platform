const express = require('express');
const router = express.Router();
const pool = require('../database')

router.post('/query', async (req, res) => {
    try {
        const [rows, fields] = await pool.query(req.body.query);
        // console.log(fields[0].name);
        res.json({success: true, rows: rows, fields: fields})
    } catch (error) {
        // console.log(error.message);
        res.json({success: false, error: error.message})
    }
})

module.exports = router;