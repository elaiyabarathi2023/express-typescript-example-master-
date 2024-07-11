import { Application } from "express";
import homeRoutes from "./home.routes";
import tutorialRoutes from "./tutorial.routes";
import productCategoryRoute from "./productCategory.route";
import productSubCategoryRoute from "./productSubCategory.route";
import productDetailRoutes from "./productDetail.route";
import AdminRoutes from "../routes/AdminRoutes/AdminAuth.route"
import UserRoutes from "./UserRoutes/UserAuth.route";
import AddressDetailRoutes from "./AddressDetail.routes";
import wishlistRoutes from "./wishlist.routes";
import cartRoute from "./cart.route";
import orderRoute from "./order.route";

export default class Routes {
  constructor(app: Application) {
    app.use("/api", homeRoutes);
    app.use("/api/tutorials", tutorialRoutes);
    app.use("/api/productcatergory",productCategoryRoute)
    app.use("/api/productsubcatergory",productSubCategoryRoute)
    app.use('/api/products', productDetailRoutes);
    app.use('/admin', AdminRoutes);
    app.use('/users', UserRoutes);
    app.use('/api/address', AddressDetailRoutes);
    app.use('/api/wishlists', wishlistRoutes);
    app.use('/api/carts',cartRoute );
    app.use('/api/orders', orderRoute);

  }
}
