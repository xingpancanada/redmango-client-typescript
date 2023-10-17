import React, { useEffect, useState } from 'react'
import { withAuthAdmin } from '../../HOC'
import { useGetOrdersQuery } from '../../Apis/orderApi'
import { MainLoader } from '../../Components/Page/Common';
import { OrderList } from '../../Components/Page/Order';
import { inputHelper } from '../../Helper';
import { SD_Status } from '../../Utility/SD';

const filterOptions = [
  "All",
  SD_Status.CONFIRMED,
  SD_Status.BEING_COOKED,
  SD_Status.READY_FOR_PICKUP,
  SD_Status.COMPLETED,
  SD_Status.CANCELLED,
  SD_Status.PENDING,
]

function AllOrders() {
  const [filters, setFilters] = useState({ searchString: "", status: "" });
  const [orderData, setOrderData] = useState([]);
  const [apiFilters, setApiFilters] = useState({
    searchString: "",
    status: ""
  });
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageOptions, setPageOptions] = useState({
    pageNumber: 1,
    pageSize: 5
  });
  const [currentPageSize, setCurrentPageSize] = useState(pageOptions.pageSize);

  // get all orders or get all orders with filters(userId, searchString, status)
  // const { data, isLoading } = useGetOrdersQuery({
  //   ...(filters && {
  //     searchString: filters.searchString,
  //     status: filters.status
  //   })
  // }); 

  // use below need click filter button, to avoid every input change to call api
  const { data, isLoading } = useGetOrdersQuery({
    ...(apiFilters && {
      searchString: apiFilters.searchString,
      status: apiFilters.status,
      pageNumber: pageOptions.pageNumber,
      pageSize: pageOptions.pageSize
    })
  });
  console.log("my orders data", data);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const tempValue = inputHelper(e, filters);
    setFilters(tempValue);
  };

  const handleFilter = () => {
    setApiFilters({
      searchString: filters.searchString,
      status: filters.status
    });
  }

  useEffect(() => {
    if (data) {
      setOrderData(data.apiResponse.result);
      const { TotalRecords } = JSON.parse(data.totalRecords); // {TotalRecords} from api response, not { totalRecords } !!!
      setTotalRecords(TotalRecords);
    }
  }, [data]);

  const getPageDetails = () => {
    const pageStartNumber = (pageOptions.pageNumber - 1) * pageOptions.pageSize + 1;
    const pageEndNumber = pageOptions.pageNumber * pageOptions.pageSize;

    return `${pageStartNumber} - ${pageEndNumber < totalRecords ? pageEndNumber : totalRecords} of ${totalRecords}`;
  }

  const handlePaginationClick = (direction: string) => {
    if(direction === 'prev'){
      setPageOptions({ pageSize: 5, pageNumber: pageOptions.pageNumber - 1});
    }
    if(direction === 'next'){
      setPageOptions({ pageSize: 5, pageNumber: pageOptions.pageNumber + 1});
    }
  }

  const handlePageSizeChange = (size: number) => {
    setPageOptions({ pageSize: size, pageNumber: 1});
    setCurrentPageSize(size);
  }


  return (
    <>
      {isLoading ? <MainLoader /> : (
        <>
          <div className='d-flex align-items-center justify-content-between mx-5 mt-5'>
            <h1 className="text-success">Orders List</h1>
            <div className='d-flex' style={{ width: '50%' }}>
              <input type="text" className="form-control" placeholder="Serch Name, Email or Phone" name="searchString" onChange={handleChange} />
              <select className="form-select w-50 mx-2" onChange={handleChange} name="status">
                {filterOptions.map((item, index) => (
                  <option key={index} value={item === 'All' ? "" : item}>{item}</option>
                ))}
              </select>
              <button className="btn btn-sm btn-outline-success" onClick={handleFilter}>Filter</button>
            </div>
          </div>
          <OrderList orderData={orderData} />
          <div className='d-flex mx-5 justify-content-end align-items-center'>
            <div className='mx-3 row align-items-center'>
              <select className="form-select mx-2" value={currentPageSize} style={{fontSize: '0.8rem', width: "80px"}} onChange={(e)=>handlePageSizeChange(+e.target.value)}>
                  <option>5</option>
                  <option>10</option>
                  <option>20</option>
                  <option>50</option>
                  <option>100</option>
              </select>
            </div>

            <button onClick={() => handlePaginationClick("prev")} disabled={pageOptions.pageNumber === 1} className='btn btn-outline-primary btn-sm px-2 mx-2' style={{fontSize: '0.6rem'}}>
              <i className='bi bi-chevron-left' style={{fontSize: '0.6rem'}}></i>
            </button>
            <div className="mx-2" style={{fontSize: '0.9rem'}}>{getPageDetails()}</div>
            <button onClick={() => handlePaginationClick("next")}  disabled={pageOptions.pageNumber * pageOptions.pageSize >= totalRecords} className='btn btn-outline-primary btn-sm px-2 mx-2' style={{fontSize: '0.6rem'}}>
              <i className='bi bi-chevron-right' style={{fontSize: '0.6rem'}}></i>
            </button>
          </div>
        </>
      )}
    </>
  )
}

export default withAuthAdmin(AllOrders)