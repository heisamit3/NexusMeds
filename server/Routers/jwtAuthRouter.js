import express from "express";
import jwTokenGenerator from "../Utils/jwtTokenGenerator.js";
import validinfo from "../middleware/validinfo.js";

const router = express.Router();

import bcrypt from "bcrypt";
import client from "../DB.js";
import authorize from "../middleware/authorize.js";

router.get("/", (req, res) => {
    res.send("Hey it's working!");
});


router.post("/register/customer", validinfo, async (req, res) => {
    
    try {

        // 1. destructure the req.body (email, password, phone, customer_name, d.o.b, image, gender, address, billing_address)
        const { email, password, phone, customer_name, date_of_birth, image, gender, address, billing_address } = req.body;

        // 2. check if user exists (if user exists then throw error)

        const user = await client.query("SELECT * FROM customer WHERE email = $1", [email]);

        if (user.rows.length !== 0) {
            return res.status(401).json("User already exists!");
        }

        // 3. bcrypt the user password

        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);

        const bcryptPassword = await bcrypt.hash(password, salt);


        // 4. enter the new user inside our database

        const temp = await client.query("INSERT INTO customer (customer_id, email, password, phone, customer_name, date_of_birth, image, gender, address, billing_address) VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;",
            [email, bcryptPassword, phone, customer_name, date_of_birth, image, gender, address, billing_address]);

        // 5. generating our jwt token

        const token = jwTokenGenerator(temp.rows[0].customer_id);

        res.json({ token });
        console.log( temp.rows[0] );
        
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }

});




router.post("/login/customer", validinfo, async (req, res) => {
    
    try {

        // 1. destructure the req.body

        const { email, password } = req.body;

        // 2. check if user doesn't exist (if not then throw error)

        const user = await client.query("SELECT * FROM customer WHERE email = $1", [email]);

        if (user.rows.length === 0) {
            return res.status(401).json("Invalid Credential");
        }

        // 3. check if incoming password is the same as the database password

        const validPassword = await bcrypt.compare(password, user.rows[0].password);

        if (!validPassword) {
            return res.status(401).json("Invalid Credential");
        }

        // 4. give them the jwt token

        const token = jwTokenGenerator(user.rows[0].customer_id);

        res.json({ token });
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }

});




router.post("/register/researcher", validinfo, async (req, res) => {
    
    try {

        // 1. destructure the req.body (email, password, phone, researcher_name, d.o.b, image, gender, address, billing_address)
        const { email, password, phone, researcher_name, date_of_birth, image, gender, address, billing_address } = req.body;

        // 2. check if user exists (if user exists then throw error)

        const user = await client.query("SELECT * FROM researcher WHERE email = $1", [email]);

        if (user.rows.length !== 0) {
            return res.status(401).json("User already exists!");
        }

        // 3. bcrypt the user password

        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);

        const bcryptPassword = await bcrypt.hash(password, salt);


        // 4. enter the new user inside our database

        const temp = await client.query("INSERT INTO researcher (researcher_id, email, password, phone, researcher_name, date_of_birth, image, gender, address, billing_address) VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;",
            [email, bcryptPassword, phone, researcher_name, date_of_birth, image, gender, address, billing_address]);

        // 5. generating our jwt token

        const token = jwTokenGenerator(temp.rows[0].researcher_id);

        res.json({ token });
        console.log( temp.rows[0] );
        
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }

});




router.post("/login/researcher", validinfo, async (req, res) => {
    
    try {

        // 1. destructure the req.body

        const { email, password } = req.body;

        // 2. check if user doesn't exist (if not then throw error)

        const user = await client.query("SELECT * FROM researcher WHERE email = $1", [email]);

        if (user.rows.length === 0) {
            return res.status(401).json("Invalid Credential");
        }

        // 3. check if incoming password is the same as the database password

        const validPassword = await bcrypt.compare(password, user.rows[0].password);

        if (!validPassword) {
            return res.status(401).json("Invalid Credential");
        }

        // 4. give them the jwt token

        const token = jwTokenGenerator(user.rows[0].researcher_id);

        res.json({ token });
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }

});





router.get("/verify", authorize, async (req, res) => {
    
    try {   

        // 1. if token is valid then user is verified

        res.json(true);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }

}); 




export default router;