import React, {
  useEffect,
  useState,
} from "react";

import { useSelector } from "react-redux";

import CardFeature from "./CardFeature";

import FilterProduct from "./FilterProduct";

const AllProduct = ({
  heading,
  data,
}) => {

// PRODUCT DATA
const reduxProductData = useSelector(
  (state) => state.product.productList
);

// USE FILTERED DATA OR REDUX DATA
const productData =
  data || reduxProductData;

  // CATEGORY LIST
  const categoryList = [
    ...new Set(
      productData.map(
        (el) => el.category
      )
    ),
  ];

  // FILTER STATE
  const [filterby, setFilterBy] =
    useState("");

  const [dataFilter, setDataFilter] =
    useState([]);

  // LOAD PRODUCTS
  useEffect(() => {

    setDataFilter(productData);

  }, [productData]);

  // FILTER PRODUCTS
  const handleFilterProduct = (
    category
  ) => {

    setFilterBy(category);

    const filter = productData.filter(
      (el) =>
        el.category.toLowerCase() ===
        category.toLowerCase()
    );

    setDataFilter([...filter]);
  };

  // LOADING
  const loadingArrayFeature =
    new Array(10).fill(null);

  return (
    <div className="my-5">

      {/* HEADING */}
      <h2 className="font-bold text-2xl text-slate-800 mb-4">

        {heading}

      </h2>

      {/* FILTER BUTTONS */}
      <div className="flex gap-4 justify-center overflow-scroll scrollbar-none">

        {categoryList[0] ? (

          categoryList.map((el) => {

            return (
              <FilterProduct
                category={el}
                key={el}
                isActive={
                  el.toLowerCase() ===
                  filterby.toLowerCase()
                }
                onClick={() =>
                  handleFilterProduct(el)
                }
              />
            );
          })

        ) : (

          <div className="min-h-[150px] flex justify-center items-center">

            <p>Loading...</p>

          </div>

        )}

      </div>

      {/* PRODUCTS */}
      <div className="flex flex-wrap justify-center gap-4 my-4">

        {dataFilter[0] ? (

          dataFilter.map((el) => {

            return (
              <CardFeature
                key={el._id}
                id={el._id}
                image={el.image}
                name={el.name}
                category={el.category}
                price={el.price}
              />
            );
          })

        ) : (

          loadingArrayFeature.map(
            (el, index) => (

              <CardFeature
                loading="Loading..."
                key={
                  index + "allProduct"
                }
              />

            )
          )

        )}

      </div>

    </div>
  );
};

export default AllProduct;