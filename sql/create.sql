-- Creating the role 'new_username'
CREATE ROLE new_username WITH LOGIN PASSWORD 'your_password';
ALTER ROLE new_username CREATEDB;

-- Creating the role 'bohdan'
CREATE ROLE bohdan WITH LOGIN PASSWORD 'bohdan';
ALTER ROLE bohdan CREATEDB;

\q

psql -U bohdan -d bohdan_database -h localhost
brew services start postgresql

