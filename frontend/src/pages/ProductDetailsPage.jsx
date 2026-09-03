import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import ProductDetails from "../components/Products/ProductDetails";
import SuggestedProduct from "../components/Products/SuggestedProduct";
import { useSelector } from "react-redux";
import { productData as staticProducts } from "../static/data";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [searchParams] = useSearchParams();
  const isEvent = searchParams.get("isEvent");
  const { allProducts } = useSelector((state) => state.products);
  const { allEvents } = useSelector((state) => state.events);

  useEffect(() => {
    if (isEvent) {
      const eventItem = allEvents && allEvents.find((i) => i._id === id);
      setData(eventItem);
    } else {
      const list = allProducts && allProducts.length > 0 ? allProducts : staticProducts;
      const productItem = list && list.find((i) => i._id === id || String(i.id) === id);
      setData(productItem || list[0]);
    }
  }, [allProducts, allEvents, id, isEvent]);

  return (
    <div>
      <Header />
      <ProductDetails data={data} />
      {!isEvent && <>{data && <SuggestedProduct data={data} />}</>}
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
