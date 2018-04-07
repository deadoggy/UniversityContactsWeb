CREATE DATABASE contacts DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

USE contacts;

CREATE TABLE t_mate (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255),
  province VARCHAR(255),
  city VARCHAR(255),
  district VARCHAR(255),
  company VARCHAR(255)
);

