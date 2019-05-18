<template>
    <div class="formLogin">
      <div class="flashMessageError" v-bind:style='styleError'>The data you entered is incorrect</div>
      <h3 class="text-center mb-3">Login Admin</h3>
      <form @submit.prevent="loginAdmin">  
        <div class="form-group" @click="inputFocus($event)">
          <label for="email">Email</label>
          <input type="email" id="email" class="form-control" v-model="email" @blur="labelDown($event)" @focus="labelSame($event)">
        </div>
        <div class="form-group" @click="inputFocus($event)">
          <label for="password">Password</label>
          <input type="password" id="password" class="form-control" v-model="password" @blur="labelDown($event)"  @focus="labelSame($event)">
        </div>
        <button type="submit" class="adminButton">Login</button>
      </form>

    </div>
</template>
<script>
export default {
  name: 'Admin',
  data () {
    return {
      email:'',
      password:'',
      errors:[],
     
      styleError:{},
      
    }
  },
 
  methods:{
  
    loginAdmin(){
      var wm = this;
      if(wm.isFormValid()){
        wm.errors = [];
        
        firebase.auth().signInWithEmailAndPassword(wm.email, wm.password)
        .then((user)=>{
          this.$router.push({ path: '/' });
          
        }).catch((error)=>{
          this.styleError= {
            right:0
          }
          setTimeout(()=>{
           this.styleError= {
              right:0,
              display:'none'
            } 
          }, 3000)
          console.log(wm.errors.push(error.message))
        })
      }
    },

    isFormValid(){
      var wm = this;
      if(wm.email.length > 0 && wm.password.length > 0){
        return true
      }
      return false
    },
    labelSame(event){
       Array.prototype.map.call(event.target.parentElement.children, (elm, ind)=>{
        event.target.parentElement.children[0].style.top = -21+'px'
        event.target.parentElement.children[0].style.fontSize = 12+'px';
      })
    },
    inputFocus(event){
      Array.prototype.map.call(event.target.parentElement.children, (elm, ind)=>{
        event.target.parentElement.children[0].style.top = -21+'px'
        event.target.parentElement.children[0].style.fontSize = 12+'px';
      })
    },
    labelDown(event){
      if(event.target.value == ''){
        Array.prototype.map.call(event.target.parentElement.children, (elm, ind)=>{
          event.target.parentElement.children[0].style.top = 6+'px'
          event.target.parentElement.children[0].style.fontSize = 15+'px';
      })
      }
    }
  }
}
</script>
<style>
  .adminButton{
    background: #0084cd;
    border: 0;
    color: #fff;
    font-size: 13px;
    width: 55px;
    margin: auto;
    display: block;
    padding: 5px;
    cursor: pointer;
  }
.formLogin .form-group {
    margin-top: 25px;
  position: relative;
}
.formLogin label{
    position: absolute;
    top: 6px;
    left: 10px;
    font-size:15px; 
    transition: .4s;
    color: #929696;
}
  .formLogin{
    background: none;
    padding: 25px;
    padding-top: 65px;
    overflow: hidden;
  }
  .flashMessageError{
    position: absolute;
    top: 20px;
    transition: .4s;
    right: -100%;
    background: #f18a8a;
    color: #fff;
    padding: 5px;
    font-size: 12px;
  }

</style>
