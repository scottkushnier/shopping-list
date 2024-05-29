process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("./shopping");
let items = require("./fakeDb");

let apple = { name: "apple", price: 1.5 };

beforeEach(function () {
  items.push(apple);
});

afterEach(function () {
  // make sure this *mutates*, not redefines, `cats`
  items.length = 0;
});

describe("GET /items", function () {
  test("Gets whole shopping list", async function () {
    const resp = await request(app).get("/items");
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual([apple]);
  });
});

describe("GET /items/:name", function () {
  test("Gets one item", async function () {
    const resp = await request(app).get("/items/apple");
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual(apple);
  });
  test("try get missing item", async function () {
    const resp = await request(app).get("/items/banana");
    expect(resp.statusCode).toBe(400);
    expect(resp.body.error.message).toEqual("Error: no such item: 'banana'");
  });
});

describe("POST /items", function () {
  test("Creates a new shopping list item", async function () {
    const resp = await request(app).post("/items").send({
      name: "chocolate",
      price: 0.99,
    });
    expect(resp.statusCode).toBe(201);
    expect(resp.body).toEqual({
      added: { name: "chocolate", price: 0.99 },
    });
  });
});

describe("PATCH /items/:name", function () {
  test("Updates a list item", async function () {
    const resp = await request(app).patch("/items/apple").send({
      price: 2.5,
    });
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({
      updated: { name: "apple", price: 2.5 },
    });
  });
  test("try to update a missing item", async function () {
    const resp = await request(app).patch("/items/pear").send({
      price: 2.5,
    });
    expect(resp.statusCode).toBe(400);
    expect(resp.body.error.message).toEqual("Error: no such item: 'pear'");
  });
});

describe("DELETE /items/:name", function () {
  test("Deletes a list item", async function () {
    const resp = await request(app).delete("/items/apple");
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({
      message: "Deleted",
    });
  });
  test("try to update a missing item", async function () {
    const resp = await request(app).patch("/items/lemon");
    expect(resp.statusCode).toBe(400);
    expect(resp.body.error.message).toEqual("Error: no such item: 'lemon'");
  });
});
