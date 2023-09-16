import Database from "bun:sqlite";

const db = new Database("db.sqlite");
//db.query(`DROP TABLE emailAddresses`).run();

db.query(
  `CREATE TABLE if not exists emailAddresses (
    email TEXT NOT NULL UNIQUE,
    fullName TEXT NOT NULL

)`
).run();

export const addEmailAddress = (address: string, fullName: string) => {
  const addOne = db.query(
    `INSERT INTO emailAddresses VALUES ($address, $fullName)`
  );
  addOne.run({
    $address: address,
    $fullName: fullName,
  });
};

export const getAllEmailAddresses = () => {
  const getAll = db.query(`SELECT email, fullName FROM emailAddresses`).all();
  return getAll;
};

export const getSpecificFromEmail = (term: string) => {
  const query = db.query(
    `
    SELECT * FROM emailAddresses WHERE email LIKE '%${term}%'`
  );
  const result = query.all();
  return result;
};

export const getSpecificFromName = (term: string) => {
  const query = db.query(`
  SELECT * FROM emailAddresses WHERE fullName LIKE '%${term}%'`);
  const result = query.all();
  return result;
};
