const controller = require("../controller");
const fs = require("fs/promises");
const path = require("path");
module.exports = new (class extends controller {
  async addToCart(req, res) {
    const { productId } = req.body;

    const product = await this.Product.findById(productId);

    if (!product) {
      return this.response({
        res,
        code: 404,
        message: "محصولی پیدا نشد",
      });
    }

    let cart = await this.Cart.findOne({
      user: req.user._id,
    });

    if (product.quantity <= 0) {
      return this.response({
        res,
        code: 400,
        message: "این محصول موجود نیست",
      });
    }
    product.quantity -= 1;
    if (product.quantity === 0) {
      product.show = false;
    }

    await product.save();

    if (!cart) {
      cart = new this.Cart({
        user: req.user._id,
        products: [{ productId, quantity: 1 }],
      });
    } else {
      const item = cart.products.find(
        (item) => item.productId.toString() === productId,
      );

      if (item) {
        item.quantity += 1;
      } else {
        cart.products.push({ productId, quantity: 1 });
      }
    }

    await cart.save();

    this.response({ res, message: "محصول به سبد خرید اضافه شد", data: cart });
  }

  async getProdoct(req, res) {
    const product = await this.Cart.findOne({ user: req.user.id })
      .populate("products.productId")
      .populate("user", "-password");
    if (!product) {
      return this.response({ res, code: 404, message: "پیدا نشد" });
    }
    this.response({ res, data: product, message: "ok" });
  }

  async isComplate(req, res) {
    const cart = await this.Cart.findOne({
      user: req.user.id,
    });

    if (!cart) {
      return this.response({
        res,
        code: 404,
        message: "سبد خرید پیدا نشد",
      });
    }

    if (cart.products.length === 0) {
      return this.response({
        res,
        code: 400,
        message: "سبد خرید خالی است",
      });
    }

    function priceToNumber(price) {
      const normalizedPrice = price
        .replace(/[۰-۹]/g, (digit) => "۰۱۲۳۴۵۶۷۸۹".indexOf(digit))
        .replace(/[٠-٩]/g, (digit) => "٠١٢٣٤٥٦٧٨٩".indexOf(digit))
        .replace(/,/g, "")
        .trim();

      const number = parseFloat(normalizedPrice);

      if (normalizedPrice.includes("میلیون")) {
        return number * 1000000;
      }

      if (normalizedPrice.includes("هزار")) {
        return number * 1000;
      }

      return number;
    }

    let totalPrice = 50000;

    for (const item of cart.products) {
      const product = await this.Product.findById(item.productId);

      if (!product) {
        return this.response({
          res,
          code: 404,
          message: "یکی از محصولات پیدا نشد",
        });
      }

      const price = priceToNumber(product.price);

      totalPrice += price * item.quantity;
    }

    const registered = new this.Registered({
      user: cart.user,
      products: cart.products,
      totalPrice,
    });

    cart.products = [];

    await registered.save();
    await cart.save();

    const message = new this.Message({
      title: "ثبت شد",
      text: `سفارش شما با موفقیت ثبت شد و به فروشنده ارسال شد. تحویل محصول 2 تا 3 روز کاری طول می‌کشد.`,
      user: req.user.id,
    });

    await message.save();
    this.response({
      res,
      message: "ثبت شد",
    });
  }

  async registered(req, res) {
    const registeredProduct = await this.Registered.find()
      .populate("products.productId")
      .populate("user", "-password -isadmin");

    if (registeredProduct.length == 0) {
      return this.response({ code: 404, res, message: "هیچ خریدی انجام نشده" });
    }

    this.response({
      res,
      message: "لیست خریدهای انجام شده",
      data: registeredProduct,
    });
  }

  async isDelivered(req, res) {
    const registeredProduct = await this.Registered.findOne({
      _id: req.body.orderId,
    })
      .populate("products.productId")
      .populate("user");
    if (!registeredProduct) {
      return this.response({ res, message: "این خرید یافت نشد" });
    }

    await Promise.all(
      registeredProduct.products.map(async (item) => {
        const product = item.productId;
        if (product.quantity === 0) {
          if (product.img) {
            const imagePath = path.join(process.cwd(), "public", product.img);

            try {
              await fs.unlink(imagePath);
              console.log("تصویر محصول حذف شد:", imagePath);
            } catch (error) {
              console.log("خطا در حذف تصویر:", error.message);
            }
          }

          await this.Product.findByIdAndDelete(product._id);
        }

        let report = await this.Report.findOne({ category: product.category });
        if (!report) {
          report = new this.Report({
            category: product.category,
            quantity: item.quantity,
          });
          await report.save();
        } else {
          report.quantity += item.quantity;
          await report.save();
        }
      }),
    );

    await this.Registered.deleteOne({
      _id: req.body.orderId,
    });

    const message = new this.Message({
      title: "تحویل داده شد",
      text: `سفارش شما تحویل داده شد. امیدوارم راضی بوده باشید. `,
      user: registeredProduct.user._id,
    });

    await message.save();

    this.response({ res, message: "با موفقیت حذف شد" });
  }

  async cancelOrder(req, res) {
    const registeredProduct = await this.Registered.findOne({
      _id: req.body.orderId,
    })
      .populate("products.productId")
      .populate("user");
    if (!registeredProduct) {
      return this.response({ res, message: "این خرید یافت نشد" });
    }

    await Promise.all(
      registeredProduct.products.map(async (item) => {
        const product = item.productId;
        if (product.quantity === 0) {
        }

        const thisProduct = await this.Product.findOne({ _id: product._id });
        thisProduct.quantity += item.quantity;

        if (!product.show) {
          thisProduct.show = true;
        }
        await thisProduct.save();
      }),
    );

    await this.Registered.deleteOne({
      _id: req.body.orderId,
    });

    const message = new this.Message({
      title: "سفارش لغو شد",
      text: `سفارش شما توسط ادمین لغو شد می‌توانید از طریق راه‌های ارتباطی با ادمین درمورد آن صحبت کنید`,
      user: registeredProduct.user._id,
    });

    await message.save();

    this.response({
      res,
      message: "لغو سفارش انجام شد و محصولات سفارش داده شده به دیتابیس برگشت",
    });
  }

  async deleteProduct(req, res) {
    const cart = await this.Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return this.response({
        res,
        code: 404,
        message: "سبد خرید یافت نشد",
      });
    }

    const item = cart.products.find(
      (item) => item.productId.toString() === req.body.productId,
    );

    if (!item) {
      return this.response({
        res,
        code: 404,
        message: "این محصول در سبد خرید نیست",
      });
    }

    const product = await this.Product.findOne({
      _id: req.body.productId,
    });

    if (!product) {
      return this.response({
        res,
        code: 404,
        message: "محصول پیدا نشد",
      });
    }

    product.quantity += item.quantity;
    product.show = true;

    await product.save();

    cart.products = cart.products.filter(
      (item) => item.productId.toString() !== req.body.productId,
    );

    await cart.save();

    this.response({
      res,
      message: "محصول با موفقیت از سبد خرید حذف شد",
    });
  }

  async me(req, res) {
    const user = await this.Registered.find({ user: req.user._id }).populate(
      "products.productId",
    );
    if (user.length == 0) {
      return this.response({ res, message: "شما سفارشی ندارید", code: 400 });
    }
    this.response({ res, message: "لیست سفارش‌های شما", data: user });
  }
})();
