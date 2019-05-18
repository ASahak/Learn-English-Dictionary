import firebase from 'firebase';
export default {
  data(){
    return {
    isBoolean:false,
    isLogined: this.isBoolean
    }
  },
    created(){
        firebase.auth().onAuthStateChanged(user =>{
          if(user){
            this.isBoolean = true  
          } 
          else{
            this.isBoolean =  false
          }
          })
    },
    // mouthed(){
    //   console.log(this.isLogined)
    // }
  }
  
