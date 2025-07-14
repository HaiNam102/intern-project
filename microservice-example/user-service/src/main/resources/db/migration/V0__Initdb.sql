CREATE TABLE role (
    role_id BIGINT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    role_name VARCHAR(25) NOT NULL
);

CREATE TABLE users (
    user_id BIGINT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    name_of_user VARCHAR(255),
    email VARCHAR(255),
    address VARCHAR(255),
    role_id BIGINT,
    CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES role(role_id) ON DELETE CASCADE
);

CREATE TABLE products(
    product_id BIGINT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    product_name NVARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL
);

CREATE TABLE orders(
    order_id BIGINT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    product_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    quantity_order INTEGER,
    user_id BIGINT,
    CONSTRAINT fk_orders_products FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);
