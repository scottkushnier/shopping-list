const express = require("express");

const router = new express.Router();

router.use(express.json());

router.get("/items", function (req, res) {
  return res.json(items);
});

router.post("/items", function (req, res, next) {
  const item = { name: req.body.name, price: req.body.price };
  const found = items.find(function (item) {
    return item.name === req.body.name;
  });
  try {
    if (found != undefined) {
      throw new ExpressError(
        `Error: item already exists: '${req.body.name}'`,
        400
      );
    }
  } catch (e) {
    return next(e);
  }
  items.push(item);
  return res.status(201).json({ added: item });
});

router.get("/items/:name", function (req, res, next) {
  const wanted = req.params.name;
  const found = items.find(function (item) {
    return item.name === wanted;
  });
  try {
    if (found == undefined) {
      throw new ExpressError(`Error: no such item: '${wanted}'`, 400);
    }
  } catch (e) {
    return next(e);
  }
  //   console.log("found:", found);
  return res.json(found);
});

router.patch("/items/:name", function (req, res, next) {
  const wanted = req.params.name;
  // console.log("wanted: ", wanted);
  const found = items.find(function (item) {
    return item.name === wanted;
  });
  try {
    if (found == undefined) {
      throw new ExpressError(`Error: no such item: '${wanted}'`, 400);
    }
  } catch (e) {
    return next(e);
  }
  if (req.body.name) {
    found.name = req.body.name;
  }
  if (req.body.price) {
    found.price = req.body.price;
  }
  return res.json({ updated: found });
});

router.delete("/items/:name", function (req, res, next) {
  const victim = req.params.name;
  const found = items.find(function (item) {
    return item.name === victim;
  });
  try {
    if (found == undefined) {
      throw new ExpressError(`Error: no such item: '${victim}'`, 400);
    }
  } catch (e) {
    return next(e);
  }
  items = items.filter((x) => x.name !== victim);
  return res.json({ message: "Deleted" });
});

class ExpressError extends Error {
  constructor(message, status) {
    super();
    this.message = message;
    this.status = status;
    // console.error(this.stack);
  }
}

router.use(function (err, req, res, next) {
  // the default status is 500 Internal Server Errorlet status = err.status || 500;
  let message = err.message;
  let status = err.status || 500;
  // set the status and alert the user
  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = router;
