import React from 'react'
import { useDeleteMenuItemMutation, useGetMenuItemsQuery } from '../../Apis/menuItemApi';
import { MainLoader } from '../../Components/Page/Common';
import { menuItemModel } from '../../Interfaces';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../Storage/Redux/store';
import { toast } from 'react-toastify';

function MenuItemList() {
  //const data: menuItemModel[] = useSelector((state: RootState) => state.menuItemStore.menuItem); //if use store, cannot get data when refresh page

  const { data, isLoading, isSuccess, isError, error } = useGetMenuItemsQuery(null);
  const navigate = useNavigate();

  const [deleteMenuItemMutation] = useDeleteMenuItemMutation();

  const handleDeleteMenuItem = async (id: number) => {
    toast.promise(
      deleteMenuItemMutation(id),
      {
        pending: 'Processing...',
        success: 'Menu item deleted successfully',
        error: 'Error encountered'
      },
      {
        theme: 'dark',
        hideProgressBar: true,
        autoClose:3000,
      }
    )
  }

  return (
    <>
      {isLoading ? <MainLoader /> : (
        <div className="table p-5">
          <div className="d-flex align-items-center justify-content-between">
            <h1 className="text-success">MenuItem List</h1>
            <button onClick={() => navigate('/menuitem/menuitemupsert')} className="btn btn-success">Add New Menu Item</button>
          </div>
          <div className="p-2">
            <div className="row border">
              <div className="col-1">Image</div>
              <div className="col-1">ID</div>
              <div className="col-2">Name</div>
              <div className="col-2">Category</div>
              <div className="col-2">Special Tag</div>
              <div className="col-2">Price</div>
              <div className="col-1">Action</div>
            </div>
            {data.result.map((menuItem: menuItemModel) => (
              <div className="row border" key={menuItem.id} style={{ fontSize: '0.9rem' }}>
                <div className="col-1">
                  <img
                    src={menuItem.image}
                    alt="no content"
                    style={{ width: "100%", maxWidth: "120px", borderRadius: '3px' }}
                  />
                </div>
                <div className="col-1">{menuItem.id}</div>
                <div className="col-2">{menuItem.name}</div>
                <div className="col-2">{menuItem.category}</div>
                <div className="col-2">{menuItem.specialTag}</div>
                <div className="col-2">{menuItem.price}</div>
                <div className="col-1">
                  <div className='d-flex'>
                    <button onClick={() => navigate('/menuitem/menuitemupsert/' + menuItem.id)} className="btn btn-sm btn-success">
                      <i className="bi bi-pencil-fill"></i>
                    </button>
                    <button onClick={() => handleDeleteMenuItem(menuItem.id)} className="btn btn-sm btn-danger mx-2">
                      <i className="bi bi-trash-fill"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default MenuItemList