import React, { useEffect, useRef, useState } from 'react';
import MenuItemCard from './MenuItemCard';
import { useGetMenuItemsQuery } from '../../../Apis/menuItemApi';
import { useDispatch, useSelector } from 'react-redux';
import { setMenuItem } from '../../../Storage/Redux/menuItemSlice';
import { menuItemModel } from '../../../Interfaces';
import { MainLoader } from '../Common';
import { RootState } from '../../../Storage/Redux/store';
import { SD_SortTypes } from '../../../Utility/SD';
import * as d3 from 'd3';

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

  // for d3js
  // const width = 500;
  // const height = 150;
  // const padding = 20;
  // const maxValue = 100;
  // const [chartdata, setChartdata] = useState<any>([]);
  // const svgRef = useRef();


  // useEffect(() => {
  //   fetch("https://redmangoreactnetcore.azurewebsites.net/api/MenuItem").then(resp => resp.json()).then(data => {
  //     console.log("fetch menuitem data:", data);
  //     setMenuItems(data.result);
  //   })
  // }, []);

  // return (
  //   <div className='row container'>
  //     {menuItems.length > 0 && menuItems.map((menuItem, index) => (
  //       <MenuItemCard key={index} menuItem={menuItem} />
  //     ))}
  //   </div>
  // )

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


  // useEffect(() => {
  //   const xScale = d3.scalePoint().domain(chartdata?.map((d: any) => d.name)).range([(0 + padding), (width - padding)]);
  //   const yScale = d3.scaleLinear().domain([0, d3.max(chartdata, (d: any) => d.price)]).range([height - padding, 0 + padding]);

  //   const line = d3.line().x((d: any)=> xScale(d.name)).y((d: any)=>yScale(d.price));

  //   d3.select(svgRef.current).select('path').attr('d', (value)=>line(chartdata)).attr('fill', 'none').attr('stroke', 'gray');

  //   const xAxis = d3.axisBottom(xScale);
  //   const yAxis = d3.axisLeft(yScale);

  //   d3.select('#xaxis').remove(); // clear firstly
  //   d3.select(svgRef.current).append('g').attr('transform', `translate(0, ${height-padding})`).attr('id', 'xaxis').call(xAxis);
  //   d3.select('#yaxis').remove(); // clear firstly
  //   d3.select(svgRef.current).append('g').attr('transform', `translate(${padding}, 0)`).attr('id', 'yaxis').call(yAxis);
  // }, [chartdata]);



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

      {/* <div>
        <svg id='chart' ref={svgRef} viewBox="0 0 500 150">
          <path d="" fill="none" stroke="gray" stroke-width="2" />
        </svg>
        <p>
          <button type="button" onClick={() => setChartdata(menuItems)} className='mt-5'>
            Chart data -- {JSON.stringify(menuItems)}
          </button>
        </p>
      </div> */}

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