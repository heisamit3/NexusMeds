import express from 'express';
import client from "../DB.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();

import {
  
    getAllCustomers,
    // createCustomer,
    getCustomerByEmail,
    updateCustomerById,
    deleteCustomerByEmail
} from '../Controllers/customerController.js';


router.get('/getAll', getAllCustomers);
// router.post('/create', createCustomer);
router.get('/:email', getCustomerByEmail); 
router.put('/update/:id', updateCustomerById);
router.delete('/delete/:email', deleteCustomerByEmail);


router.post('/', authorize, async (req, res) => {
    try {
        
        const user = await client.query("SELECT customer_name, email, phone, date_of_birth, image, gender, address, billing_address FROM customer WHERE customer_id = $1",
            [req.user.id]);

        res.json(user.rows[0]);
        console.log(user.rows[0]);

    } catch (error) {
        console.error(error.message);
        res.status(500).json("Server error");
    }
});


export default router;
