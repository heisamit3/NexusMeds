CREATE EXTENSION IF NOT EXISTS "uuid-ossp";-- add extension for generating uuid
CREATE DATABASE NEXUSMEDS;

CREATE TABLE Manufacturer(
  
  manufacturer_id SERIAL PRIMARY KEY,
  manufacturer_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  address VARCHAR(200)
	
);


CREATE TABLE medicine(
    
    medicine_id SERIAL PRIMARY KEY,
    med_name varchar(100) NOT NULL,
    price numeric(6,3) NOT NULL,
    image VARCHAR(500),
    generic_name VARCHAR(100),
    package_type VARCHAR(100),
    med_form VARCHAR(50),
    isOTC BOOLEAN,
    manufacturer_id INTEGER REFERENCES Manufacturer(manufacturer_id) NOT NULL,
    indication VARCHAR(100),
    dosage VARCHAR(500),
    dosageStrength numeric(4,0),
    cautions VARCHAR(2000)
);

CREATE TABLE Chemical(

  chemical_id SERIAL PRIMARY KEY,
  chem_name VARCHAR(200) NOT NULL,
  image VARCHAR(500),
  iupac_name VARCHAR(200),
  manufacturer_id INTEGER REFERENCES Manufacturer(manufacturer_id) NOT NULL,
	parent_chemical_id INTEGER REFERENCES Chemical(chemical_id),
  chemical_formula VARCHAR(100),
  description VARCHAR(500),
  molecular_weight numeric(6,3),
  price numeric(6,3) NOT NULL
  
);

CREATE TABLE Customer (
    customer_id UUID UNIQUE DEFAULT UUID_generate_v4(),
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    password TEXT NOT NULL,


    customer_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    image VARCHAR(500),
    gender BOOLEAN,
    address VARCHAR(200),
    billing_address VARCHAR(200),
		PRIMARY KEY(customer_id, email, phone)
);


CREATE TABLE Researcher (

	researcher_id UUID UNIQUE DEFAULT UUID_generate_v4(),
	email VARCHAR(100) NOT NULL,
	phone VARCHAR(15) NOT NULL,
  password TEXT NOT NULL,


	researcher_name VARCHAR(100) NOT NULL,
	date_of_birth DATE,
	image VARCHAR(500),
	gender BOOLEAN,
	address VARCHAR(200),
	billing_address VARCHAR(200),
	isApproved BOOLEAN,
	PRIMARY KEY( researcher_id, email , phone)
);

CREATE TABLE MedicineChemical (
    medicine_id INTEGER REFERENCES medicine(medicine_id),
    chemical_id INTEGER REFERENCES Chemical(chemical_id),
		purpose VARCHAR(200),
    PRIMARY KEY (medicine_id, chemical_id)
);

CREATE TABLE Cart (
    cart_id SERIAL PRIMARY KEY,
    isCustomer BOOLEAN, -- 'researcher' or 'customer'
    customer_id UUID REFERENCES Customer(customer_id) ,
    researcher_id UUID REFERENCES Researcher(researcher_id)
);

CREATE TABLE Orders (
    order_id SERIAL PRIMARY KEY,
    shipment_date DATE,
    status BOOLEAN,
		price numeric (6,3),
    order_date DATE,
    cart_id INTEGER REFERENCES Cart(cart_id) NOT NULL
);

CREATE TABLE Payment (
    payment_id SERIAL PRIMARY KEY,
    payment_date DATE,
    price numeric(8,2),
    order_id INTEGER REFERENCES Orders(order_id) NOT NULL
);


CREATE TABLE CartMedicine (

    cart_id INTEGER REFERENCES Cart(cart_id),
    medicine_id INTEGER REFERENCES medicine(medicine_id),
    quantity INTEGER DEFAULT 0,
    PRIMARY KEY (cart_id, medicine_id)
);

CREATE TABLE CartChemical (

    cart_id INTEGER REFERENCES Cart(cart_id),
    chemical_id INTEGER REFERENCES chemical(chemical_id),
    quantity INTEGER DEFAULT 0,
    PRIMARY KEY (cart_id, chemical_id)
);

ALTER TABLE Cart
ADD COLUMN cart_status BOOLEAN DEFAULT false;



CREATE TABLE DeliveryService (

		delivery_service_id SERIAL PRIMARY KEY,
		order_id INTEGER REFERENCES Orders(order_id),
		delivery_service_name VARCHAR(100) NOT NULL,
		phone VARCHAR(15),
		email VARCHAR(100) NOT NULL,
		delivery_cost numeric(6,3),
		address VARCHAR(200)
);

CREATE TABLE Inventory (
    medicine_id INTEGER REFERENCES medicine(medicine_id),
    chemical_id INTEGER REFERENCES Chemical(chemical_id),
    stocked_amount numeric(5,0),
    sold_amount numeric(5,0),
    PRIMARY KEY (medicine_id, chemical_id)
);

/*
CREATE TABLE SupplyRequest (

    request_id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES Product(product_id),
    quantity INTEGER,
    request_date DATE
); */

CREATE TABLE InventoryLog (

    log_id SERIAL PRIMARY KEY,
    manufacturer_id INTEGER REFERENCES Manufacturer(manufacturer_id),
    medicine_id INTEGER REFERENCES medicine(medicine_id),
    chemical_id INTEGER REFERENCES Chemical(chemical_id),
    log_date DATE,
    added_quantity numeric(5,0)
);


CREATE TABLE Admins (
    admin_id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(500) NOT NULL
);


-- alters


ALTER TABLE chemical
ALTER COLUMN description TYPE TEXT;

ALTER TABLE chemical
ALTER COLUMN image TYPE TEXT;

ALTER TABLE chemical
ALTER COLUMN chemical_formula TYPE TEXT;

ALTER TABLE customer
ALTER COLUMN image TYPE TEXT;

ALTER TABLE customer
ALTER COLUMN address TYPE TEXT;

ALTER TABLE customer
ALTER COLUMN billing_address TYPE TEXT;

ALTER TABLE deliveryservice
ALTER COLUMN address TYPE TEXT;

ALTER TABLE manufacturer
ALTER COLUMN address TYPE TEXT;

ALTER TABLE manufacturer
ALTER COLUMN manufacturer_name TYPE TEXT;

ALTER TABLE medicine
ALTER COLUMN med_name TYPE TEXT;

ALTER TABLE medicine
ALTER COLUMN image TYPE TEXT;

ALTER TABLE medicine
ALTER COLUMN generic_name TYPE TEXT;


ALTER TABLE medicine
ALTER COLUMN indication TYPE TEXT;


ALTER TABLE medicine
ALTER COLUMN dosage TYPE TEXT;


ALTER TABLE medicine
ALTER COLUMN cautions TYPE TEXT;


ALTER TABLE researcher
ALTER COLUMN image TYPE TEXT;

ALTER TABLE researcher
ALTER COLUMN address TYPE TEXT;

ALTER TABLE researcher
ALTER COLUMN billing_address TYPE TEXT;


--CASCADE added

ALTER TABLE medicine
DROP CONSTRAINT IF EXISTS fk_medicine_manufacturer,
ADD CONSTRAINT fk_medicine_manufacturer FOREIGN KEY (manufacturer_id) REFERENCES Manufacturer(manufacturer_id) ON DELETE CASCADE;

ALTER TABLE Chemical
DROP CONSTRAINT IF EXISTS fk_chemical_manufacturer,
ADD CONSTRAINT fk_chemical_manufacturer FOREIGN KEY (manufacturer_id) REFERENCES Manufacturer(manufacturer_id) ON DELETE CASCADE;

ALTER TABLE MedicineChemical
DROP CONSTRAINT IF EXISTS fk_medicinechemical_medicine,
ADD CONSTRAINT fk_medicinechemical_medicine FOREIGN KEY (medicine_id) REFERENCES medicine(medicine_id) ON DELETE CASCADE;

ALTER TABLE MedicineChemical
DROP CONSTRAINT IF EXISTS fk_medicinechemical_chemical,
ADD CONSTRAINT fk_medicinechemical_chemical FOREIGN KEY (chemical_id) REFERENCES Chemical(chemical_id) ON DELETE CASCADE;

ALTER TABLE Cart
DROP CONSTRAINT IF EXISTS fk_cart_customer,
ADD CONSTRAINT fk_cart_customer FOREIGN KEY (customer_id) REFERENCES Customer(customer_id) ON DELETE CASCADE;

ALTER TABLE Cart
DROP CONSTRAINT IF EXISTS fk_cart_researcher,
ADD CONSTRAINT fk_cart_researcher FOREIGN KEY (researcher_id) REFERENCES Researcher(researcher_id) ON DELETE CASCADE;

ALTER TABLE Orders
DROP CONSTRAINT IF EXISTS fk_orders_cart,
ADD CONSTRAINT fk_orders_cart FOREIGN KEY (cart_id) REFERENCES Cart(cart_id) ON DELETE CASCADE;

ALTER TABLE Payment
DROP CONSTRAINT IF EXISTS fk_payment_orders,
ADD CONSTRAINT fk_payment_orders FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE;

ALTER TABLE DeliveryService
DROP CONSTRAINT IF EXISTS fk_deliveryservice_orders,
ADD CONSTRAINT fk_deliveryservice_orders FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE;

ALTER TABLE Inventory
DROP CONSTRAINT IF EXISTS fk_inventory_medicine,
ADD CONSTRAINT fk_inventory_medicine FOREIGN KEY (medicine_id) REFERENCES medicine(medicine_id) ON DELETE CASCADE;

ALTER TABLE Inventory
DROP CONSTRAINT IF EXISTS fk_inventory_chemical,
ADD CONSTRAINT fk_inventory_chemical FOREIGN KEY (chemical_id) REFERENCES Chemical(chemical_id) ON DELETE CASCADE;

ALTER TABLE InventoryLog
DROP CONSTRAINT IF EXISTS fk_inventorylog_medicine,
ADD CONSTRAINT fk_inventorylog_medicine FOREIGN KEY (medicine_id) REFERENCES medicine(medicine_id) ON DELETE SET NULL;

ALTER TABLE InventoryLog
DROP CONSTRAINT IF EXISTS fk_inventorylog_chemical,
ADD CONSTRAINT fk_inventorylog_chemical FOREIGN KEY (chemical_id) REFERENCES Chemical(chemical_id) ON DELETE SET NULL;
