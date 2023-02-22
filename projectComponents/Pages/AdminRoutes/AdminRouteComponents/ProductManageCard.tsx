import Image from "next/image";
import React, { useState } from "react";
import NOImage from "../../../Assets/Images/no-image.png";
import Select from "react-select";
import { labelConfig } from "../../../../config/siteConfig";
export type ProductManageCardProps = {
  state: boolean;
  metaHead: string;
  metaDesc: string;
  title: string;
  description: string;
  catagoryArr: any;
  subCatagoryArr: any;
  unitValue: any;
  minWeight: number;
  productImage: any;
  availableFlavours: any;
  customOptions: any;
};

const ProductManageCard = (props: ProductManageCardProps) => {
  const {
    state,
    metaHead,
    metaDesc,
    title,
    description,
    catagoryArr,
    subCatagoryArr,
    unitValue,
    minWeight,
    productImage,
    availableFlavours,
    customOptions,
  } = props;
  const [formData, setFormData] = useState({
    metaHead: metaHead,
    metaDesc: metaDesc,
    title: title,
    description: description,
    catagoryArr: catagoryArr,
    subCatagoryArr: subCatagoryArr,
    unitValue: unitValue,
    minWeight: minWeight,
    productImage: {
      imageUrl: productImage,
      preview: null,
      dataArr: null,
    },
    availableFlavours: availableFlavours,
    customOptions: customOptions,
  });
  const [flavourState, setFlavourState] = useState({
    flavour: "",
    value: 0,
  });
  const [customState, setCustomState] = useState({
    option: "",
    value: 0,
  });
  const [selectedCatagory, setSelectedCatagory] = useState(null);
  const [selectedSubCatagory, setSelectedSubCatagory] = useState(null);
  const [catagoryData, setCatagoryData] = useState({
    loading: false,
    data: [],
  });
  const [subcatagoryData, setSubcatagoryData] = useState({
    loading: false,
    data: [],
  });
  const setImage = (e: any) => {
    const fileArr = Array.from(e.target.files);
    const imageSrc = URL.createObjectURL(e.target.files[0]);
    setFormData((prev: any) => {
      return {
        ...prev,
        productImage: {
          ...prev.productImage,
          dataArr: fileArr,
          preview: imageSrc,
        },
      };
    });
  };
  const fetchCatagory = () => {};
  const fetchSubcatagory = () => {};
  return (
    <div className="form">
      <div className="form-section">
        <label>
          Metadata title <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type={"text"}
          className="data-value"
          value={formData?.metaHead}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData((prev: any) => {
              return { ...prev, metaHead: e.target.value };
            });
          }}
        />
      </div>
      <div className="form-section">
        <label>
          Metadata description <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type={"text"}
          className="data-value"
          value={formData?.metaDesc}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData((prev: any) => {
              return { ...prev, metaDesc: e.target.value };
            });
          }}
        />
      </div>
      <div className="form-section">
        <label>
          Product name <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type={"text"}
          className="data-value"
          value={formData?.title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData((prev: any) => {
              return { ...prev, title: e.target.value };
            });
          }}
        />
      </div>
      <div className="form-section textarea">
        <label>
          Product description <span style={{ color: "red" }}>*</span>
        </label>
        <textarea
          className="data-value textarea"
          value={formData?.description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setFormData((prev: any) => {
              return { ...prev, description: e.target.value };
            });
          }}
        />
      </div>
      <div className="form-section selection">
        <label>
          Catagory <span style={{ color: "red" }}>*</span>
        </label>
        {formData?.catagoryArr?.map((i: any) => {
          return (
            <div className="options">
              <div className="option-items">
                <Select
                  isSearchable={true}
                  defaultValue={i?.label}
                  placeholder={"Select catagory"}
                  onChange={(e: any) => {
                    setSelectedCatagory(e?.value);
                  }}
                  onFocus={fetchCatagory}
                  options={catagoryData?.data}
                  isLoading={catagoryData?.loading}
                />
              </div>
              <button className="edit-button">Delete</button>
            </div>
          );
        })}
        <div className="options">
          <div className="option-items">
            <Select
              isSearchable={true}
              defaultValue={null}
              placeholder={"Select catagory"}
              onChange={(e: any) => {
                setSelectedCatagory(e?.value);
              }}
              onFocus={fetchCatagory}
              options={catagoryData?.data}
              isLoading={catagoryData?.loading}
            />
          </div>
          <button className="edit-button">Add</button>
        </div>
      </div>
      <div className="form-section selection">
        <label>
          Sub catagory <span style={{ color: "red" }}>*</span>
        </label>
        {formData?.subCatagoryArr?.map((i: any) => {
          return (
            <div className="options">
              <div className="option-items">
                <Select
                  isSearchable={true}
                  defaultValue={i?.label}
                  placeholder={"Select catagory"}
                  onChange={(e: any) => {
                    setSelectedSubCatagory(e?.value);
                  }}
                  options={subcatagoryData?.data}
                  onFocus={fetchSubcatagory}
                  isLoading={subcatagoryData?.loading}
                />
              </div>
              <button className="edit-button">Delete</button>
            </div>
          );
        })}
        <div className="options">
          <div className="option-items">
            <Select
              isSearchable={true}
              defaultValue={null}
              placeholder={"Select catagory"}
              onChange={(e: any) => {
                setSelectedSubCatagory(e?.value);
              }}
              onFocus={fetchSubcatagory}
              options={subcatagoryData?.data}
              isLoading={subcatagoryData?.loading}
            />
          </div>
          <button className="edit-button">Add</button>
        </div>
      </div>
      <div className="form-section">
        <label>
          Unit price <span style={{ color: "red" }}>*</span>
        </label>
        <div>
          <span>{labelConfig?.inr_code}</span>
          <input
            type={"number"}
            className="data-value"
            value={formData?.unitValue ? formData?.unitValue : ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setFormData((prev: any) => {
                return { ...prev, unitValue: e.target.value };
              });
            }}
          />
        </div>
      </div>
      <div className="form-section">
        <label>Minimum weight</label>
        <input
          type={"number"}
          className="data-value"
          value={formData?.minWeight}
        />
      </div>
      <div className="form-section">
        <label>Product image</label>
        <div className="data-value image">
          {formData?.productImage?.dataArr === null &&
            formData?.productImage?.preview === null && (
              <Image src={NOImage} alt="No image" height={100} />
            )}
          {state ? (
            <>
              <button className="edit-button">Edit</button>
              <button className="edit-button">Delete</button>
            </>
          ) : (
            <button className="edit-button">Add</button>
          )}
          <button className="edit-button">Reset</button>
        </div>
        <input
          id="image-input"
          style={{ display: "none", appearance: "none" }}
          type={"file"}
          accept={"image/*"}
          multiple={false}
          onChange={setImage}
        />
      </div>
      <div className="form-section selection">
        <label>Available flavors</label>
        <div className="data-value">
          {formData?.availableFlavours?.length === 0 && state && (
            <div>No flavour available</div>
          )}
          {formData?.availableFlavours?.map((i: any) => {
            return (
              <div className="options">
                <div className="option-items">
                  <label>Flavour</label>
                  <input
                    className="data-value"
                    type={"text"}
                    value={i?.flavour}
                  />
                </div>
                <div className="option-items">
                  <label>Value</label>
                  <input
                    className="data-value"
                    type={"number"}
                    value={i?.value}
                  />
                </div>
                <button className="edit-button">Edit</button>
                <button className="edit-button">Delete</button>
              </div>
            );
          })}
          <div className="options">
            <div className="option-items">
              <label>Flavour</label>
              <input
                className="data-value"
                type={"text"}
                value={flavourState?.flavour}
              />
            </div>
            <div className="option-items">
              <label>Value</label>
              <input
                className="data-value"
                type={"number"}
                value={flavourState?.value}
              />
            </div>
            <button className="edit-button">Add</button>
          </div>
        </div>
      </div>
      <div className="form-section selection">
        <label>Custom options</label>
        <div className="data-value">
          {formData?.customOptions?.length === 0 && state && (
            <div>No customization available</div>
          )}
          {formData?.customOptions?.map((i: any) => {
            return (
              <div className="options">
                <div className="option-items">
                  <label>Option</label>
                  <input
                    className="data-value"
                    type={"text"}
                    value={i?.option}
                  />
                </div>
                <div className="option-items">
                  <label>Value</label>
                  <input
                    className="data-value"
                    type={"number"}
                    value={i?.value}
                  />
                </div>
                <button className="edit-button">Edit</button>
                <button className="edit-button">Delete</button>
              </div>
            );
          })}
          <div className="options">
            <div className="option-items">
              <label>Option</label>
              <input
                className="data-value"
                type={"text"}
                value={customState?.option}
              />
            </div>
            <div className="option-items">
              <label>Value</label>
              <input
                className="data-value"
                type={"number"}
                value={customState?.value}
              />
            </div>
            <button className="edit-button">Add</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManageCard;
