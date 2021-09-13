const express = require("express");
const { verifyToken } = require("../middlewares/verifyToken");
const { Cart } = require("../models/cart-model");
const { User } = require("../models/user-model");
const CartRouter = express.Router();
CartRouter.route("/")
  .get(async (req, res) => {
    try {
      const myCart = await Cart.find({});
      res.json({ myCart: myCart });
    } catch (error) {
      res.status(400).json({
        status: false,
        message: "couldn't collect the data",
        errorMessaage: error.message,
      });
    }
  })
  .post(verifyToken, async (req, res) => {
    try {
      const { productId, userId } = req.body;
      const user = await User.findById(userId);
      user.cart.push(productId);
      // const newProduct = new Cart(data)
      // const SavedData = await newProduct.save()
      const response = await user.save();
      res.json({
        status: true,
        message: "profduct saved to cart successfully",
        response,
      });
    } catch (error) {
      res.json({
        status: false,
        message: "Failed to update the cart'",
        errorMessaage: error.message,
      });
    }
  })

  .put(async (req, res) => {
    const id = req.body._id;
    const paramCase = req.param("case");
    // for increment
    if (paramCase === "inc") {
      try {
        Cart.updateOne(
          { _id: id },
          {
            $inc: { quantity: 1 },
          }

          // (err, result) => {
          //   if (err) {
          //     res.send(err);
          //   } else {
          //     res.json(result);
          //   }
          // }
        );
      } catch (error) {
        res.json({ message: "failed", errMessage: error.message });
      }
    }

    //for decrement
    else {
      try {
        Cart.updateOne(
          { _id: id },
          {
            $inc: { quantity: -1 },
          }

          // (err, result) => {
          //   if (err) {
          //     res.send(err);
          //   } else {
          //     res.json(result);
          //   }
          // }
        );
      } catch (error) {
        res.json({ message: "failed", errMessage: error.message });
      }
    }
  });

CartRouter.route("/:id").delete(async (req, res) => {
  const { id } = req.params;
  try {
    await Cart.remove({ _id: id });
    res.json({ staus: true, message: "deleted successfully" });
  } catch (error) {
    res.json({
      status: false,
      message: "something wrong happened",
      errorMessaage: error.message,
    });
  }
});

module.exports = { CartRouter };
