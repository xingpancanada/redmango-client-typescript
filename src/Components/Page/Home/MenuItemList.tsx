import React, { useEffect, useRef, useState } from 'react';
import MenuItemCard from './MenuItemCard';
import { useGetMenuItemsQuery } from '../../../Apis/menuItemApi';
import { useDispatch, useSelector } from 'react-redux';
import { setMenuItem } from '../../../Storage/Redux/menuItemSlice';
import { menuItemModel } from '../../../Interfaces';
import { MainLoader } from '../Common';
import { RootState } from '../../../Storage/Redux/store';
import { SD_SortTypes } from '../../../Utility/SD';

function MenuItemList() {
  const [menuItems, setMenuItems] = useState<menuItemModel[]>([]);
  const searchValue = useSelector((state: RootState) => state.menuItemStore.search);

  const [selectedCategroy, setSelectedCategroy] = useState("All");
  const [categoryList, setCategoryList] = useState([]);

  const [sortType, setSortType] = useState(SD_SortTypes.NAME_A_Z);
  const sortOptions: Array<SD_SortTypes> = [
    SD_SortTypes.NAME_A_Z,
    SD_SortTypes.NAME_Z_A,
    SD_SortTypes.PRICE_LOW_HIGH,
    SD_SortTypes.PRICE_HIGH_LOW,
  ];

  //228. call slice to fetch data
  const dispatch = useDispatch();
  const { data, isLoading, isSuccess, isError, error } = useGetMenuItemsQuery(null);

  //326
  useEffect(() => {
    if (data && data.result) {
      const tempMenuItemsArray = handleFilters(sortType, selectedCategroy, searchValue);
      setMenuItems(tempMenuItemsArray); // set on local for searched items
    }
  }, [searchValue]);

  const handleFilters = (sortType: SD_SortTypes, category: string, search: string) => {
    let tempArray = category === 'All' ? [...data.result] : data.result.filter((item: menuItemModel) => item.category.toLowerCase() === category.toLowerCase());  //if no search, return all items

    if (search) { //this makes sure that data go back to all items when the search changes to empty
      const tempSearchMenuItems = [...tempArray];
      tempArray = tempSearchMenuItems.filter((item: menuItemModel) => item.name.toLowerCase().includes(search.toLowerCase()));
    }

    //sort
    if (sortType === SD_SortTypes.PRICE_LOW_HIGH) {
      tempArray.sort((a: menuItemModel, b: menuItemModel) => a.price - b.price);
    }
    if (sortType === SD_SortTypes.PRICE_HIGH_LOW) {
      tempArray.sort((a: menuItemModel, b: menuItemModel) => b.price - a.price);
    }
    if (sortType === SD_SortTypes.NAME_A_Z) {
      tempArray.sort((a: menuItemModel, b: menuItemModel) => a.name.toUpperCase().charCodeAt(0) - b.name.toUpperCase().charCodeAt(0));
    }
    if (sortType === SD_SortTypes.NAME_Z_A) {
      tempArray.sort((a: menuItemModel, b: menuItemModel) => b.name.toUpperCase().charCodeAt(0) - a.name.toUpperCase().charCodeAt(0));
    }

    return tempArray;
  }

  const handleCategoryClick = (i: number) => {
    const buttons = document.querySelectorAll(".custom-buttons");
    let localCategory;
    buttons.forEach((button, index) => {
      if (index === i) {
        button.classList.add("active");
        if (index === 0) {
          localCategory = "All";
        } else {
          localCategory = categoryList[index];
        }
        setSelectedCategroy(localCategory);

        const tempArray = handleFilters(sortType, localCategory, searchValue);
        setMenuItems(tempArray); //should setMenuItems here when click categroy
      } else {
        button.classList.remove("active");
      }
    })
  }

  const handleSortClick = (i: number) => {
    setSortType(sortOptions[i]);

    const tempArray = handleFilters(sortOptions[i], selectedCategroy, searchValue);
    setMenuItems(tempArray); //should setMenuItems here when click categroy
  }

  useEffect(() => {
    if (!isLoading) {
      dispatch(setMenuItem(data?.result)); //setMenuItems via slice to save all menu items
      setMenuItems(data?.result);

      const tempCategoryList = ['All'];
      // check category in categorylist or not; if not, add to categorylist
      data.result.forEach((item: menuItemModel) => {
        if (tempCategoryList.indexOf(item.category) === -1) {
          tempCategoryList.push(item.category);
        }
      });
      setCategoryList(tempCategoryList);
    }
  }, [data?.result, dispatch, isLoading]);



  if (isLoading) {
    return <MainLoader />
  }

  //if(menuItems.length > 0) {
  return (
    <div className='row container'>
      <div className='my-3'>
        <ul className='nav w-100 d-flex justify-content-center'>
          {categoryList.map((categoryName: string, index: number) => (
            <li className='nav-item' key={index}>
              <button onClick={() => handleCategoryClick(index)} className={`nav-link p-0 pb-2 custom-buttons fs-6 ${index === 0 && 'active'}`} style={{ marginLeft: 'auto' }}>{categoryName}</button>
            </li>
          ))}

          <li className='nav-item dropdown' style={{ marginLeft: 'auto' }}>
            <div className='nav-link dropdown-toggle text-dark fs-6 border rounded' role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Sort&nbsp;&nbsp;
            </div>
            <ul className='dropdown-menu'>
              {sortOptions.map((sortType, index) => (
                <li key={index} className='dropdown-item' onClick={() => handleSortClick(index)} style={{ fontSize: '0.9rem' }}>
                  {sortType}
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>


      {menuItems.length > 0 && menuItems.map((menuItem: menuItemModel, index: number) => (
        <MenuItemCard key={index} menuItem={menuItem} />
      ))}
    </div>
  )
  //}

  // return (
  //   <div className='row container'>
  //     {data.result.length > 0 && data.result.map((menuItem: menuItemModel, index: number) => (
  //       <MenuItemCard key={index} menuItem={menuItem} />
  //     ))}
  //   </div>
  // )

}

export default MenuItemList