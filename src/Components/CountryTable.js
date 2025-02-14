
import { useState, useEffect, useMemo } from 'react';
import style from './CountryTable.module.css';
import { CountryData } from '../db.js';
import { debounce, Title, filterByRegion } from '../utils/Constant.js';
import { useNavigate } from "react-router-dom";

function CountryTable() {
  const navigate = useNavigate();
  const [countryData, setCountryData] = useState(CountryData)
  const [currentPage, setCurrentPage] = useState(1);
  const [toggleBtn, setToggleBtn] = useState(true);
  const [filter, setFilter] = useState({
    search: '',
    sortBy: '',
  })

  const totalPages = Math.ceil(countryData.length / 10);
  const paginatedData = countryData.slice((currentPage - 1) * 10, currentPage * 10);

  const getPageNumbers = useMemo(() => {
    const maxVisiblePages = 1;
    const pages = [];
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      pages.push(1, 2, 3, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }
    return pages;
  }, [currentPage, totalPages]);

  const handleSearch = useMemo(() => debounce((query) => {
    if (!query) {
      setCountryData(countryData);
    } else {
      setCountryData(
        countryData.filter(({ name }) =>
          name.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  }, 1000), []);

  useEffect(() => {
    handleSearch(filter.search);
  }, [filter.search, handleSearch]);

  const handleSort = (order) => {
    if (!order) {
      setCountryData(CountryData);
    } else {
      setCountryData([...countryData].sort((a, b) =>
        order === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      ));
    }
  };

  const handleRowClick = (item) => {
    navigate("/weather", { state: { country: item } });
  };

  return (
    <>
      <div className={style["table-container"]}>
        <div className={style["controls"]}>
          <input
            type="text"
            placeholder="Search country here..."
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            className={style["search-input"]}
          />
          <div className={style['filter-container']}>

            <select className={style["dropdown"]}
              onChange={(e) => handleSort(e.target.value)}
            >
              <option value="">Sort By</option>
              <option value="asc">A to Z</option>
              <option value="desc">Z to A</option>
            </select>
            <select className={style["dropdown"]}
              onChange={(e) => {
                if (!e.target.value) {
                  setCountryData(CountryData);
                } else {
                  const filterOrignalData = [...CountryData]
                  setCountryData(filterOrignalData.filter((item) => item.region === e.target.value));
                }
              }}
            >
              <option value="">Filter By Region</option>
              {filterByRegion.map((e, i) => (
                <option value={e} key={i}>{e}</option>
              ))}
            </select>
            <button className={style["toggle-btn"]} onClick={() => setToggleBtn(!toggleBtn)}>
              {toggleBtn ? "Switch to Table View" : "Switch to Grid View"}
            </button>
          </div>
        </div>

        {toggleBtn ? (
          <table className={style["custom-table"]}>
            <thead>
              <tr>
                {Title.map((e, i) => (
                  <th key={i}>{e}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                <>
                  {paginatedData?.map((item, index) => (
                    <tr key={index} onClick={() => handleRowClick(item?.capital)}>
                      <td>{item?.name}</td>
                      <td>{item?.capital}</td>
                      <td>{item?.region}</td>
                      <td>{item?.alpha2Code}</td>
                      <td>{item?.alpha3Code}</td>
                    </tr>
                  ))}
                </>
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>No countries available</td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <div className={style["grid-container"]}>
            {paginatedData.length > 0 ? (
              <>
                {paginatedData.map((item, index) => (
                  <div className={style["grid-card"]} key={index} onClick={() => handleRowClick(item?.capital)}>
                    <h2>{item?.name}</h2>
                    <p><strong>Capital:</strong> {item?.capital}</p>
                    <p><strong>Region:</strong> {item?.region}</p>
                    <p><strong>Alpha-2 Code:</strong> {item?.alpha2Code}</p>
                    <p><strong>Alpha-3 Code:</strong> {item?.alpha3Code}</p>
                  </div>
                ))}
              </>
            ) : (
              <h1 colSpan="5" style={{ textAlign: "center" }}>No countries available</h1>
            )}
          </div>
        )}

        <div className={style["pagination"]}>
          <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
            {"<"}
          </button>

          {getPageNumbers.map((num, i) => (
            <button
              key={i}
              onClick={() => typeof num === "number" && setCurrentPage(num)}
              className={currentPage === num ? style["active"] : ""}
              disabled={num === "..."}
            >
              {num}
            </button>
          ))}

          <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
            {">"}
          </button>
        </div>
      </div>


    </>
  );
}

export default CountryTable;
