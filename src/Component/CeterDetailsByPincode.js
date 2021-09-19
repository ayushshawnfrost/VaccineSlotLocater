import { Component, Fragment } from 'react';
import axios from 'axios';
import Moment from 'moment';
import Center from './center';
import TextField from '@material-ui/core/TextField';
import DateFnsUtils from '@date-io/date-fns';
import Button from '@material-ui/core/Button';
import NavBar from './NavBar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import {
  MuiPickersUtilsProvider,
  // KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
// import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
// import Typography from '@material-ui/core/Typography';
// import Box from '@material-ui/core/Box';
import { TabPanel } from './TabPanel';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';

class CeterDetailsByPincode extends Component {
  constructor(props) {
    super(props)
    this.state = {
      centerDetails: [],
      pincode: "",
      selectedDate: new Date(),
      value: 0,
      pincodeValidation: false
    }
  }
  getCenterDetails = (e) => {
    e.preventDefault();
    // const pinCode = e.target.elements.pincode.value;
    // const date = e.target.elements.date.value;
    const dateDMY = Moment(this.state.selectedDate).format('DD-MM-YYYY');
    axios
      .get(
        `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${this.state.pincode}&date=${dateDMY}`
      )
      .then((response) => {
        this.setState({ centerDetails: response.data.sessions })
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleDateChange = (date) => {
    this.setState({ selectedDate: date });
  };

  handlePincodeChange = (e) => {
    this.setState((prevState) => { return { pincode: e.target.value, pincodeValidation: !(e.target.value.length === 6) } })
  }

  render() {
    return (
      <Fragment>

        <div className="formAlignCenter">
          <Box
            sx={{
              'bgcolor': '#FFFFFF',
              'border-radius': '5px',
              'padding': '2rem',
              // 'max-width':'50%',
              'align-items': 'center',
              // 'margin-left':"1rem",
              // "margin-right":"1rem",
              "margin-bottom": "1rem",
              "box-shadow": "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.22)",
              "min-height":"max-content"
            }}
          >
            <div clasName="form-card" >
              <h1>GET CENTER DETAILS NEAR YOU</h1>
              <form onSubmit={this.getCenterDetails}>
                <TextField
                  error={this.state.pincodeValidation}
                  className="cityCenter same-width"
                  label="Pincode"
                  onChange={this.handlePincodeChange}
                  helperText={this.state.pincodeValidation ? "Pincode should be 6 digit numeric (eg- 482001)." : ""} />
                <br></br>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    label="Select Date"
                    value={this.state.selectedDate}
                    onChange={this.handleDateChange}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                </MuiPickersUtilsProvider>
                <div className="button submit">
                  <Button onClick={this.getCenterDetails} className="otpButton" variant="contained" color="success" disabled={this.state.pincode.length !== 6}>Serach For Center</Button>
                </div>
              </form>
            </div>
          </Box>
          <Box
            sx={{
              'bgcolor': '#FFFFFF',
              ' border-radius': '5px',
              "box-shadow": "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.22)"
            }}
          >
            {this.state.centerDetails.length > 0 && <div className="card">
              {this.state.centerDetails.map((item) => (<Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography  > <div className="typo-pills">
                    <Chip label={item.vaccine} color="primary" />
                    {item.available_capacity_dose1 > 0 && <Chip variant="outlined" label={"DOSE-I"} color="success" />}
                    {item.available_capacity_dose2 > 0 && <Chip variant="outlined" label={"DOSE-II"} color="success" />}
                    <Chip variant="outlined" label={`AGE-${item.min_age_limit}+`} color="primary" /></div>
                    {item.name}


                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    <table>
                      <tr>
                        <td style={{ 'textAlign': 'center' }}> <strong>Address </strong> </td>
                        <td style={{ 'textAlign': 'center' }}> <strong>Min Age </strong> </td>
                        <td style={{ 'textAlign': 'center' }}> <strong>DOSE-I </strong> </td>
                        <td style={{ 'textAlign': 'center' }}> <strong>DOSE-II </strong> </td>
                        <td style={{ 'textAlign': 'center' }}> <strong>Fee </strong> </td>
                      </tr>

                      <tr>
                        <td>{item.address}</td>
                        <td>{item.min_age_limit}</td>
                        <td>{item.available_capacity_dose1}</td>
                        <td>{item.available_capacity_dose2}</td>
                        <td>{item.fee_type}</td>
                      </tr>
                    </table>
                  </Typography>
                </AccordionDetails>
              </Accordion>))}
            </div>}
          </Box>
        </div>

      </Fragment >
    );
  }
}

export default CeterDetailsByPincode;