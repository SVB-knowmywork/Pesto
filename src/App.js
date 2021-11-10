import './App.css';
import React, { useState, useEffect } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import TablePagination from '@mui/material/TablePagination';
import SearchBar from "material-ui-search-bar";

function App() {
  return (
    <div>
      <div className="App">
        <header className="App-header">
          <h1>Air Quality Index</h1>
          <AQI />
        </header>
      </div>
    </div>
  );
}

function AQI() {
  // State for saving AQI records to display
  // and to implement pagination in table
  const [aqiRecords, setAQIRecords] = useState([]);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searched, setSearched] = useState("");

  // for table pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // for table pagination
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // for aqi records filter
  const requestSearch = (searchedVal) => {
    const filteredRows = aqiRecords.filter((row) => {
      return (
        row.station.toLowerCase().includes(searchedVal.toLowerCase())
        || row.city.toLowerCase().includes(searchedVal.toLowerCase())
        || row.state.toLowerCase().includes(searchedVal.toLowerCase())
      );
    });
    setRows(filteredRows);
    setPage(0);
  };

  // to load all records
  const cancelSearch = () => {
    requestSearch(searched);
  };

  // for making API call to fetch AQI records using OGD
  useEffect(() => {
    fetch(
      `https://api.data.gov.in/resource/3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69?api-key=579b464db66ec23bdd000001fc7ab96079bd4a264029a32cdf375c99&format=json&offset=0&limit=5000`,
      {
        method: "GET",
        headers: new Headers({
          Accept: "application/json"
        })
      }
    )
      .then(res => res.json())
      .then(response => {
        setAQIRecords(response.records);
        setRows(response.records);
      })
      .catch(error => console.log(error));
  }, [searched]);

  // return the view
  return (
    <Box sx={{ width: '80%' }}>
      <SearchBar
          value={searched}
          onChange={(searchVal) => requestSearch(searchVal)}
          onCancelSearch={() => cancelSearch()} />
      <Paper sx={{ width: '100%', mb: 2, mt: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Station</TableCell>
                <TableCell align="right">City</TableCell>
                <TableCell align="right">State</TableCell>
                <TableCell align="right">Pollutant</TableCell>
                <TableCell align="right">AQI</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">{row.station}</TableCell>
                  <TableCell align="right">{row.city}</TableCell>
                  <TableCell align="right">{row.state}</TableCell>
                  <TableCell align="right">{row.pollutant_id}</TableCell>
                  <TableCell align="right">{row.pollutant_avg}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}

export default App;
