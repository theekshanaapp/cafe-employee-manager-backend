const express = require('express');
const router = express.Router();
const cafeController = require('../controllers/cafeController');

router.get('/', cafeController.getCafes);
router.get('/:id', cafeController.getCafeById);
router.post('/', cafeController.createCafe);
router.put('/', cafeController.updateCafe);
router.delete('/:id', cafeController.deleteCafe);

module.exports = router;
