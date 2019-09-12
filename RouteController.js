'use strict';

import express from 'express';
import {
    queryCar,
    createCar,
    queryAllCars,
    changeCarOwner,
    getHistoryForCar,
    deleteCar,
    registerUser
} from './FabricSDK'

const router = express.Router();

router.get('/queryCar', async (req, res) => {
    try {
        let userName = req.query.userName;
        let carNumber = req.query.carNumber;
        if (!userName || !carNumber) {
            res.status(400).json({result: "Missing parameter!"});
        } else {
            let result = await queryCar(userName, carNumber);
            return res.status(200).json({result: JSON.parse(result.toString())});
        }
    } catch (error) {
        res.status(400).json({result: error.message});
    }

});

router.post('/createCar', async (req, res) => {
    try {
        let userName = req.body.userName;
        let carNumber = req.body.carNumber;     //CAR0 - CAR999999
        let make = req.body.make;
        let model = req.body.model;
        let color = req.body.color;
        let owner = req.body.owner;
        if (!userName || !carNumber || !make || !model || !owner) {
            res.status(400).json({result: "Missing parameter!"});
        } else {
            let result = await createCar(userName, carNumber, make, model, color,owner);
            return res.status(200).json({result: result.toString()});
        }
    } catch (error) {
        res.status(400).json({result: error.message});
    }
});

router.get('/queryAllCars', async (req, res) => {
    try {
        let userName = req.query.userName;
        if (!userName) {
            res.status(400).json({result: "Missing parameter!"});
        } else {
            let result = await queryAllCars(userName);
            return res.status(200).json({result: JSON.parse(result.toString())});
        }
    } catch (error) {
        res.status(400).json({result: error.message});
    }

});

router.put('/changeCarOwner', async (req, res) => {
    try {
        let userName = req.body.userName;
        let carNumber = req.body.carNumber;
        let newOwner = req.body.newOwner;
        if (!userName || !carNumber || !newOwner) {
            res.status(400).json({result: "Missing parameter!"});
        } else {
            let result = await changeCarOwner(userName, carNumber, newOwner);
            return res.status(200).json({result: result.toString()});
        }
    } catch (error) {
        res.status(400).json({result: error.message});
    }

});

router.get('/getHistoryForCar', async (req, res) => {
    try {
        let userName = req.query.userName;
        let carNumber = req.query.carNumber;
        if (!userName || !carNumber) {
            res.status(400).json({result: "Missing parameter!"});
        } else {
            let result = await getHistoryForCar(userName, carNumber);
            return res.status(200).json({result: JSON.parse(result.toString())});
        }
    } catch (error) {
        res.status(400).json({result: error.message});
    }

});

router.put('/deleteCar', async (req, res) => {
    try {
        let userName = req.body.userName;
        let carNumber = req.body.carNumber;
        if (!userName || !carNumber) {
            res.status(400).json({result: "Missing parameter!"});
        } else {
            let result = await deleteCar(userName, carNumber);
            return res.status(200).json({result: result.toString()});
        }
    } catch (error) {
        res.status(400).json({result: error.message});

    }

});

router.post('/registerUser', async (req, res) => {
    try {
        let userName = req.body.userName;
        if (!userName) {
            res.status(400).json({result: "Missing parameter!"});
        } else {
            let result = await registerUser(userName);
            return res.status(200).json({result: result});
        }
    } catch (error) {
        res.status(400).json({result: error.message});
    }

});

export default router;
