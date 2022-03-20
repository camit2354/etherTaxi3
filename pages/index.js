import React, { Component } from "react";
import { Card , Button , Container } from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css'
import mainServer from "../ethereum/mainServer";
import {Link} from '../routes' ;

class MainServer extends Component {
  
  static async getInitialProps() {
    const users = await mainServer.methods.getUsers().call();
    const drivers = await mainServer.methods.getDrivers().call();
    const ridePlatformInstances = await mainServer.methods.getRidePlatformInstances().call() ;
    
    let userProfiles = [] ;
    let driverProfiles = [] ;

    for(let user of users)
    {
      const userP = await mainServer.methods.userProfile(user).call() ;
      userProfiles.push(userP) ;
    }

    for(let driver of drivers)
    {
      const driverP = await mainServer.methods.driverProfile(driver).call() ;
      driverProfiles.push(driverP) ;
    }

    return {users,drivers,userProfiles,driverProfiles,ridePlatformInstances } ;
  }

  renderUsers(){
    const items = this.props.userProfiles.map(address =>{
      return {
        header : address ,
        description : (
        <Link route = {`profile/user/${address}`}>
        <a>Login</a>
        </Link> ) ,
        fluid : true 
      } ;
    }) ;

    return <Card.Group items = {items} />

  }

  renderDrivers(){
    const items = this.props.driverProfiles.map(address =>{
      return {
        header : address ,
        description : (
                <Link route = {`/profile/driver/${address}`} >
                <a>Login</a>
                </Link>  ) ,
        fluid : true 
      } ;
    }) ;

    return <Card.Group items = {items} />

  }

  renderRidePlatformInstances(){
    const items = this.props.ridePlatformInstances.map(address =>{
      return {
        header : address ,
        description : <a>Login</a> ,
        fluid : true 
      } ;
    }) ;

    return <Card.Group items = {items} />

  }

  render() {
    return (
    
    <Container>
      <h1>Main server home page !</h1>

      <Link route = "/register/user">
      <a>
        <Button
          content = "User Register"
          icon = "add circle"
          floated = "right"
          primary />

      </a>
      </Link>
     
      <Link route = "/register/driver">
      <a>
      <Button
        content = "Driver Register"
        icon = "add circle"
        floated = "right"
        primary />
         </a>
      </Link>

      <h2>users :</h2>
      <div>{this.renderUsers()}</div>
      

      <h2>Drivers : </h2>
      <div>{this.renderDrivers()}</div>

      <h2>ride platform instances :</h2>
      <div>{this.renderRidePlatformInstances()}</div>
      
    </Container>
      );
  }
}


export default MainServer;
