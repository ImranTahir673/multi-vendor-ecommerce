const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Shop = require("../model/shop");
const Event = require("../model/event");
const ErrorHandler = require("../utils/ErrorHandler");
const { isSeller, isAdmin, isAuthenticated } = require("../middleware/auth");
const router = express.Router();
const cloudinary = require("cloudinary");

// create event
router.post(
  "/create-event",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shopId = req.body.shopId;
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("Shop Id is invalid!", 400));
      } else {
        let images = [];

        if (typeof req.body.images === "string") {
          images.push(req.body.images);
        } else if (Array.isArray(req.body.images)) {
          images = req.body.images;
        }

        const imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
          if (typeof images[i] === "string" && images[i].startsWith("data:image")) {
            try {
              const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "products",
              });
              imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url,
              });
            } catch (uploadErr) {
              console.warn("Cloudinary event image error:", uploadErr.message);
              imagesLinks.push({
                public_id: `event_img_${Date.now()}_${i}`,
                url: images[i],
              });
            }
          } else if (typeof images[i] === "string") {
            imagesLinks.push({
              public_id: `event_img_${Date.now()}_${i}`,
              url: images[i],
            });
          } else if (images[i] && images[i].url) {
            imagesLinks.push(images[i]);
          }
        }

        if (imagesLinks.length === 0) {
          imagesLinks.push({
            public_id: "placeholder",
            url: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500",
          });
        }

        const productData = { ...req.body };
        productData.images = imagesLinks;
        productData.shop = shop;

        const event = await Event.create(productData);

        res.status(201).json({
          success: true,
          event,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// get all events
router.get("/get-all-events", async (req, res, next) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// get all events of a shop
router.get(
  "/get-all-events/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const events = await Event.find({ shopId: req.params.id }).sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        events,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// delete event of a shop
router.delete(
  "/delete-shop-event/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const event = await Event.findById(req.params.id);

      if (!event) {
        return next(new ErrorHandler("Event is not found with this id", 404));
      }

      for (let i = 0; i < event.images.length; i++) {
        if (event.images[i].public_id && event.images[i].public_id !== "placeholder") {
          try {
            await cloudinary.v2.uploader.destroy(event.images[i].public_id);
          } catch (e) {}
        }
      }

      await Event.findByIdAndDelete(req.params.id);

      res.status(200).json({
        success: true,
        message: "Event Deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// all events --- for admin
router.get(
  "/admin-all-events",
  isAuthenticated,
  isAdmin("Admin", "admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const events = await Event.find().sort({
        createdAt: -1,
      });
      res.status(200).json({
        success: true,
        events,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
