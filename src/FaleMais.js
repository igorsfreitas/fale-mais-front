import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {MenuItem, Select, InputLabel, Hidden, CircularProgress, Fade, TextField, Table, TableBody, TableCell, TableHead, TableRow} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import * as FaleMaisApi from './FaleMaisApi'

const styles = theme => ({
  root: {
    flexGrow: 1,
    overflow: 'hidden',
    padding: `0 ${theme.spacing.unit * 3}px`,
  },
  paper: {
    maxWidth: 1000,
    margin: `${theme.spacing.unit}px auto`,
    padding: theme.spacing.unit * 2,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  }
});



class FaleMais extends React.Component {
    constructor(props) {
        super(props);
      }
  
    state = {
        origin: '',
        destinie: '',
        plan: '',
        totalCallMinutes: '',
        open: false,
        plans:[],
        destinies:[],
        origins:[],
        loading: true,
        callValue: {}
    };

    componentDidMount = () => {
        this.getAllOrigins()
        this.getAllPlans()
    }

    getAllDestiniesByOriginId = originId => {
        FaleMaisApi.getAllDestiniesByOriginId(originId).then(destinies=>{
            this.setState(()=>{
              return {destinies: destinies, loading: false}
            })
        })
    }

    getAllOrigins = () => {
        FaleMaisApi.getAllOrigins().then(origins=>{
            this.setState(()=>{
              return {origins: origins, loading: false}
            })
        })
    }

    getAllPlans = () => {
        FaleMaisApi.getAllPlans().then(plans=>{
            this.setState(()=>{
              return {plans: plans, loading: false}
            })
        })
    }
    
    renderOrigins = () => {
       return this.state.origins.map(origin=>{
           return <MenuItem key={origin.id} value={origin.id}>{origin.origin}</MenuItem>
       })
    }

    renderDestinies = () => {
        return this.state.destinies.map(destinie=>{
            return <MenuItem key={destinie.id} value={destinie.id}>{destinie.destiny}</MenuItem>
        })
     }

    renderPlans = () => {
        return this.state.plans.map(plan=>{
            return <MenuItem key={plan.id} value={plan.id}>{plan.plan}</MenuItem>
        })
    }

    renderCallValues = () => {
        
        {
            if(this.state.callValue && this.state.callValue.withPlan && this.state.callValue.withPlan.plan){
                const origin = this.state.origins.filter(origin=>origin.id==this.state.origin)[0].origin
                const destiny = this.state.destinies.filter(destiny=>destiny.id==this.state.destinie)[0].destiny
                return (
                    <div>
                        <Hidden only={['sm', 'xs']}>
                            <Table className={this.props.classes.table} >
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Origem</TableCell>
                                        <TableCell align="right">Destino</TableCell>
                                        <TableCell align="right">Tempo</TableCell>
                                        <TableCell align="right">Plano FaleMais</TableCell>
                                        <TableCell align="right">Com FaleMais</TableCell>
                                        <TableCell align="right">Sem FaleMais</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell align="right">{origin}</TableCell>
                                        <TableCell align="right">{destiny}</TableCell>
                                        <TableCell align="right">{this.state.totalCallMinutes}</TableCell>
                                        <TableCell align="right">{this.state.callValue.withPlan.plan}</TableCell>
                                        <TableCell align="right">{this.formatMoney(this.state.callValue.withPlan.valueInCents/100)}</TableCell>
                                        <TableCell align="right">{this.formatMoney(this.state.callValue.withoutPlan.valueInCents/100)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table> 
                        </Hidden>

                        <Hidden only={['lg', 'md', 'xl']}>
                            <Table className={this.props.classes.table} >
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Origem</TableCell>
                                        <TableCell align="right">Destino</TableCell>
                                        <TableCell align="right">Tempo</TableCell>
                                        
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell align="right">{origin}</TableCell>
                                        <TableCell align="right">{destiny}</TableCell>
                                        <TableCell align="right">{this.state.totalCallMinutes}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="right">Plano FaleMais</TableCell>
                                        <TableCell align="right">Com FaleMais</TableCell>
                                        <TableCell align="right">Sem FaleMais</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="right">{this.state.callValue.withPlan.plan}</TableCell>
                                        <TableCell align="right">{this.formatMoney(this.state.callValue.withPlan.valueInCents/100)}</TableCell>
                                        <TableCell align="right">{this.formatMoney(this.state.callValue.withoutPlan.valueInCents/100)}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table> 
                        </Hidden>
                    </div>
                )
            }else{
                return null
            }
        }
        
    }

    getCallValue = () => {
        this.setState(()=>{
            return {loading: true}
        })
        FaleMaisApi.getCallValue(this.state.plan, this.state.destinie, this.state.totalCallMinutes).then(data=>{
            this.setState(()=>{
              return {callValue: data.data, loading: false}
            })
        })
    }

    validateFields = () => {
        return !this.state.plan || !this.state.destinie || !this.state.totalCallMinutes
    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.value, callValue:{} })
    };

    handleChangeOrigin = name => event => {
        this.setState({ [name]: event.target.value, callValue:{}, destinie: '' })
        this.getAllDestiniesByOriginId(event.target.value)
    };

    formatMoney = value => {
        const formated = "R$ " + value.toFixed(2).replace(".",",");
        return formated;
    }

    render(){
        const { classes } = this.props
        return (
            <div className={classes.root}>
            <Paper className={classes.paper}>
                <Grid container spacing={16}>
                    <Grid item lg={3} md={3} sm={6} xs={12}>
                        <TextField
                            id="origin-open-select"
                            select
                            label="Origem"
                            className={classes.textField}
                            value={this.state.origin}
                            onChange={this.handleChangeOrigin('origin')}
                            SelectProps={{
                                MenuProps: {
                                className: classes.menu,
                                },
                            }}
                            helperText="Selecione a Origem"
                            margin="normal"
                            >
                            {this.renderOrigins()}
                        </TextField>
                    </Grid>
                    <Grid item lg={3} md={3} sm={6} xs={12}>
                        <TextField
                            id="destinie-open-select"
                            select
                            label="Destino"
                            disabled={this.state.destinies.length<1}
                            className={classes.textField}
                            value={this.state.destinie}
                            onChange={this.handleChange('destinie')}
                            SelectProps={{
                                MenuProps: {
                                className: classes.menu,
                                },
                            }}
                            helperText="Selecione o destino"
                            margin="normal"
                            >
                            {this.renderDestinies()}
                        </TextField>
                    </Grid>
                    <Grid item lg={3} md={3} sm={6} xs={12}>
                        <TextField
                            id="plan-open-select"
                            select
                            label="Plano"
                            className={classes.textField}
                            value={this.state.plan}
                            onChange={this.handleChange('plan')}
                            SelectProps={{
                                MenuProps: {
                                className: classes.menu,
                                },
                            }}
                            helperText="Selecione o plano"
                            margin="normal"
                            >
                            {this.renderPlans()}
                        </TextField>
                    </Grid>
                    <Grid item lg={3} md={3} sm={6} xs={12}>
                        <TextField
                        id="filled-name"
                        label="Minutos ligação"
                        name="totalCallMinutes"
                        className={classes.textField}
                        value={this.state.totalCallMinutes}
                        onChange={this.handleChange('totalCallMinutes')}
                        margin="normal"
                        variant="filled"
                        />
                    </Grid>
                </Grid>
                <Grid container wrap="nowrap" spacing={16}>
                    <Grid item lg>
                        <Button onClick={()=>this.getCallValue()} disabled={this.validateFields()} variant="contained" color="primary">
                            Simular
                        </Button>
                    </Grid>
                </Grid>
                <Grid container wrap="nowrap" spacing={16}>
                    <Fade
                        in={this.state.loading}
                        style={{
                        transitionDelay: this.state.loading ? '100ms' : '0ms',
                        }}
                        unmountOnExit
                    >
                        <CircularProgress />
                    </Fade>
                    {this.renderCallValues()}
                </Grid>
            </Paper>
            </div>
        );
    }
  
}

FaleMais.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FaleMais);