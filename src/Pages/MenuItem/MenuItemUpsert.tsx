import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { inputHelper, toastNotify } from '../../Helper';
import { useCreateMenuItemMutation, useGetMenuItemByIdQuery, useUpdateMenuItemMutation } from '../../Apis/menuItemApi';
import { MainLoader } from '../../Components/Page/Common';
import { SD_Categories } from '../../Utility/SD';

const Categories = [
  // SD_Categories.APPETIZER,
  // SD_Categories.ENTREE,
  // SD_Categories.DESSERT,
  // SD_Categories.BEVERAGES,

  SD_Categories.FIGHTINGFISH,
  SD_Categories.GOLDFISH,
  SD_Categories.KOIFISH,
  SD_Categories.ANGELFISH,
];

const menuItemData = {
  name: "",
  description: "",
  specialTag: "",
  category: Categories[0],
  price: "",
};


function MenuItemUpsert() {
  const [menuItemInput, setMenuItemInput] = useState(menuItemData);
  const [imageToStore, setImageToStore] = useState<any>("");
  const [imageToDisplay, setImageToDisplay] = useState<string>("");
  const [loading, setIsLoading] = useState(false);
  const [createMenuItemMutation] = useCreateMenuItemMutation();
  const [updateMenuItemMutation] = useUpdateMenuItemMutation();
  const navigate = useNavigate();

  const { id } = useParams();
  const { data } = useGetMenuItemByIdQuery(id);
  useEffect(() => {
    if (data && data.result) {
      const tempData = {
        name: data.result.name,
        description: data.result.description,
        specialTag: data.result.specialTag,
        category: data.result.category,
        price: data.result.price,
      };
      setMenuItemInput(tempData);
      setImageToDisplay(data.result.image);
    }
  }, [data]);

  const handleMenuItemInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const tempData = inputHelper(e, menuItemInput);
    setMenuItemInput(tempData);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]
    if (file) {
      console.log("fiel:", file);
      const imgType = file.type.split("/")[1];
      const validImgTypes = ['jpg', 'png', 'jpeg'];

      const isImageTypeValid = validImgTypes.filter((e) => {
        return e === imgType;
      });

      if (file.size > 1000 * 1024) {
        setImageToStore("");
        toastNotify("File must be less than 1 MB", "error");
        return;
      } else if (isImageTypeValid.length === 0) {
        setImageToStore("");
        toastNotify("File must in jpg, jpeg or png", "error");
        return;
      };

      const reader = new FileReader();
      reader.readAsDataURL(file);

      setImageToStore(file);
      reader.onload = (e) => {
        const imgUrl = e.target?.result as string;
        setImageToDisplay(imgUrl);
      }

    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!imageToStore && !id) {
      toastNotify('Please upload an image', 'error');
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("Name", menuItemInput.name);
    formData.append("Description", menuItemInput.description);
    formData.append("SpecialTag", menuItemInput.specialTag ?? ''); // if no ?? '' here, SQL will save 'null' and react show 'null'. use ??'', SQL will save 'NULL', react shows nothing.
    formData.append("Category", menuItemInput.category);
    formData.append("Price", menuItemInput.price);
    if (imageToStore) {
      formData.append("File", imageToStore);
    }

    let resp: any;
    if (id) {
      formData.append("Id", id);
      resp = await updateMenuItemMutation({ data: formData, id: id });
    } else {
      resp = await createMenuItemMutation(formData);
    }

    if (resp) {
      setIsLoading(false);
      navigate('/menuitem/menuitemlist');
    }

    setIsLoading(false);
  }

  return (
    <div className="container border mt-5 p-5">
      {loading ? <MainLoader /> : (
        <>
          <h3 className="px-2 text-success">
            {id ? "Edit Menu Item" : "Add Menu Item"}
          </h3>
          <form method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
            <div className="row mt-3">
              <div className="col-md-7">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Name"
                  required
                  name="name"
                  value={menuItemInput.name}
                  onChange={handleMenuItemInput}
                />
                <textarea
                  className="form-control mt-3"
                  placeholder="Enter Description"
                  rows={5}
                  name="description"
                  value={menuItemInput.description}
                  onChange={handleMenuItemInput}
                ></textarea>
                <input
                  type="text"
                  className="form-control mt-3"
                  placeholder="Enter Special Tag"
                  name="specialTag"
                  value={menuItemInput.specialTag}
                  onChange={handleMenuItemInput}
                />
                <select
                  className="form-control form-select mt-3"
                  placeholder="Enter Category"
                  name="category"
                  value={menuItemInput.category}
                  onChange={handleMenuItemInput}
                >
                  {Categories.map((category, index) => (
                    <option value={category} key={index}>{category}</option>
                  ))}
                </select>
                <input
                  type="number"
                  className="form-control mt-3"
                  required
                  placeholder="Enter Price"
                  name="price"
                  value={menuItemInput.price}
                  onChange={handleMenuItemInput}
                />
                <input type="file" onChange={handleFileChange} className="form-control mt-3" />

                <div className='row'>
                  <div className="text-center col-6">
                    <button
                      onClick={() => navigate('/menuitem/menuitemlist')}
                      className="btn btn-secondary mt-4 form-control"
                    >
                      Back to Menu Items
                    </button>
                  </div>
                  <div className="text-center col-6">
                    <button
                      type="submit"
                      className="btn btn-success mt-4 form-control"
                    >
                      {id ? "Update" : "Create"}
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-5 text-center">
                <img
                  src={imageToDisplay}
                  style={{ width: "100%", borderRadius: "10px" }}
                  alt=""
                />
              </div>
            </div>
          </form>
        </>
      )}

    </div>
  )
}

export default MenuItemUpsert