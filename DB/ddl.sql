-- drop schema seis739finalschema CASCADE

create schema if not exists seis739finalschema;

create table if not exists seis739finalschema.product (
	sku BIGINT PRIMARY KEY,
	product_name VARCHAR(100) NOT NULL,
	price DOUBLE PRECISION NOT NULL,
	img_id BIGINT NOT NULL
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
	zip_code_extension VARCHAR(4),
	city VARCHAR(50) NOT NULL,
	state_abbr VARCHAR(2) NOT NULL,
	customer_sk BIGINT REFERENCES seis739finalschema.customer
);

create table if not exists seis739finalschema.order (
	order_sk SERIAL PRIMARY KEY,
	sku BIGINT NOT NULL,
	status VARCHAR(10) NOT NULL,
	shipping_sk BIGINT REFERENCES seis739finalschema.shipping,
	customer_sk BIGINT REFERENCES seis739finalschema.customer
	
);

create table if not exists seis739finalschema.user (
	customer_sk SERIAL PRIMARY KEY,
	user_id VARCHAR(50) NOT NULL,
	user_pass VARCHAR(50) NOT NULL
);

insert into seis739finalschema.product(sku, product_name, price, img_id) VALUES (123456, 'Guardian Of Shadows', 29.99, 1);
insert into seis739finalschema.product(sku, product_name, price, img_id) VALUES (1234567, 'Modern Crusader', 29.99, 2);
insert into seis739finalschema.product(sku, product_name, price, img_id) VALUES (12345678, 'St Michael', 29.99, 3);
insert into seis739finalschema.product(sku, product_name, price, img_id) VALUES (123456789, 'Phantom Recon', 29.99, 4);

insert into seis739finalschema.customer(first_name, last_name, email_address) VALUES ('Joe', 'Smith', 'joe.smith@gmail.com');
insert into seis739finalschema.customer(first_name, last_name, email_address) VALUES ('Bob', 'Smith', 'bob.smith@gmail.com');
insert into seis739finalschema.customer(first_name, last_name, email_address) VALUES ('Chuck', 'Smith', 'chuck.smith@gmail.com');

insert into seis739finalschema.shipping(address_line_1, zip_code, city, state_abbr, customer_sk) VALUES ('2115 Summit Ave', '55105', 'St. Paul', 'MN', 1);
insert into seis739finalschema.shipping(address_line_1, zip_code, city, state_abbr, customer_sk) VALUES ('2116 Summit Ave', '55105', 'St. Paul', 'MN', 2);
insert into seis739finalschema.shipping(address_line_1, zip_code, city, state_abbr, customer_sk) VALUES ('2117 Summit Ave', '55105', 'St. Paul', 'MN', 3);

insert into seis739finalschema.order (sku, status, shipping_sk, customer_sk) VALUES (123456, 'ORDERED', 1, 1);
insert into seis739finalschema.order (sku, status, shipping_sk, customer_sk) VALUES (1234567, 'ORDERED', 1, 1);
insert into seis739finalschema.order (sku, status, shipping_sk, customer_sk) VALUES (12345678, 'ORDERED', 1, 1);
insert into seis739finalschema.order (sku, status, shipping_sk, customer_sk) VALUES (123456, 'SHIPPED', 1, 1);
insert into seis739finalschema.order (sku, status, shipping_sk, customer_sk) VALUES (123456789, 'DELIVERED', 2, 2);
insert into seis739finalschema.order (sku, status, shipping_sk, customer_sk) VALUES (123456, 'SHIPPED', 3, 3);

insert into seis739finalschema.user (user_id, user_pass) VALUES ('joe', 'abc123');
insert into seis739finalschema.user (user_id, user_pass) VALUES ('bob', 'pass');
insert into seis739finalschema.user (user_id, user_pass) VALUES ('chuck', 'pass1');