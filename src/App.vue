<template>
  <div id="app">
    <div class="mobilePhone"> 
      <div class="clock">{{hours +' : ' + minutes}}</div>
      <img src="./assets/mobile.png" alt="" class="d-none d-md-block">
      <header class="d-flex align-items-center justify-content-between">
        <div v-if="isLogined">
          <div class="adminPanel">
            <img src="./assets/admin.jpg" alt="">
            <span>Arthur</span>
            <i class="fa fa-caret-down" aria-hidden="true" @click="logOutDown"></i> 
          </div>
          <a  @click="logOut" class="logOut" ref="mySpan">Log out</a>
          
        </div> 
        <router-link v-else to="/admin">Log in</router-link>
        <router-link to="/">
          <img src="./assets/logo.png" alt="" class="img-fluid">
        </router-link>
        <router-link to="/add-word">
          Add Word
        </router-link>
      </header> 
      <router-view class="routerChange" ></router-view>
    </div>
    
  </div>
</template>

<script>
import firebase from 'firebase';
import auth from './auth';
import db from './main.js'
export default {
  name: 'app',
   data () {
    return {
     hours:(new Date().getHours() < 10) ? '0'+new Date().getHours(): new Date().getHours(),
     minutes: (new Date().getMinutes() < 10) ? '0'+new Date().getMinutes(): new Date().getMinutes(),
     isLogined:false,
     wordData:[]
   }
  },
  // firestore() {
  //     return {
  //       wordData: db.collection('words').orderBy('publication'),
  //     }
  //   },
  methods: {
    logOut(){
      this.$router.push({ path: '/admin' });
      firebase.auth().signOut()
    },
    logOutDown(){
      if(this.$refs.mySpan.getBoundingClientRect().height == 0){
        this.$refs.mySpan.style.height = 30 + "px"
      }
      else{
        this.$refs.mySpan.style.height = 0 + "px"
      }
    }
  },
  created() {
    var updateCurrentTime = ()=> {
      this.hours=(new Date().getHours() < 10) ? '0'+new Date().getHours(): new Date().getHours(),
      this.minutes= (new Date().getMinutes() < 10) ? '0'+new Date().getMinutes(): new Date().getMinutes()
    }
    setInterval(() => updateCurrentTime(), 1 * 1000);
   
    firebase.auth().onAuthStateChanged(user =>{
      if(user){
        auth.isLogined = true
        this.isLogined = auth.isLogined
      } 
      else{
        auth.isLogined = false
        this.isLogined = auth.isLogined
      }
    })
  }
  
}
</script>

<style>
  :root{
    background: #eae5e5;
  }
  .mobilePhone {
      position: absolute;
      width: 400px;
      margin: auto;
      left: 0;
      right: 0;
      top: 50px;
  }
  .clock {
    position: absolute;
    top: 66px;
    font-size: 12px;
    color: #fff;
    left: 60px;
  }
  header {
    position: absolute;
    width: 311px;
    top: 86px;
    background: #8c928d;
    left: 50px;
    right: 0;
    padding: 0 5px;
  }
  header img{
    max-width: 100px !important;

  }
  .adminPanel img{
    max-width: 30px !important;
    border-radius: 50%;
  }
  .adminPanel i{
    font-size: 12px;
    margin-left: 5px;
    cursor: pointer;
  }
  .adminPanel span{
    font-size: 12px;
    margin-left: 5px;
  }
  a.logOut {
    cursor: pointer;
    position: absolute;
    background: #fff;
    z-index: 2;
    top: 100%;
    width: 90px;
    left: 0;
    font-size: 12px;
    line-height: 27px;
    padding-left: 10px;
    height: 0px;
    transition: .4s;
    overflow: hidden;
  }
  .adminPanel{
    position: relative;
    display:flex;
    align-items: center;

  }
  header a{
    color: #09498e;
    font-size: 13px;
  }
  .routerChange{
    position: absolute;
    top: 126px;
    left: 50px;
    width: 311px;
    background: #b3b7b4
  }
  @media screen and (max-width: 767px){
    .mobilePhone {
    /* position: absolute; */
        width: 100%;
        margin: auto;
        left: 0;
        right: 0;
        top: 0;
    }
    .clock {
        position: relative;
        top: 0;
        font-size: 12px;
        color: #fff;
        left: 0;
        background: #000;
        width: 100%;
    }
    header {
        position: relative;
        width: 100%;
        top: 0;
        background: #8c928d;
        left: 0;
        right: 0;
        padding: 0 5px;
    }
    .routerChange {
        position: relative;
        top: 0;
        left: 0;
        width: 100%;
        background: #b3b7b4;
    }
  }
</style>
