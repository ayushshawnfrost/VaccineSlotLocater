import { Component, Fragment } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Moment from 'moment';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import {
    MuiPickersUtilsProvider,
    // KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Button from '@material-ui/core/Button';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';

class GetCenterByDistrict extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedStateID: "",
            selectedDistrictID: "",
            states: [],
            districts: [],
            centerDetails: [],
            selectedDate: new Date()
        }
    }

    componentDidMount = () => {

        this.getStates();
    }
    statesOnChange = (event) => {
        this.setState({ selectedStateID: event.target.value });
        this.getDistrict(event.target.value);
    };
    districtOnChange = (event) => {
        this.setState({ selectedDistrictID: event.target.value });
        // this.getCentersWithDistrictID(event.target.value);
    };
    handleDateChange = (date) => {
        this.setState({ selectedDate: date });
    };

    getStates = () => {

        axios
            .get(
                `https://cdn-api.co-vin.in/api/v2/admin/location/states`

            )
            .then((response) => {
                this.setState({ states: response.data.states });
            })
            .catch((err) => {
                console.log(err);
            });
    }
    getDistrict = (stateId) => {

        axios
            .get(
                `https://cdn-api.co-vin.in/api/v2/admin/location/districts/${stateId}`

            )
            .then((response) => {
                this.setState({ districts: response.data.districts })
            })
            .catch((err) => {
                console.log(err);
            });
    }
    getCentersWithDistrictID = () => {
        const dateDMY = Moment(this.state.selectedDate).format('DD-MM-YYYY');
        axios
            .get(
                `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${this.state.selectedDistrictID}&date=${dateDMY}`

            )
            .then((response) => {
                this.setState({ centerDetails: response.data.sessions })
            })
            .catch((err) => {
                console.log(err);
            });
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
                            "box-shadow": "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.22)"
                        }}
                    >
                        <h1>GET CENTER DETAILS NEAR YOU</h1>
                        <div>
                            <FormControl className="same-width">
                                <InputLabel id="demo-simple-select-label">STATES</InputLabel>
                                <Select
                                    variant="standard"
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={this.state.selectedStateID}
                                    onChange={this.statesOnChange}
                                >
                                    {this.state.states && this.state.states.map((item) => (
                                        <MenuItem value={item.state_id}>{item.state_name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div>
                            <FormControl className="same-width">
                                <InputLabel id="demo-simple-select-label">DISTRICT</InputLabel>
                                <Select
                                    variant="standard"
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={this.state.selectedDistrictID}
                                    onChange={this.districtOnChange}
                                >
                                    {this.state.districts && this.state.districts.map((item) => (
                                        <MenuItem value={item.district_id}>{item.district_name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div>
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
                        </div>

                        <Button onClick={this.getCentersWithDistrictID} variant="contained" disabled={!(this.state.selectedStateID && this.state.selectedDistrictID)}>Serach For Center</Button>


                    </Box>
                    <Box
                        sx={{
                            'bgcolor': '#FFFFFF',
                            'border-radius': '5px',
                            "box-shadow": "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.22)"
                        }}
                    >
                        {this.state.centerDetails.length > 0 &&
                            <div className="card">
                                {this.state.centerDetails.map((item) => (<Accordion>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                    >
                                        <Typography className="Typography">{item.name}  <Chip label={item.vaccine} color="primary" />
                                            {item.available_capacity_dose1 > 0 && <Chip variant="outlined" label={"DOSE-I"} color="success" />}
                                            {item.available_capacity_dose2 > 0 && <Chip variant="outlined" label={"DOSE-II"} color="success" />}</Typography>
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

export default GetCenterByDistrict;