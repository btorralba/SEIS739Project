-- drop schema seis739finalschema CASCADE

create schema if not exists seis739finalschema;

create table if not exists seis739finalschema.product (
	sku BIGINT PRIMARY KEY,
	product_name VARCHAR(100) NOT NULL,
	price DOUBLE PRECISION NOT NULL,
	img_id BIGINT NOT NULL,
	size VARCHAR(20) NOT NULL,
	color VARCHAR(10) NOT NULL,
	quantity BIGINT NOT NULL
);

create table if not exists seis739finalschema.customer (
	customer_sk SERIAL PRIMARY KEY,
	first_name VARCHAR(50) NOT NULL,
	last_name VARCHAR(50) NOT NULL,
	email_address VARCHAR(50) NOT NULL,
	phone_number VARCHAR(50)
);

create table if not exists seis739finalschema.shipping (
	shipping_sk SERIAL PRIMARY KEY,
	address_line_1 VARCHAR(50) NOT NULL,
	address_line_2 VARCHAR(50),
	address_line_3 VARCHAR(50),
	zip_code VARCHAR(5) NOT NULL,
	city VARCHAR(50) NOT NULL,
	state_abbr VARCHAR(2) NOT NULL,
	customer_sk BIGINT REFERENCES seis739finalschema.customer
);


create table if not exists seis739finalschema.order (
	tracking_number SERIAL PRIMARY KEY,
	sku BIGINT NOT NULL,
	status VARCHAR(10) NOT NULL,
	order_number VARCHAR(16) NOT NULL,
	shipping_sk BIGINT REFERENCES seis739finalschema.shipping,
	customer_sk BIGINT REFERENCES seis739finalschema.customer
);

create table if not exists seis739finalschema.user (
	customer_sk SERIAL PRIMARY KEY,
	user_id VARCHAR(50) NOT NULL,
	user_pass VARCHAR(50) NOT NULL
);

create table if not exists seis739finalschema.payment (
	payment_sk SERIAL PRIMARY KEY,
	customer_sk BIGINT REFERENCES seis739finalschema.customer,
	card_number VARCHAR(16) NOT NULL,
	expiration_mm_yy VARCHAR(4) NOT NULL,
	cvv VARCHAR(3) NOT NULL
);

INSERT INTO seis739finalschema.product (sku, product_name, price, img_id, size, color, quantity) VALUES
(12300, 'Guardian Of Shadows', 29.99, 1, 'Small',  'Tan', 100),
(12301, 'Guardian Of Shadows', 29.99, 1, 'Medium', 'Tan', 100),
(12302, 'Guardian Of Shadows', 29.99, 1, 'Large',  'Tan', 100),
(12303, 'Guardian Of Shadows', 29.99, 1, 'X-Large', 'Tan', 100),
(12304, 'Guardian Of Shadows', 29.99, 1, 'XX-Large', 'Tan', 100),

(12310, 'Guardian Of Shadows', 29.99, 1, 'Small',  'Black', 100),
(12311, 'Guardian Of Shadows', 29.99, 1, 'Medium', 'Black', 100),
(12312, 'Guardian Of Shadows', 29.99, 1, 'Large',  'Black', 100),
(12313, 'Guardian Of Shadows', 29.99, 1, 'X-Large', 'Black', 100),
(12314, 'Guardian Of Shadows', 29.99, 1, 'XX-Large', 'Black', 100);

INSERT INTO seis739finalschema.product (sku, product_name, price, img_id, size, color, quantity) VALUES
(123400, 'Modern Crusader', 29.99, 2, 'Small',  'Tan', 100),
(123401, 'Modern Crusader', 29.99, 2, 'Medium', 'Tan', 100),
(123402, 'Modern Crusader', 29.99, 2, 'Large',  'Tan', 100),
(123403, 'Modern Crusader', 29.99, 2, 'X-Large', 'Tan', 100),
(123404, 'Modern Crusader', 29.99, 2, 'XX-Large', 'Tan', 100),

(123410, 'Modern Crusader', 29.99, 2, 'Small',  'Black', 100),
(123411, 'Modern Crusader', 29.99, 2, 'Medium', 'Black', 100),
(123412, 'Modern Crusader', 29.99, 2, 'Large',  'Black', 100),
(123413, 'Modern Crusader', 29.99, 2, 'X-Large', 'Black', 100),
(123414, 'Modern Crusader', 29.99, 2, 'XX-Large', 'Black', 100);

INSERT INTO seis739finalschema.product (sku, product_name, price, img_id, size, color, quantity) VALUES
(1234500, 'St Michael', 29.99, 3, 'Small',  'Tan', 100),
(1234501, 'St Michael', 29.99, 3, 'Medium', 'Tan', 100),
(1234502, 'St Michael', 29.99, 3, 'Large',  'Tan', 100),
(1234503, 'St Michael', 29.99, 3, 'X-Large', 'Tan', 100),
(1234504, 'St Michael', 29.99, 3, 'XX-Large', 'Tan', 100),

(1234510, 'St Michael', 29.99, 3, 'Small',  'Black', 100),
(1234511, 'St Michael', 29.99, 3, 'Medium', 'Black', 100),
(1234512, 'St Michael', 29.99, 3, 'Large',  'Black', 100),
(1234513, 'St Michael', 29.99, 3, 'X-Large', 'Black', 100),
(1234514, 'St Michael', 29.99, 3, 'XX-Large', 'Black', 100);

INSERT INTO seis739finalschema.product (sku, product_name, price, img_id, size, color, quantity) VALUES
(12345600, 'Phantom Recon', 29.99, 4, 'Small',  'Tan', 100),
(12345601, 'Phantom Recon', 29.99, 4, 'Medium', 'Tan', 100),
(12345602, 'Phantom Recon', 29.99, 4, 'Large',  'Tan', 100),
(12345603, 'Phantom Recon', 29.99, 4, 'X-Large', 'Tan', 100),
(12345604, 'Phantom Recon', 29.99, 4, 'XX-Large', 'Tan', 100),

(12345610, 'Phantom Recon', 29.99, 4, 'Small',  'Black', 100),
(12345611, 'Phantom Recon', 29.99, 4, 'Medium', 'Black', 100),
(12345612, 'Phantom Recon', 29.99, 4, 'Large',  'Black', 100),
(12345613, 'Phantom Recon', 29.99, 4, 'X-Large', 'Black', 100),
(12345614, 'Phantom Recon', 29.99, 4, 'XX-Large', 'Black', 100);

INSERT INTO seis739finalschema.product (sku, product_name, price, img_id, size, color, quantity) VALUES
(123456700, 'Night Reaper', 29.99, 5, 'Small',  'Tan', 100),
(123456701, 'Night Reaper', 29.99, 5, 'Medium', 'Tan', 100),
(123456702, 'Night Reaper', 29.99, 5, 'Large',  'Tan', 100),
(123456703, 'Night Reaper', 29.99, 5, 'X-Large', 'Tan', 100),
(123456704, 'Night Reaper', 29.99, 5, 'XX-Large', 'Tan', 100),

(123456710, 'Night Reaper', 29.99, 5, 'Small',  'Black', 100),
(123456711, 'Night Reaper', 29.99, 5, 'Medium', 'Black', 100),
(123456712, 'Night Reaper', 29.99, 5, 'Large',  'Black', 100),
(123456713, 'Night Reaper', 29.99, 5, 'X-Large', 'Black', 100),
(123456714, 'Night Reaper', 29.99, 5, 'XX-Large', 'Black', 100);

insert into seis739finalschema.customer(first_name, last_name, email_address) VALUES ('Joe', 'Smith', 'joe.smith@gmail.com');
insert into seis739finalschema.customer(first_name, last_name, email_address) VALUES ('Bob', 'Smith', 'bob.smith@gmail.com');
insert into seis739finalschema.customer(first_name, last_name, email_address) VALUES ('Chuck', 'Smith', 'chuck.smith@gmail.com');

insert into seis739finalschema.user (user_id, user_pass) VALUES ('joe', 'abc123');
insert into seis739finalschema.user (user_id, user_pass) VALUES ('bob', 'pass');
insert into seis739finalschema.user (user_id, user_pass) VALUES ('chuck', 'pass1');